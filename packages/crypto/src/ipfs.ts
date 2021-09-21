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
  const folderInfo = await ipfs.add(
    // @ts-ignore
    globSource(folderPath, { recursive: true })
  );
  return folderInfo?.cid.toString() ?? null;
};

export const ipfsUploadFile = async (
  ipfs: IPFSHTTPClient,
  filePath: string
): Promise<string | null> => {
  const folderInfo = await ipfs.add(
    // @ts-ignore
    globSource(filePath)
  );
  return folderInfo?.cid.toString() ?? null;
};

export const ipfsUploadBuffer = async (
  ipfs: IPFSHTTPClient,
  buffer: Buffer
): Promise<string | null> => {
  const fileInfo = await ipfs.add(buffer);
  return fileInfo?.cid.toString() ?? null;
};
