import { Wallet, BigNumber } from "ethers";
import {
  BytesLike,
  hexDataLength,
  hexlify,
  arrayify,
  isHexString,
} from "@ethersproject/bytes";
import invariant from "tiny-invariant";
import { recoverTypedSignature, signTypedData_v4 } from "eth-sig-util";

import { fromRpcSig, toRpcSig } from "ethereumjs-util";

import {
  BidShares,
  DecimalValue,
  EIP712Signature,
  EIP712Domain,
} from "./types";
import { Decimal } from "./decimal";

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

export function openARConstructBidShares(
  platform: number,
  pool: number,
  creator: number,
  owner: number,
  prevOwner: number
): BidShares {
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
}

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
export async function signMintWithSigMessage(
  owner: Wallet,
  contentHash: BytesLike,
  metadataHash: BytesLike,
  creatorShareBN: BigNumber,
  nonce: number,
  deadline: number,
  domain: EIP712Domain
): Promise<EIP712Signature> {
  try {
    validateBytes32(contentHash);
    validateBytes32(metadataHash);
  } catch (err: any) {
    return Promise.reject(err.message);
  }

  const creatorShare = creatorShareBN.toString();

  return new Promise<EIP712Signature>((res, reject) => {
    try {
      const sig = signTypedData_v4(
        Buffer.from(owner.privateKey.slice(2), "hex"),
        {
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
            domain,
            message: {
              contentHash,
              metadataHash,
              creatorShare,
              nonce,
              deadline,
            },
          },
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
}

export async function recoverSignatureFromMintWithSig(
  contentHash: BytesLike,
  metadataHash: BytesLike,
  creatorShareBN: BigNumber,
  nonce: number,
  deadline: number,
  domain: EIP712Domain,
  eipSig: EIP712Signature
) {
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
}
