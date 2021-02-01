export interface DemoHeader {
  demoVersion: number;
  netVersion: number;
  serverName: string;
  clientName: string;
  mapName: string;
  gameDir: string;
  playbackTime: number;
  numTicks: number;
  numFrames: number;
  signonLength: number;
}

export class InvalidDemoFileError extends Error {
  constructor() {
    super();
    this.message = "Invalid demo file";
    this.name = "InvalidDemoFileError";
  }
}
