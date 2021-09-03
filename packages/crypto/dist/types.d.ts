import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
/**
 * Internal type to represent a Decimal Value
 */
export declare type DecimalValue = {
    value: BigNumber;
};
/**
 * Zora Media Protocol BidShares
 */
export declare type BidShares = {
    platform: DecimalValue;
    pool: DecimalValue;
    creator: DecimalValue;
    owner: DecimalValue;
    prevOwner: DecimalValue;
};
/**
 * Zora Media Protocol Ask
 */
export declare type Ask = {
    currency: string;
    amount: BigNumberish;
};
/**
 * Zora Media Protocol Bid
 */
export declare type Bid = {
    currency: string;
    amount: BigNumberish;
    bidder: string;
    recipient: string;
    sellOnShare: DecimalValue;
};
/**
 * Zora Media Protocol MediaData
 */
export declare type MediaData = {
    tokenURI: string;
    metadataURI: string;
    contentHash: BytesLike;
    metadataHash: BytesLike;
};
/**
 * EIP712 Signature
 */
export declare type EIP712Signature = {
    deadline: BigNumberish;
    v: number;
    r: BytesLike;
    s: BytesLike;
};
/**
 * EIP712 Domain
 */
export declare type EIP712Domain = {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
};
export declare type EIP712Sig = {
    deadline: BigNumberish;
    v: any;
    r: any;
    s: any;
};
