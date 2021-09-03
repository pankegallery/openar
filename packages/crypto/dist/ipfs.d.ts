/// <reference types="node" />
import { IPFSHTTPClient } from "ipfs-http-client";
export declare const ipfsCreateClient: (url: string) => IPFSHTTPClient;
export declare const ipfsUploadFolder: (ipfs: IPFSHTTPClient, folderPath: string) => Promise<string | null>;
export declare const ipfsUploadFile: (ipfs: IPFSHTTPClient, filePath: string) => Promise<string | null>;
export declare const ipfsUploadBuffer: (ipfs: IPFSHTTPClient, buffer: Buffer) => Promise<string | null>;
