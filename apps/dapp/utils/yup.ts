import { addMethod, string, BaseSchema, number } from "yup";
import { AnyObject, Maybe } from "yup/lib/types";

declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends BaseSchema<TType, TContext, TOut> {
    html(options?: {
      errorMessage?: string;
      min?: number;
      max?: number;
      wordCount?: number;
    }): StringSchema<TType, TContext>;
    nonEmptyHtml(options?: {
      errorMessage?: string;
      min?: number;
      max?: number;
      wordCount?: number;
    }): StringSchema<TType, TContext>;
  }

  interface NumberSchema<
    TType extends Maybe<number> = number | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends BaseSchema<TType, TContext, TOut> {
    latitude(): NumberSchema<TType, TContext>;
    longitude(): NumberSchema<TType, TContext>;
  }
}

// t("validation.number.nolatitude", "Longitudes are numbers between -90.00 and 90.00")
addMethod(number, "latitude", function (options?: { errorMessage?: string }) {
  const { errorMessage } = options ?? {};
  const msg = errorMessage ?? "That doesn't seem to be a latitude";

  return this.test("latitude", msg, function (value) {
    if (value) {
      try {
        return isFinite(value) && Math.abs(value) <= 90;
      } catch (err) {
        return false;
      }
    }

    return false;
  });
});

// t("validation.number.nolongitude", "Longitudes are numbers between -180.00 and 180.00")
addMethod(number, "longitude", function (options?: { errorMessage?: string }) {
  const { errorMessage } = options ?? {};
  const msg = errorMessage ?? "That doesn't seem to be a longitude";

  return this.test("longitude", msg, function (value) {
    if (value) {
      try {
        return isFinite(value) && Math.abs(value) <= 180;
      } catch (err) {
        return false;
      }
    }

    return false;
  });
});

addMethod(
  string,
  "nonEmptyHtml",
  function (options?: {
    errorMessage?: string;
    min?: number;
    max?: number;
    wordCount?: number;
  }) {
    const { errorMessage, min, max } = options ?? {};
    const msg = errorMessage ?? "This field is required";

    return this.test("html", msg, function (value) {
      const { path, createError } = this;

      try {
        const dom = new DOMParser().parseFromString(value ?? "", "text/html");

        const length = (dom?.body?.textContent ?? "").length;

        if (typeof min !== "undefined" && ((min === 0 && length === 0) || (min > 0 && length < 0)))
          return createError({
            path,
            message: 'This field must be at least {{min}} characters long',
            params: {
              min,
            },
          });
        
        if (typeof max !== "undefined" && max < length)
          return createError({
            path,
            message: 'This field must be at most {{max}} characters long',
            params: {
              max,
            },
          });

        return (dom?.body?.textContent ?? "").length > (min ?? 0);
      } catch (err) {
        return false;
      }
    });
  }
);


addMethod(
  string,
  "html",
  function (options?: {
    errorMessage?: string;
    min?: number;
    max?: number;
    wordCount?: number;
  }) {
    const { errorMessage, min, max } = options ?? {};
    const msg = errorMessage ?? "This field is required";

    return this.test("html", msg, function (value) {
      const { path, createError } = this;

      try {
        const dom = new DOMParser().parseFromString(value ?? "", "text/html");

        const length = (dom?.body?.textContent ?? "").length;

        if (typeof min !== "undefined" && ((min === 0 && length === 0) || (min > 0 && length < 0)))
          return createError({
            path,
            message: 'This field must be at least {{min}} characters long',
            params: {
              min,
            },
          });
        
        if (typeof max !== "undefined" && max < length)
          return createError({
            path,
            message: 'This field must be at most {{max}} characters long',
            params: {
              max,
            },
          });

        return true;
      } catch (err) {
        return false;
      }
    });
  }
);
