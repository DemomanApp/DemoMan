export default class StreamReader {
  buf: Buffer;

  index: number;

  constructor(_buf: Buffer) {
    this.buf = _buf;
    this.index = 0;
  }

  readString(length: number) {
    const result = this.buf.toString("utf8", this.index, this.index + length);
    this.index += length;
    // Remove trailing NUL characters
    return result.split("\0", 1)[0];
  }

  readInt() {
    const result = this.buf.readInt32LE(this.index);
    this.index += 4;
    return result;
  }

  readFloat() {
    const result = this.buf.readFloatLE(this.index);
    this.index += 4;
    return result;
  }

  setIndex(_index: number) {
    if (_index > this.buf.length || _index < 0) {
      throw new RangeError();
    }
    this.index = _index;
  }
}
