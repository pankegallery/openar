import {
  BytesLike,
  hexDataLength,
  hexlify,
  isHexString,
} from "@ethersproject/bytes";
import invariant from "tiny-invariant";

import { BidShares, DecimalValue } from "./types";
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
