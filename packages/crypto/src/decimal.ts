import { BigNumber } from "ethers";
import invariant from "tiny-invariant";

import { DecimalValue } from "./types";

/**
 * Decimal is a class to make it easy to go from Javascript / Typescript `number` | `string`
 * to ethers `BigDecimal` with the ability to customize precision
 */
export class Decimal {
  value: BigNumber = BigNumber.from(0);

  /**
   * Returns a `DecimalValue` type from the specified value and precision
   * @param value
   * @param precision
   */
  static new(
    value: number | string | BigNumber,
    precision: number = 18
  ): DecimalValue {
    invariant(
      precision % 1 === 0 && precision <= 18 && precision > -1,
      `${precision.toString()} must be a non-negative integer less than or equal to 18`
    );

    let number: string;
    // if type of string, ensure it represents a floating point number or integer
    if (typeof value === "string") {
      invariant(
        value.match(/^[-+]?[0-9]*\.?[0-9]+$/),
        "value must represent a floating point number or integer"
      );
      number = value;
    } else {
      number = value.toString();
    }

    const decimalPlaces = Decimal.countDecimals(number);

    // require that the specified precision is at least as large as the number of decimal places of value
    invariant(
      precision >= decimalPlaces,
      `Precision: ${precision} must be greater than or equal the number of decimal places: ${decimalPlaces} in value: ${number}`
    );

    const difference = precision - decimalPlaces;
    const zeros = BigNumber.from(10).pow(difference);
    const abs = BigNumber.from(`${number.replace(".", "")}`);
    return { value: abs.mul(zeros) };
  }

  /**
   * Returns the raw `DecimalValue` with no precision
   * @param value
   */
  static raw(value: number): DecimalValue {
    return { value: BigNumber.from(value) };
  }

  /**
   * Returns the raw `DecimalValue` with no precision
   * @param value
   */
  static rawBigNumber(value: BigNumber): DecimalValue {
    return { value };
  }

  /**
   * Returns the number of decimals for value
   * @param value
   */
  private static countDecimals(value: string) {
    if (value.includes(".")) return value.split(".")[1].length || 0;
    return 0;
  }
}
