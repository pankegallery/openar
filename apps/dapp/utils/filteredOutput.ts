import isPlainObject from "is-plain-object";

export type FilterableObject<K extends keyof any, T> = {
  [P in K]?: T;
};

export const filteredOutputByBlacklist = (
  obj: object | object[] | null | undefined,
  keys?: string[] | undefined,
  skipKeys?: string | string[]
): any => {
  if (!obj) return obj;

  if (!keys) {
    // TODO: better error logging
    return obj;
  }

  if (obj !== Object(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => filteredOutputByBlacklist(item, keys, skipKeys));
  }

  let skipArray: string[] = [];

  if (skipKeys) skipArray = Array.isArray(skipKeys) ? skipKeys : [skipKeys];

  return Object.keys(obj)
    .filter((key) => !keys.includes(key) || skipArray.includes(key))
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]:
          skipArray.includes(key) || !isPlainObject((obj as any)[key])
            ? (obj as any)[key]
            : filteredOutputByBlacklist((obj as any)[key], keys, skipKeys),
      };
    }, {});
};

export const filteredOutputByWhitelist = (
  obj: object | object[] | null | undefined,
  keys?: string[] | undefined,
  skipKeys?: string | string[]
): any => {
  if (!obj) return obj;

  if (!keys) {
    // TODO: better error logging
    return obj;
  }

  if (obj !== Object(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => filteredOutputByWhitelist(item, keys, skipKeys));
  }

  let skipArray: string[] = [];

  if (skipKeys) skipArray = Array.isArray(skipKeys) ? skipKeys : [skipKeys];

  return Object.keys(obj)
    .filter((key) => keys.includes(key) || skipArray.includes(key))
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]:
          skipArray.includes(key) || !isPlainObject((obj as any)[key])
            ? (obj as any)[key]
            : filteredOutputByWhitelist((obj as any)[key], keys, skipKeys),
      };
    }, {});
};