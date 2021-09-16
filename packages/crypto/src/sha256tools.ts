import fs from "fs";
import sjcl from "sjcl";
import { utils } from "ethers";

export function sha256FromFile(
  pathToFile: string,
  chunkSize: number
): Promise<string> {
  const hash = new sjcl.hash.sha256();

  const readStream = fs.createReadStream(pathToFile, {
    highWaterMark: chunkSize,
  });

  return new Promise<string>((resolve, reject) => {
    readStream.on("data", (chunk) => {
      hash.update(sjcl.codec.hex.toBits(chunk.toString("hex")));
    });

    readStream.on("end", () => {
      resolve(sjcl.codec.hex.fromBits(hash.finalize()));
    });

    readStream.on("error", (err) => {
      reject(err);
    });
  });
}

export const getBytes32FromString = (str: string) => {
  return utils.arrayify(utils.formatBytes32String(str));
};
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
