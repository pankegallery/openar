import { Wallet, BigNumber } from "ethers";
import sjcl from "sjcl";
import warning from "tiny-warning";
import invariant from "tiny-invariant";
import { getAddress } from "@ethersproject/address";
import {
  BytesLike,
  hexDataLength,
  hexlify,
  arrayify,
  isHexString,
} from "@ethersproject/bytes";
import axios from "axios";

import { recoverTypedSignature, signTypedData_v4 } from "eth-sig-util";

import { fromRpcSig, toRpcSig } from "ethereumjs-util";

import { Decimal } from "./decimal";
import {
  Ask,
  Bid,
  BidShares,
  DecimalValue,
  EIP712Domain,
  EIP712Signature,
  MediaData,
} from "./types";

export function validateBytes32(value: BytesLike) {
  if (typeof value === "string") {
    if (isHexString(value) && hexDataLength(value) === 32) {
      return;
    }

    invariant(false, `${value} is not a 0x prefixed 32 bytes hex string`);
  } else {
    if (hexDataLength(hexlify(value)) === 32) {
      return;
    }

    invariant(false, `value is not a length 32 byte array`);
  }
}

export function validateBidShares(
  platform: DecimalValue,
  pool: DecimalValue,
  creator: DecimalValue,
  owner: DecimalValue,
  prevOwner: DecimalValue
): void {
  const decimal100 = Decimal.new(100);

  const sum = creator.value
    .add(platform.value)
    .add(pool.value)
    .add(owner.value)
    .add(prevOwner.value);

  if (sum.toString() !== decimal100.value.toString()) {
    invariant(
      false,
      `The BidShares sum to ${sum.toString()}, but they must sum to ${decimal100.value.toString()}`
    );
  }
}

