import { isNonEmptyString } from "./typeguards";

export class Asserts {
  static isPresent<T>(
    v: T,
    msgOrErrorFactory?: string | (() => Error)
  ): asserts v is NonNullable<T> {
    if (v === null || v === undefined) {
      throw Asserts.createException(
        msgOrErrorFactory,
        "Value is null or undefined."
      );
    }
  }

  static safeInteger(
    v: unknown,
    msgOrErrorFactory?: string | (() => Error)
  ): asserts v is number {
    const test = parseInt(`${v}`, 10);
    if (typeof test !== "number" || !Number.isSafeInteger(test)) {
      throw Asserts.createException(
        msgOrErrorFactory,
        "Value is not a safe integer"
      );
    }
  }

  static nonEmptyString(
    v: unknown,
    msgOrErrorFactory?: string | (() => Error),
    /** auto-trim, default true */
    trim?: boolean
  ): asserts v is string {
    if (!isNonEmptyString(v, trim ?? true)) {
      throw Asserts.createException(msgOrErrorFactory);
    }
  }

  static isBoolean(
    v: unknown,
    msgOrErrorFactory?: string | (() => Error)
  ): asserts v is boolean {
    if (v !== false && v !== true) {
      throw Asserts.createException(msgOrErrorFactory);
    }
  }

  static never(v: never, msg?: string): never {
    throw new Error(msg ?? "Unexpected value");
  }

  private static createException(
    msgOrErrorFactory?: string | (() => Error),
    fallbackMsg?: string
  ): Error {
    if (
      typeof msgOrErrorFactory === "string" ||
      msgOrErrorFactory === undefined
    ) {
      throw new Error(
        `${msgOrErrorFactory ?? fallbackMsg ?? "Assertion did not pass."}`
      );
    }
    throw msgOrErrorFactory();
  }
}

export const safeGuardVariable = (
  logger: any,
  type: "string" | "int" | "boolean",
  v: unknown,
  f: unknown,
  message: string
): any => {
  try {
    if (type === "string") {
      Asserts.nonEmptyString(v, message);
      return v;
    }
    if (type === "int") {
      Asserts.safeInteger(v, message);
      return parseInt(`${v}`, 10);
    }
    if (type === "boolean") {
      Asserts.isBoolean(v, message);
      return Boolean(v) && `${v}` !== "false";
    }
  } catch (Err) {
    logger.error(Err);
    return f;
  }
};

export default Asserts;
