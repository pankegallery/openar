import fs from "fs";
import sjcl from "sjcl";

export function sha256FromFile(
  pathToFile: string,
  chunkSize: number
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
      resolve(sjcl.codec.hex.fromBits(hash.finalize()));
    });

    readStream.on("error", (err) => {
      reject(err);
    });
  });
}