export const openARConstructBidShares = (
  platform: number,
  pool: number,
  creator: number,
  owner: number,
  prevOwner: number
): BidShares => {
  const decimalPlatform = Decimal.new(parseFloat(platform.toFixed(4)));
  const decimalPool = Decimal.new(parseFloat(pool.toFixed(4)));
  const decimalCreator = Decimal.new(parseFloat(creator.toFixed(4)));
  const decimalOwner = Decimal.new(parseFloat(owner.toFixed(4)));
  const decimalPrevOwner = Decimal.new(parseFloat(prevOwner.toFixed(4)));

  validateBidShares(
    decimalPlatform,
    decimalPool,
    decimalCreator,
    decimalOwner,
    decimalPrevOwner
  );

  return {
    platform: decimalPlatform,
    pool: decimalPool,
    creator: decimalCreator,
    owner: decimalOwner,
    prevOwner: decimalPrevOwner,
  };
};

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
export const generateSignMintWithSigMessageData = (
  contentHash: BytesLike,
  metadataHash: BytesLike,
  creatorShareBN: BigNumber,
  nonce: number,
  deadline: number,
  domain: EIP712Domain
) => {
  const creatorShare = creatorShareBN.toString();

  return {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      MintWithSig: [
        { name: "contentHash", type: "bytes32" },
        { name: "metadataHash", type: "bytes32" },
        { name: "creatorShare", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "MintWithSig" as "MintWithSig" | "EIP712Domain",
    domain,
    message: {
      contentHash,
      metadataHash,
      creatorShare,
      nonce,
      deadline,
    },
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
export const signMintWithSigMessageFromWallet = async (
  owner: Wallet,
  contentHash: BytesLike,
  metadataHash: BytesLike,
  creatorShareBN: BigNumber,
  nonce: number,
  deadline: number,
  domain: EIP712Domain
): Promise<EIP712Signature> => {
  try {
    validateBytes32(contentHash);
    validateBytes32(metadataHash);
  } catch (err: any) {
    return Promise.reject(err.message);
  }

  return new Promise<EIP712Signature>((res, reject) => {
    try {
      const sig = signTypedData_v4(
        Buffer.from(owner.privateKey.slice(2), "hex"),
        {
          data: generateSignMintWithSigMessageData(
            contentHash,
            metadataHash,
            creatorShareBN,
            nonce,
            deadline,
            domain
          ),
        }
      );
      const response = fromRpcSig(sig);
      res({
        r: response.r,
        s: response.s,
        v: response.v,
        deadline: deadline.toString(),
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

export const recoverSignatureFromMintWithSig = async (
  contentHash: BytesLike,
  metadataHash: BytesLike,
  creatorShareBN: BigNumber,
  nonce: number,
  deadline: number,
  domain: EIP712Domain,
  eipSig: EIP712Signature
) => {
  const r = arrayify(eipSig.r);
  const s = arrayify(eipSig.s);
  const creatorShare = creatorShareBN.toString();

  const recovered = recoverTypedSignature({
    data: {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        MintWithSig: [
          { name: "contentHash", type: "bytes32" },
          { name: "metadataHash", type: "bytes32" },
          { name: "creatorShare", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      primaryType: "MintWithSig",
      domain: domain,
      message: {
        contentHash,
        metadataHash,
        creatorShare,
        nonce,
        deadline,
      },
    },
    sig: toRpcSig(eipSig.v, Buffer.from(r), Buffer.from(s)),
  });
  return recovered;
};

/**
 * Returns the proper network name for the specified chainId
 *
 * @param chainId
 */
export function chainIdToNetworkName(chainId: number): string {
  switch (chainId) {
    case 80001: {
      return "polygonMumbai";
    }
    case 137: {
      return "polygon";
    }
    case 100: {
      return "xDai";
    }
    case 4: {
      return "rinkeby";
    }
    case 1: {
      return "mainnet";
    }
  }

  invariant(
    false,
    `chainId ${chainId} not officially supported by the Zora Protocol`
  );
}

/**
 * Validates the URI is prefixed with `https://`
 *
 * @param uri
 */
export function validateURI(uri: string) {
  if (!uri.match(/^https:\/\/(.*)/)) {
    invariant(false, `${uri} must begin with \`https://\``);
  }
}

/**
 * Validates and returns the checksummed address
 *
 * @param address
 */
export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address);
    warning(address === checksummedAddress, `${address} is not checksummed.`);
    return checksummedAddress;
  } catch (error) {
    invariant(false, `${address} is not a valid address.`);
  }
}

/**
 * Constructs a MediaData type.
 *
 * @param tokenURI
 * @param metadataURI
 * @param contentHash
 * @param metadataHash
 */
export function constructMediaData(
  tokenURI: string,
  metadataURI: string,
  contentHash: BytesLike,
  metadataHash: BytesLike
): MediaData {
  // validate the hash to ensure it fits in bytes32
  validateBytes32(contentHash);
  validateBytes32(metadataHash);
  validateURI(tokenURI);
  validateURI(metadataURI);

  return {
    tokenURI: tokenURI,
    metadataURI: metadataURI,
    contentHash: contentHash,
    metadataHash: metadataHash,
  };
}

/********************
 * Hashing Utilities
 ********************
 */

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
 * Returns the `verified` status of a uri.
 * A uri is only considered `verified` if its content hashes to its expected hash
 *
 * @param uri
 * @param expectedHash
 * @param timeout
 */
export async function isURIHashVerified(
  uri: string,
  expectedHash: BytesLike,
  timeout: number = 10
): Promise<boolean> {
  try {
    validateURI(uri);

    const resp = await axios.get(uri, {
      timeout: timeout,
      responseType: "arraybuffer",
    });
    const uriHash = sha256FromBuffer(resp.data);
    const normalizedExpectedHash = hexlify(expectedHash);

    return uriHash == normalizedExpectedHash;
  } catch (err: any) {
    return Promise.reject(err.message);
  }
}

/**
 * Returns the `verified` status of some MediaData.
 * MediaData is only considered `verified` if the content of its URIs hash to their respective hash
 *
 * @param mediaData
 * @param timeout
 */
export async function isMediaDataVerified(
  mediaData: MediaData,
  timeout: number = 10
): Promise<boolean> {
  const isTokenURIVerified = await isURIHashVerified(
    mediaData.tokenURI,
    mediaData.contentHash,
    timeout
  );

  const isMetadataURIVerified = await isURIHashVerified(
    mediaData.metadataURI,
    mediaData.metadataHash,
    timeout
  );

  return isTokenURIVerified && isMetadataURIVerified;
}
