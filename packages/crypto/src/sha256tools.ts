import sjcl from "sjcl";

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
