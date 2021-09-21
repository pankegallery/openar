import fs from "fs";
import sjcl from "sjcl";
import { isHexString } from "@ethersproject/bytes";

export function sha256FromFile(
  pathToFile: string,
  chunkSize: number = 16 * 1024
): Promise<string> {
  const hash = new sjcl.hash.sha256();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const readStream = fs.createReadStream(pathToFile, {
    highWaterMark: chunkSize,
  });

  return new Promise<string>((resolve, reject) => {
    readStream.on("data", (chunk) => {
      hash.update(sjcl.codec.hex.toBits(chunk.toString("hex")));
    });

    readStream.on("end", () => {
      resolve("0x".concat(sjcl.codec.hex.fromBits(hash.finalize())));
    });

    readStream.on("error", (err) => {
      reject(err);
    });
  });
}

/**
 * Generates the sha256 hash from a buffer and returns the hash hex-encoded
 *
 * @param buffer
 */
export function sha256FromBuffer(buffer: Buffer): string {
  const bitArray = sjcl.codec.hex.toBits(buffer.toString("hex"));
  const hashArray = sjcl.hash.sha256.hash(bitArray);
  return "0x".concat(sjcl.codec.hex.fromBits(hashArray));
}

/**
 * Generates a sha256 hash from a 0x prefixed hex string and returns the hash hex-encoded.
 * Throws an error if `data` is not a hex string.
 *
 * @param data
 */
export function sha256FromHexString(data: string): string {
  if (!isHexString(data)) {
    throw new Error(`${data} is not valid 0x prefixed hex`);
  }

  const bitArray = sjcl.codec.hex.toBits(data);
  const hashArray = sjcl.hash.sha256.hash(bitArray);
  return "0x".concat(sjcl.codec.hex.fromBits(hashArray));
}

export function sha256FromString(str: string): string {
  return sha256FromBuffer(Buffer.from(str));
}
