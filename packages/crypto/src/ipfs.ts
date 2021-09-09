import { create, globSource, IPFSHTTPClient } from "ipfs-http-client";

// "/ip4/0.0.0.0/tcp/5001"
export const ipfsCreateClient = (url: string): IPFSHTTPClient => {
  return create({
    url,
  });
};

export const ipfsUploadFolder = async (
  ipfs: IPFSHTTPClient,
  folderPath: string
): Promise<string | null> => {
  try {
    console.log(1);
    const folderInfo = await ipfs.add(
      // @ts-ignore
      globSource(folderPath, { recursive: true })
    );
    console.log(2);
    console.log("uF: ", folderInfo?.cid.toString());
    return folderInfo?.cid.toString() ?? null;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const ipfsUploadFile = async (
  ipfs: IPFSHTTPClient,
  filePath: string
): Promise<string | null> => {
  try {
    console.log(1);
    const folderInfo = await ipfs.add(filePath);
    console.log(2);
    console.log("uF: ", folderInfo?.cid.toString());
    return folderInfo?.cid.toString() ?? null;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const ipfsUploadBuffer = async (
  ipfs: IPFSHTTPClient,
  buffer: Buffer
): Promise<string | null> => {
  try {
    const fileInfo = await ipfs.add(buffer);

    console.log("uB: ", fileInfo?.cid.toString());
    return fileInfo?.cid.toString() ?? null;
  } catch (err) {
    console.log(err);
  }
  return null;
};
