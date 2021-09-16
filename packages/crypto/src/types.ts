import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";

/**
 * Internal type to represent a Decimal Value
 */
export type DecimalValue = { value: BigNumber };

/**
 * Zora Media Protocol BidShares
 */
export type BidShares = {
  platform: DecimalValue;
  pool: DecimalValue;
  creator: DecimalValue;
  owner: DecimalValue;
  prevOwner: DecimalValue;
};

/**
 * Zora Media Protocol Ask
 */
export type Ask = {
  currency: string;
  amount: BigNumberish;
};

/**
 * Zora Media Protocol Bid
 */
export type Bid = {
  currency: string;
  amount: BigNumberish;
  bidder: string;
  recipient: string;
  sellOnShare: DecimalValue;
};

/**
 * openAR Media Protocol MediaData stored on chain
 */

 export type MediaData = {
  awKeyHex: BytesLike;
  objKeyHex: BytesLike;
  editionOf: BigNumberish;
  editionNumber: BigNumberish;
};

/**
 * openAR Media Protocol MintData for mint() and mintWithSig()
 */

export type MintData = {
  awKeyHex: BytesLike;
  objKeyHex: BytesLike;
  tokenURI: string;
  metadataURI: string;
  contentHash: BytesLike;
  metadataHash: BytesLike;
  editionOf: BigNumberish;
  editionNumber: BigNumberish;
};

/**
 * openAR Media Protocol MintData for mintArObject()
 */
export type MintArObjectData = {
  awKeyHex: BytesLike;
  objKeyHex: BytesLike;
  editionOf: BigNumber;
  initialAsk: BigNumber;
  batchSize: BigNumber;
  batchOffset: BigNumber;
  mintArObjectNonce: BigNumber;
  currency: string;
  setInitialAsk: boolean;
};

/**
 * EIP712 Signature
 */
export type EIP712Signature = {
  deadline: BigNumberish;
  v: number;
  r: BytesLike;
  s: BytesLike;
};

/**
 * EIP712 Domain
 */
export type EIP712Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

export type EIP712Sig = {
  deadline: BigNumberish;
  v: any;
  r: any;
  s: any;
};
