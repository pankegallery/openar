/// <reference types="node" />
import { Wallet, BigNumber } from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { BidShares, DecimalValue, EIP712Domain, EIP712Signature, MediaData } from "./types";
export declare function validateBytes32(value: BytesLike): void;
export declare function validateBidShares(platform: DecimalValue, pool: DecimalValue, creator: DecimalValue, owner: DecimalValue, prevOwner: DecimalValue): void;
export declare const openARConstructBidShares: (platform: number, pool: number, creator: number, owner: number, prevOwner: number) => BidShares;
/**
 * Signs a openAR MintWithSig Payload by EIP-712
 *
 * @param owner
 * @param contentHash
 * @param metadataHash
 * @param creatorShareBN
 * @param nonce
 * @param deadline
 * @param domain
 */
export declare const generateSignMintWithSigMessageData: (contentHash: BytesLike, metadataHash: BytesLike, creatorShareBN: BigNumber, nonce: number, deadline: number, domain: EIP712Domain) => {
    types: {
        EIP712Domain: {
            name: string;
            type: string;
        }[];
        MintWithSig: {
            name: string;
            type: string;
        }[];
    };
    primaryType: "MintWithSig" | "EIP712Domain";
    domain: EIP712Domain;
    message: {
        contentHash: BytesLike;
        metadataHash: BytesLike;
        creatorShare: string;
        nonce: number;
        deadline: number;
    };
};
/**
 * Signs a openAR MintWithSig Message as specified by EIP-712
 *
 * @param owner
 * @param contentHash
 * @param metadataHash
 * @param creatorShareBN
 * @param nonce
 * @param deadline
 * @param domain
 */
export declare const signMintWithSigMessageFromWallet: (owner: Wallet, contentHash: BytesLike, metadataHash: BytesLike, creatorShareBN: BigNumber, nonce: number, deadline: number, domain: EIP712Domain) => Promise<EIP712Signature>;
export declare const recoverSignatureFromMintWithSig: (contentHash: BytesLike, metadataHash: BytesLike, creatorShareBN: BigNumber, nonce: number, deadline: number, domain: EIP712Domain, eipSig: EIP712Signature) => Promise<string>;
/**
 * Returns the proper network name for the specified chainId
 *
 * @param chainId
 */
export declare function chainIdToNetworkName(chainId: number): string;
/**
 * Validates the URI is prefixed with `https://`
 *
 * @param uri
 */
export declare function validateURI(uri: string): void;
/**
 * Validates and returns the checksummed address
 *
 * @param address
 */
export declare function validateAndParseAddress(address: string): string;
/**
 * Constructs a MediaData type.
 *
 * @param tokenURI
 * @param metadataURI
 * @param contentHash
 * @param metadataHash
 */
export declare function constructMediaData(tokenURI: string, metadataURI: string, contentHash: BytesLike, metadataHash: BytesLike): MediaData;
/********************
 * Hashing Utilities
 ********************
 */
/**
 * Generates the sha256 hash from a buffer and returns the hash hex-encoded
 *
 * @param buffer
 */
export declare function sha256FromBuffer(buffer: Buffer): string;
/**
 * Returns the `verified` status of a uri.
 * A uri is only considered `verified` if its content hashes to its expected hash
 *
 * @param uri
 * @param expectedHash
 * @param timeout
 */
export declare function isURIHashVerified(uri: string, expectedHash: BytesLike, timeout?: number): Promise<boolean>;
/**
 * Returns the `verified` status of some MediaData.
 * MediaData is only considered `verified` if the content of its URIs hash to their respective hash
 *
 * @param mediaData
 * @param timeout
 */
export declare function isMediaDataVerified(mediaData: MediaData, timeout?: number): Promise<boolean>;
