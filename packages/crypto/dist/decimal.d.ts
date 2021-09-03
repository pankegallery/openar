import { DecimalValue } from "./types";
/**
 * Decimal is a class to make it easy to go from Javascript / Typescript `number` | `string`
 * to ethers `BigDecimal` with the ability to customize precision
 */
export declare class Decimal {
    /**
     * Returns a `DecimalValue` type from the specified value and precision
     * @param value
     * @param precision
     */
    static new(value: number | string, precision?: number): DecimalValue;
    /**
     * Returns the raw `DecimalValue` with no precision
     * @param value
     */
    static raw(value: number): DecimalValue;
    /**
     * Returns the number of decimals for value
     * @param value
     */
    private static countDecimals;
}
export default Decimal;
