import { Wallet, BigNumber, utils } from "ethers";
import warning from "tiny-warning";
import invariant from "tiny-invariant";
import { getAddress } from "@ethersproject/address";
import { customAlphabet } from "nanoid";
import {
  Bytes,
  BytesLike,
  hexDataLength,
  hexlify,
  arrayify,
  isHexString,
} from "@ethersproject/bytes";
import axios from "axios";

import {
  recoverTypedSignature,
  signTypedData_v4,
  recoverTypedSignature_v4,
} from "eth-sig-util";

import { fromRpcSig, toRpcSig } from "ethereumjs-util";

import { Media } from "@openar/contracts";

import { Decimal } from "./decimal";
import {
  BidShares,
  DecimalValue,
  EIP712Domain,
  EIP712Signature,
  MintData,
  PlatformCuts,
  MintArObjectData,
} from "./types";
import { sha256FromBuffer } from "./sha256tools";

export const nanoidCustom16 = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  16
);

export function validateBytes32(value: Bytes) {
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

export const platformCuts: PlatformCuts = {
  firstSalePlatform: Decimal.new(10),
  firstSalePool: Decimal.new(5),
  furtherSalesPlatform: Decimal.new(5),
  furtherSalesPool: Decimal.new(5),
  furtherSalesCreator: Decimal.new(5),
};

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

export function validateBidOrAsk(
  value: DecimalValue,
  bidShares: BidShares
): boolean {
  const decimal100 = Decimal.new(100);
  const sum = Decimal.new(0)
    .value.add(value.value.mul(bidShares.creator.value).div(decimal100.value))
    .add(value.value.mul(bidShares.platform.value).div(decimal100.value))
    .add(value.value.mul(bidShares.pool.value).div(decimal100.value))
    .add(value.value.mul(bidShares.owner.value).div(decimal100.value))
    .add(value.value.mul(bidShares.prevOwner.value).div(decimal100.value));

  return sum.toString() === value.value.toString();
}

export const generateEIP712Domain = (
  mediaContractName: string,
  chainId: number,
  mediaAddress: string
): EIP712Domain => {
  return {
    name: mediaContractName,
    version: "1",
    chainId: chainId,
    verifyingContract: mediaAddress.toLowerCase(),
  };
};

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

export const createEIP712Signature = (
  signature: string,
  deadline: BigNumber
): EIP712Signature => {
  invariant(typeof signature === "string", "Signature needs to be a string");
  invariant(signature.length === 132, "Signature length needs to be 132");

  const r = Buffer.from(signature.substring(2, 66), "hex");
  const s = Buffer.from(signature.substring(66, 130), "hex");
  const v = parseInt(signature.substring(130, 132), 16);

  return {
    deadline,
    v,
    r,
    s,
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
export const generateSignMintWithSignMessageData = (
  contentHash: Bytes,
  metadataHash: Bytes,
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

export const recoverSignatureFromMintWithSig = async (
  contentHash: Bytes,
  metadataHash: Bytes,
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
  contentHash: Bytes,
  metadataHash: Bytes,
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
          data: generateSignMintWithSignMessageData(
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
        deadline: BigNumber.from(deadline),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      reject(e);
    }
  });
};

/*
 * Signs a openAR MintArObject Payload by EIP-712
 *
 * @param owner
 * @param contentHash
 * @param metadataHash
 * @param creatorShareBN
 * @param nonce (use UNIX timestamp)
 * @param deadline
 * @param domain
 */
export const generateMintArObjectSignMessageData = (
  awKeyHash: BytesLike,
  objKeyHash: BytesLike,
  editionOfBN: BigNumber,
  setInitialAsk: boolean,
  initialAskDecimal: Decimal,
  nonceBN: BigNumber,
  deadlineBN: BigNumber,
  domain: EIP712Domain
) => {
  const editionOf = editionOfBN.toString();
  const initialAsk = initialAskDecimal.value.toString();
  const nonce = nonceBN.toString();
  const deadline = deadlineBN.toString();

  return {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      MintArObject: [
        { name: "awKeyHash", type: "bytes32" },
        { name: "objKeyHash", type: "bytes32" },
        { name: "editionOf", type: "uint256" },
        { name: "setInitialAsk", type: "bool" },
        { name: "initialAsk", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "MintArObject" as "MintArObject" | "EIP712Domain",
    domain,
    message: {
      awKeyHash,
      objKeyHash,
      editionOf,
      setInitialAsk,
      initialAsk,
      nonce,
      deadline,
    },
  };
};

export const recoverSignatureFromMintArObject = async (
  awKeyHash: BytesLike,
  objKeyHash: BytesLike,
  editionOfBN: BigNumber,
  setInitialAsk: boolean,
  initialAskDecimal: Decimal,
  nonceBN: BigNumber,
  deadlineBN: BigNumber,
  domain: EIP712Domain,
  sig: string
) => {
  const recovered = recoverTypedSignature_v4({
    data: generateMintArObjectSignMessageData(
      awKeyHash,
      objKeyHash,
      editionOfBN,
      setInitialAsk,
      initialAskDecimal,
      nonceBN,
      deadlineBN,
      domain
    ),
    sig: sig,
  });

  return recovered;
};

/**
 * Signs a openAR MintWithSig Message as specified by EIP-712
 *
 * @param owner
 * @param contentHash
 * @param metadataHash
 * @param nonce
 * @param deadline
 * @param domain
 */
export const signMintArObjectMessageFromWallet = async (
  media: Media,
  owner: Wallet,
  awKeyHash: BytesLike,
  objKeyHash: BytesLike,
  editionOfBN: BigNumber,
  setInitialAsk: boolean,
  initialAskDecimal: Decimal,
  nonceBN: BigNumber,
  deadlineBN: BigNumber,
  chainId: number
) => {
  return new Promise<EIP712Signature>(async (res, reject) => {
    const name = await media.name();

    try {
      const sig = signTypedData_v4(
        Buffer.from(owner.privateKey.slice(2), "hex"),
        {
          data: generateMintArObjectSignMessageData(
            awKeyHash,
            objKeyHash,
            editionOfBN,
            setInitialAsk,
            initialAskDecimal,
            nonceBN,
            deadlineBN,
            generateEIP712Domain(name, chainId, media.address)
          ),
        }
      );
      const response = fromRpcSig(sig);
      res({
        r: response.r,
        s: response.s,
        v: response.v,
        deadline: deadlineBN.toString(),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      reject(e);
    }
  });
};

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
 * Constructs a MintData type.
 *
 * @param tokenURI
 * @param metadataURI
 * @param contentHash
 * @param metadataHash
 */
export function constructMintData(
  awKeyHex: Bytes,
  objKeyHex: Bytes,
  tokenURI: string,
  metadataURI: string,
  contentHash: Bytes,
  metadataHash: Bytes,
  editionOf: BigNumber,
  editionNumber: BigNumber
): MintData {
  // validate the hash to ensure it fits in bytes32
  validateBytes32(awKeyHex);
  validateBytes32(objKeyHex);
  validateBytes32(contentHash);
  validateBytes32(metadataHash);
  validateURI(tokenURI);
  validateURI(metadataURI);

  return {
    awKeyHex,
    objKeyHex,
    tokenURI,
    metadataURI,
    contentHash,
    metadataHash,
    editionOf,
    editionNumber,
  };
}

export async function mintArObjectBatchWithSig(
  batchSize: number,
  batchOffset: number,
  media: Media,
  creator: string,
  tokenURIs: string[],
  metadataURIs: string[],
  contentHashes: Bytes[],
  metadataHashes: Bytes[],
  awKeyHex: Bytes,
  objKeyHex: Bytes,
  editionOfBN: BigNumber,
  setInitialAsk: boolean,
  initialAsk: Decimal,
  nonceBN: BigNumber,
  currencyAddress: string,
  shares: BidShares,
  sig: EIP712Signature
) {
  const data: MintArObjectData = {
    awKeyHex,
    objKeyHex,
    editionOf: editionOfBN,
    initialAsk: initialAsk.value,
    batchSize: BigNumber.from(batchSize),
    batchOffset: BigNumber.from(batchOffset),
    mintArObjectNonce: nonceBN,
    currency: currencyAddress,
    setInitialAsk,
  };

  return media.mintArObject(
    creator,
    tokenURIs,
    metadataURIs,
    contentHashes,
    metadataHashes,
    data,
    shares,
    sig
  );
}

export async function mintArObjectWithSig(
  batchSize: number,
  media: Media,
  creator: string,
  tokenURIs: string[],
  metadataURIs: string[],
  contentHashes: Bytes[],
  metadataHashes: Bytes[],
  awKeyHex: Bytes,
  objKeyHex: Bytes,
  editionOfBN: BigNumber,
  setInitialAsk: boolean,
  initialAsk: Decimal,
  nonceBN: BigNumber,
  currencyAddress: string,
  shares: BidShares,
  sig: EIP712Signature
) {
  let offset = 0;

  return new Promise(async (resolve, reject) => {
    while (offset < editionOfBN.toNumber()) {
      let nextBatchSize = batchSize;
      if (offset + batchSize > editionOfBN.toNumber())
        nextBatchSize = editionOfBN.toNumber() % batchSize;

      await mintArObjectBatchWithSig(
        nextBatchSize,
        offset,
        media,
        creator,
        tokenURIs.slice(offset, offset + nextBatchSize),
        metadataURIs.slice(offset, offset + nextBatchSize),
        contentHashes.slice(offset, offset + nextBatchSize),
        metadataHashes.slice(offset, offset + nextBatchSize),
        awKeyHex,
        objKeyHex,
        editionOfBN,
        setInitialAsk,
        initialAsk,
        nonceBN,
        currencyAddress,
        shares,
        sig
      ).catch((err: any) => reject(err));

      offset += batchSize;
    }

    resolve(true);
  });
}

/********************
 * Hashing Utilities
 ********************
 */

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
 * Returns the `verified` status of some MintData.
 * MintData is only considered `verified` if the content of its URIs hash to their respective hash
 *
 * @param MintData
 * @param timeout
 */
export async function isMintDataVerified(
  mintData: MintData,
  timeout: number = 10
): Promise<boolean> {
  const isTokenURIVerified = await isURIHashVerified(
    mintData.tokenURI,
    mintData.contentHash,
    timeout
  );

  const isMetadataURIVerified = await isURIHashVerified(
    mintData.metadataURI,
    mintData.metadataHash,
    timeout
  );

  return isTokenURIVerified && isMetadataURIVerified;
}

export const stringToHex = (str: string) => utils.formatBytes32String(str);

export const stringToSha256 = (str: string) => utils.sha256(str);

export const hexToBytes = (hex: string) => utils.arrayify(hex);

export const stringToHexBytes = (str: string) => {
  return utils.arrayify(utils.formatBytes32String(str));
};

export const stringToHexHash = (str: string) => {
  return utils.sha256(utils.formatBytes32String(str));
};

export const stringToHexHashBytes = (str: string) => {
  return utils.arrayify(utils.sha256(utils.formatBytes32String(str)));
};

export const stringToBytes = (str: string) => {
  return utils.arrayify(str);
};

export const stringToBytes32 = (str: string) => {
  return utils.arrayify(utils.formatBytes32String(str));
};

export const numberToBigNumber = (n: number) => BigNumber.from(n);
