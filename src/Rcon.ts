import net from "net";

import log from "electron-log";

// See the RCON protocol documentation at
// https://developer.valvesoftware.com/wiki/Source_RCON_Protocol

enum RconPacketType {
  SERVERDATA_RESPONSE_VALUE = 0,
  SERVERDATA_EXECCOMMAND = 2,
  SERVERDATA_AUTH_RESPONSE = 2,
  SERVERDATA_AUTH = 3,
}

type RconCommandSuccessCallback = (response?: string) => void;
type RconCommandErrorCallback = (reason: string) => void;
type RconCommandCallbacks = {
  onSuccess: RconCommandSuccessCallback;
  onError: RconCommandErrorCallback;
};

interface RconPacket {
  id: number;
  type: RconPacketType;
  body: string;
}

function formatBuffer(buffer: Buffer) {
  return buffer.toString("hex").match(/../g)?.join(" ");
}

function buildPacket(packet: RconPacket): Buffer {
  const size = Buffer.byteLength(packet.body) + 14;
  const buffer = Buffer.alloc(size);

  buffer.writeInt32LE(size - 4, 0);
  buffer.writeInt32LE(packet.id, 4);
  buffer.writeInt32LE(packet.type, 8);
  buffer.write(packet.body, 12, size - 2, "ascii");
  buffer.writeInt16LE(0, size - 2);

  return buffer;
}

function readPacket(buffer: Buffer): RconPacket {
  log.debug("[RCON]\tReading packet:", formatBuffer(buffer));
  const id = buffer.readInt32LE(0);
  const type = buffer.readInt32LE(4);
  // The -2 removes two null bytes at the end of each packet:
  // One is terminating the body, the other signals the end of the packet.
  const body = buffer.toString("ascii", 8, buffer.length - 2);
  const packet: RconPacket = { id, type, body };
  log.debug("[RCON]\tDecoded packet:", packet);
  return packet;
}

function readPackets(buffer: Buffer): RconPacket[] {
  log.debug("[RCON]\tReceived packets:", formatBuffer(buffer));
  let bytesRead = 0;
  const packets: RconPacket[] = [];
  while (bytesRead < buffer.length) {
    const size = buffer.readInt32LE(bytesRead);
    const packet = buffer.slice(bytesRead + 4, bytesRead + 4 + size);
    packets.push(readPacket(packet));
    bytesRead += 4 + size;
  }
  return packets;
}

class RconConnection {
  port?: number;

  password?: string;

  socket?: net.Socket;

  // Sequence number used for the id field in RCON packets
  seq = 0;

  // Success and error callbacks to be called after a command was executed.
  // Callbacks to call after establishing a connection are at index -1.
  callbacks: Record<number, RconCommandCallbacks> = [];

  connected = false;

  connect = (
    port: number,
    password: string,
    onSuccess: RconCommandSuccessCallback,
    onError: RconCommandErrorCallback
  ) => {
    this.seq = 0;
    this.callbacks = [];
    try {
      this.socket = net.createConnection({ port }, () => {
        log.debug("[RCON]\tAttempting auth");
        this.sendPacket(RconPacketType.SERVERDATA_AUTH, password);
      });
    } catch (e) {
      log.debug("[RCON]\tConnection error", e);
      onError(e.code);
      return;
    }
    log.debug("[RCON]\tSocket created");
    this.socket.on("data", this.handleData);
    this.socket.on("close", this.handleClose);
    this.socket.on("error", this.handleError);

    this.callbacks[-1] = { onSuccess, onError };
  };

  sendPacket(type: RconPacketType, body: string) {
    if (this.socket !== undefined) {
      const packet: RconPacket = { id: this.seq, type, body };
      log.debug("[RCON]\tSending packet:", packet);
      const packetBytes = buildPacket(packet);
      log.debug("[RCON]\tEncoded packet:", formatBuffer(packetBytes));
      this.socket.write(packetBytes);
    }
  }

  executeCommand = (
    cmd: string,
    onSuccess: RconCommandSuccessCallback,
    onError: RconCommandErrorCallback
  ) => {
    if (this.connected) {
      this.sendPacket(RconPacketType.SERVERDATA_EXECCOMMAND, cmd);
      this.callbacks[this.seq] = { onError, onSuccess };
      this.seq += 1;
    } else {
      onError("ENOTCONNECTED");
    }
  };

  handleData = (data: Buffer) => {
    const packets = readPackets(data);
    for (let i = 0; i < packets.length; i += 1) {
      const packet = packets[i];
      let callback: RconCommandCallbacks;
      switch (packet.type) {
        case RconPacketType.SERVERDATA_AUTH_RESPONSE:
          callback = this.callbacks[-1];
          if (callback !== undefined) {
            if (packet.id === -1) {
              log.debug("[RCON]\tAuthentication failed");
              callback.onError("EPASSWD");
            } else {
              log.debug("[RCON]\tAuthentication success");
              this.connected = true;
              callback.onSuccess();
            }
            delete this.callbacks[-1];
          }
          break;
        case RconPacketType.SERVERDATA_RESPONSE_VALUE:
          callback = this.callbacks[packet.id];
          if (callback !== undefined) {
            callback.onSuccess(packet.body);
            delete this.callbacks[packet.id];
          } else {
            log.debug("[RCON]\tReceived unexpected packet", packet);
          }
          break;
        default:
          log.debug("[RCON]\tInvalid packet type!");
          break;
      }
    }
  };

  handleClose = (had_error: boolean) => {
    log.debug("[RCON]\tSocket closed, had error:", had_error);
    this.callbacks = {};
    this.connected = false;
  };

  handleError = (e: Error & { code: string }) => {
    log.debug("[RCON]\tCaught socket error:", e.code);
    Object.values(this.callbacks).forEach((cb) => {
      cb.onError(e.code);
    });
  };
}

const rconConnection = new RconConnection();
export default rconConnection;
