import "core-js/modules/es.regexp.to-string.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.match.js";
import "core-js/modules/es.string.replace.js";
import "core-js/modules/es.string.includes.js";
import "core-js/modules/es.string.split.js";
import { BigNumber } from "ethers";
import invariant from "tiny-invariant";

/**
 * Decimal is a class to make it easy to go from Javascript / Typescript `number` | `string`
 * to ethers `BigDecimal` with the ability to customize precision
 */
export class Decimal {
  /**
   * Returns a `DecimalValue` type from the specified value and precision
   * @param value
   * @param precision
   */
  static new(value) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 18;
    invariant(precision % 1 === 0 && precision <= 18 && precision > -1, "".concat(precision.toString(), " must be a non-negative integer less than or equal to 18"));
    var number; // if type of string, ensure it represents a floating point number or integer

    if (typeof value === "string") {
      invariant(value.match(/^[-+]?[0-9]*\.?[0-9]+$/), "value must represent a floating point number or integer");
      number = value;
    } else {
      number = value.toString();
    }

    var decimalPlaces = Decimal.countDecimals(number); // require that the specified precision is at least as large as the number of decimal places of value

    invariant(precision >= decimalPlaces, "Precision: ".concat(precision, " must be greater than or equal the number of decimal places: ").concat(decimalPlaces, " in value: ").concat(number));
    var difference = precision - decimalPlaces;
    var zeros = BigNumber.from(10).pow(difference);
    var abs = BigNumber.from("".concat(number.replace(".", "")));
    return {
      value: abs.mul(zeros)
    };
  }
  /**
   * Returns the raw `DecimalValue` with no precision
   * @param value
   */


  static raw(value) {
    return {
      value: BigNumber.from(value)
    };
  }
  /**
   * Returns the number of decimals for value
   * @param value
   */


  static countDecimals(value) {
    if (value.includes(".")) return value.split(".")[1].length || 0;
    return 0;
  }

}
export default Decimal;