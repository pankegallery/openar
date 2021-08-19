import { Prisma } from "@prisma/client";

export const daoSharedCheckSlugUnique = async (
  findMany: Function,
  slug: Record<string, string>,
  id?: number,
  uniqueInObject?: boolean
): Promise<{ ok: boolean; errors: Record<string, boolean> }> => {
  let errors = {};
  let ok = false;

  // first simply compare all slugs in the json
  // they can't be the same for the same id either
  if (uniqueInObject) {
    errors = Object.keys(slug).reduce((acc, key: string) => {
      if (
        Object.keys(slug).find(
          (testkey: string) => testkey !== key && slug[testkey] === slug[key]
        )
      ) {
        return {
          ...acc,
          [key]: "You can't use the same slug in the same object",
        };
      }
      return acc;
    }, errors);

    // seems like the slugs are not unique for the object
    if (Object.keys(errors).length > 0) {
      ok = false;
      return { ok, errors };
    }
  }

  // now test it with other object in the table
  const slugTests = Object.keys(slug).map((key) => ({
    slug: {
      path: [key],
      equals: slug[key],
    },
  }));

  const terms = await findMany({
    where: {
      OR: slugTests,
      ...(id
        ? {
            NOT: {
              id,
            },
          }
        : {}),
    },
    select: {
      slug: true,
    },
  });

  if (terms) {
    // so there are other objects that have the same slug.
    // lets find the offending one slug.
    errors = terms.reduce((errorsAcc: any, item: any) => {
      if (!item.slug) return errorsAcc;

      return {
        ...errorsAcc,
        ...Object.keys(slug).reduce((acc, key: string) => {
          if (
            Object.keys(item?.slug ?? {}).find(
              (testkey: string) =>
                (item?.slug as Prisma.JsonObject)[testkey] === slug[key]
            )
          ) {
            return {
              ...acc,
              [key]: "This slug is already in use",
            };
          }
          return acc;
        }, {}),
      };
    }, errors);
    ok = !(Object.keys(errors).length > 0);
  } else {
    ok = true;
  }
  return { ok, errors };
};

export const daoSharedGenerateFullText = (data: any, keys: string[]) => {
  return keys.reduce((fullText: string, key) => {
    if (!(key in data)) return fullText;

    if (typeof data[key] !== "object") return fullText;

    return `${fullText} ${Object.keys(data[key])
      .map((oKey) => data[key][oKey])
      .join("\n")}`;
  }, "");
};

export const daoSharedMapTranslations = (
  data: any,
  keys: string[]
): any | any[] => {
  if (!data) return data;

  if (Array.isArray(data))
    return data.map((item) => daoSharedMapTranslations(item, keys));

  if (!data.translations || keys.length === 0) return data;

  const returnData = {
    ...data,
    ...keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: data.translations
          .filter((trans: any) => trans.key === key)
          .reduce(
            (transAcc: any, trans: any) => ({
              ...transAcc,
              [trans.lang]: trans.translation,
            }),
            {}
          ),
      }),
      {}
    ),
  };
  delete returnData["translations"];
  return returnData;
};

export const daoSharedWrapImageWithTranslationImage = (
  imageKey: string,
  data: any,
  transKeys: string[]
) => {
  if (
    !data ||
    !(imageKey in data) ||
    !data[imageKey] ||
    !("translations" in data[imageKey])
  )
    return data;

  const image = {
    ...data[imageKey],
    ...daoSharedMapTranslations(data[imageKey], transKeys),
  };

  delete image["translations"];

  return {
    ...data,
    [imageKey]: image,
  };
};

export default {
  daoSharedGenerateFullText,
  daoSharedCheckSlugUnique,
};
