/// <reference path="../../types/nexus-typegen.ts" />
import { parseResolveInfo } from "graphql-parse-resolve-info";
import { Prisma } from "@prisma/client";
import dedent from "dedent";
import {
  objectType,
  extendType,
  inputObjectType,
  nonNull,
  stringArg,
  intArg,
  arg,
  list,
} from "nexus";
import httpStatus from "http-status";

import {
  ImageStatusEnum,
  ArObjectStatusEnum,
  ArModelStatusEnum,
  ApiError,
} from "../../utils";
import { GQLJson } from "./nexusTypesShared";

import { authorizeApiUser } from "../helpers";

import { getApiConfig } from "../../config";

import {
  daoArObjectQuery,
  daoArObjectQueryCount,
  daoArObjectCreate,
  daoArObjectUpdate,
  daoArObjectDelete,
  daoArObjectGetByKey,
  daoArObjectGetOwnById,
  daoNanoidCustom16,
} from "../../dao";

const apiConfig = getApiConfig();

export const ArObject = objectType({
  name: "ArObject",
  definition(t) {
    t.nonNull.int("id");
    t.int("type");
    t.string("key");
    t.string("title");
    t.string("description");
    t.nonNull.int("status");

    t.float("askPrice");
    t.boolean("public");

    t.int("orderNumber");
    t.int("editionOf");

    t.field("creator", {
      type: "User",
    });

    t.field("collector", {
      type: "User",
    });

    t.list.field("images", {
      type: "Image",
    });

    t.string("ownerEthAddress");

    t.string("url");
    t.string("video");
    t.float("lat");
    t.float("lng");

    // TODO: make good use of this
    t.boolean("isBanned");

    t.field("heroImage", {
      type: "Image",
    });

    t.list.field("arModels", {
      type: "ArModel",
    });

    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const ArObjectQueryResult = objectType({
  name: "ArObjectQueryResult",
  description: dedent`
    List all the ArObjects in the database.
  `,
  definition: (t) => {
    t.int("totalCount");
    t.field("arObjects", {
      type: list("ArObject"),
    });
  },
});

export const ArObjectQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("arObjects", {
      type: ArObjectQueryResult,

      args: {
        pageIndex: intArg({
          default: 0,
        }),
        pageSize: intArg({
          default: apiConfig.db.defaultPageSize,
        }),
        orderBy: arg({
          type: GQLJson,
          default: undefined,
        }),
        where: arg({
          type: GQLJson,
          default: undefined,
        }),
      },

      async resolve(...[, args, , info]) {
        const pRI = parseResolveInfo(info);

        let totalCount;
        let arObjects;
        let where: Prisma.ArObjectWhereInput = args.where ?? {};
        where = {
          ...where,
          isBanned: false,
          public: true,
          status: {
            in: [
              ArObjectStatusEnum.PUBLISHED,
              ArObjectStatusEnum.MINTING,
              ArObjectStatusEnum.MINTED,
            ],
          },
        };

        if ((pRI?.fieldsByTypeName?.ArObjectQueryResult as any)?.totalCount) {
          totalCount = await daoArObjectQueryCount(args.where);

          if (totalCount === 0)
            return {
              totalCount,
              arObjects: [],
            };
        }

        if ((pRI?.fieldsByTypeName?.ArObjectQueryResult as any)?.arObjects) {
          let include = {};

          if (
            (pRI as any).fieldsByTypeName?.ArObjectQueryResult?.arObjects
              ?.fieldsByTypeName.ArObject?.heroImage
          ) {
            include = {
              ...include,
              heroImage: {
                select: {
                  meta: true,
                  status: true,
                  id: true,
                },
              },
            };

            where = {
              ...where,
              heroImage: {
                status: ImageStatusEnum.READY,
              },
            };
          }

          if (
            (pRI as any).fieldsByTypeName?.ArObjectQueryResult?.arObjects
              ?.fieldsByTypeName.ArObject?.arModels
          ) {
            include = {
              ...include,
              arModels: {
                select: {
                  type: true,
                  meta: true,
                  status: true,
                  id: true,
                },
                where: {
                  status: {
                    not: ArModelStatusEnum.DELETED,
                  },
                },
              },
            };
          }

          if ((pRI?.fieldsByTypeName?.ArObject as any)?.creator)
            include = {
              ...include,
              creator: {
                select: {
                  id: true,
                  bio: true,
                  pseudonym: true,
                  ethAddress: true,
                  isBanned: true,
                },
              },
            };

          arObjects = await daoArObjectQuery(
            where,
            Object.keys(include).length > 0 ? include : undefined,
            args.orderBy,
            args.pageIndex as number,
            args.pageSize as number
          );
        }

        return {
          totalCount,
          arObjects,
        };
      },
    });

    t.nonNull.field("arObject", {
      type: "ArObject",

      args: {
        key: nonNull(stringArg()),
      },

      // resolve(root, args, ctx, info)
      async resolve(...[, args, , info]) {
        const pRI = parseResolveInfo(info);

        let include = {};
        let where: Prisma.ArObjectWhereInput = {
          key: args.key,
          isBanned: false,
          status: {
            in: [
              ArObjectStatusEnum.PUBLISHED,
              ArObjectStatusEnum.MINTING,
              ArObjectStatusEnum.MINTED,
            ],
          },
        };
        if ((pRI?.fieldsByTypeName?.ArObject as any)?.heroImage) {
          include = {
            ...include,
            heroImage: {
              select: {
                meta: true,
                status: true,
                id: true,
              },
            },
          };

          where = {
            ...where,
            heroImage: {
              status: ImageStatusEnum.READY,
            },
          };
        }

        if ((pRI?.fieldsByTypeName?.ArObject as any)?.arModels) {
          include = {
            ...include,
            arModels: {
              select: {
                type: true,
                meta: true,
                status: true,
                id: true,
              },
              where: {
                status: {
                  not: ArModelStatusEnum.DELETED,
                },
              },
            },
          };
        }

        if ((pRI?.fieldsByTypeName?.ArObject as any)?.creator)
          include = {
            ...include,
            creator: {
              select: {
                id: true,
                bio: true,
                pseudonym: true,
                ethAddress: true,
                isBanned: true,
              },
            },
          };

        return daoArObjectGetByKey(
          where,
          Object.keys(include).length > 0 ? include : undefined
        );
      },
    });

    t.field("arObjectsReadOwn", {
      type: ArObjectQueryResult,

      args: {
        pageIndex: intArg({
          default: 0,
        }),
        pageSize: intArg({
          default: apiConfig.db.defaultPageSize,
        }),
        orderBy: arg({
          type: GQLJson,
          default: undefined,
        }),
        where: arg({
          type: GQLJson,
          default: undefined,
        }),
      },

      // Here the user are checked to have the correct permission but
      // only the query below enforces ownership
      authorize: (...[, , ctx]) => authorizeApiUser(ctx, "artworkReadOwn"),

      async resolve(...[, args, ctx, info]) {
        const pRI = parseResolveInfo(info);

        let totalCount;
        let arObjects;
        let where: Prisma.ArObjectWhereInput = args.where ?? {};

        where = {
          ...where,
          creator: {
            id: ctx.appUser?.id ?? 0,
          },
        };
        if ((pRI?.fieldsByTypeName?.ArObjectQueryResult as any)?.totalCount) {
          totalCount = await daoArObjectQueryCount(args.where);

          if (totalCount === 0)
            return {
              totalCount,
              arObjects: [],
            };
        }

        if ((pRI?.fieldsByTypeName?.ArObjectQueryResult as any)?.arObjects) {
          let include = {};

          if (
            (pRI as any).fieldsByTypeName?.ArObjectQueryResult?.arObjects
              ?.fieldsByTypeName.ArObject?.arModels
          ) {
            include = {
              ...include,
              arModels: {
                select: {
                  type: true,
                  meta: true,
                  status: true,
                  id: true,
                },
                where: {
                  status: {
                    not: ArModelStatusEnum.DELETED,
                  },
                },
              },
            };
          }

          if (
            (pRI as any).fieldsByTypeName?.ArObjectQueryResult?.arObjects
              ?.fieldsByTypeName.ArObject?.heroImage
          ) {
            include = {
              ...include,
              heroImage: {
                select: {
                  meta: true,
                  status: true,
                  id: true,
                },
              },
            };
          }

          if (
            (pRI as any).fieldsByTypeName?.ArObjectQueryResult?.arObjects
              ?.fieldsByTypeName.ArObject?.creator
          )
            include = {
              ...include,
              creator: {
                select: {
                  id: true,
                  bio: true,
                  pseudonym: true,
                  ethAddress: true,
                  isBanned: true,
                },
              },
            };

          arObjects = await daoArObjectQuery(
            where,
            Object.keys(include).length > 0 ? include : undefined,
            args.orderBy,
            args.pageIndex as number,
            args.pageSize as number
          );
        }

        return {
          totalCount,
          arObjects,
        };
      },
    });

    t.nonNull.field("arObjectReadOwn", {
      type: "ArObject",

      args: {
        id: nonNull(intArg()),
      },

      // Here the user are checked to have the correct permission but
      // only the query below enforces ownership
      authorize: (...[, , ctx]) => authorizeApiUser(ctx, "artworkReadOwn"),

      // resolve(root, args, ctx, info)
      async resolve(...[, args, { appUser }, info]) {
        const pRI = parseResolveInfo(info);

        let include = {};

        if ((pRI?.fieldsByTypeName?.ArObject as any)?.arModels) {
          include = {
            ...include,
            arModels: {
              select: {
                type: true,
                meta: true,
                status: true,
                id: true,
              },
              where: {
                status: {
                  not: ArModelStatusEnum.DELETED,
                },
              },
            },
          };
        }

        if ((pRI?.fieldsByTypeName?.ArObject as any)?.heroImage)
          include = {
            ...include,
            heroImage: true,
          };

        if ((pRI?.fieldsByTypeName?.ArObject as any)?.creator)
          include = {
            ...include,
            creator: true,
          };

        return daoArObjectGetOwnById(
          args.id,
          appUser?.id ?? 0,
          Object.keys(include).length > 0 ? include : undefined
        );
      },
    });
  },
});

export const ArObjectUpsertInput = inputObjectType({
  name: "ArObjectUpsertInput",
  definition(t) {
    t.int("id");
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.int("status");
    t.int("orderNumber");
    t.float("lng");
    t.float("askPrice");
    t.int("editionOf");
    t.float("lat");
    t.string("ownerEthAddress");
    t.json("creator");
    t.json("collector");
    t.json("heroImage");
    t.json("artwork");
    t.json("arModels");
    t.json("images");
  },
});

export const ArObjectMutations = extendType({
  type: "Mutation",

  definition(t) {
    t.nonNull.field("arObjectCreate", {
      type: "ArObject",

      args: {
        data: nonNull("ArObjectUpsertInput"),
      },

      authorize: (...[, , ctx]) => authorizeApiUser(ctx, "artworkCreate"),

      async resolve(...[, args]) {
        const page = await daoArObjectCreate({
          ...args.data,
          key: daoNanoidCustom16(),
          status: ArObjectStatusEnum.DRAFT,
        });

        if (!page)
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Creation failed"
          );

        return page;
      },
    });

    t.nonNull.field("arObjectUpdate", {
      type: "ArObject",

      args: {
        id: nonNull(intArg()),
        data: nonNull("ArObjectUpsertInput"),
      },

      authorize: async (...[, args, ctx]) => {
        if (!authorizeApiUser(ctx, "artworkUpdateOwn")) return false;

        const count = await daoArObjectQueryCount({
          id: args.id,
          status: {
            notIn: [
              ArObjectStatusEnum.MINTING,
              ArObjectStatusEnum.MINTED,
              ArObjectStatusEnum.DELETED,
            ],
          },
          creator: {
            id: ctx.appUser?.id ?? 0,
          },
        });

        return count === 1;
      },

      async resolve(...[, args]) {
        const arObject = await daoArObjectUpdate(args.id, {
          ...args.data,
          status: args.data?.status ?? ArObjectStatusEnum.DRAFT,
        });

        if (!arObject)
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Update failed");

        return arObject;
      },
    });

    t.nonNull.field("arObjectDelete", {
      type: "BooleanResult",

      args: {
        id: nonNull(intArg()),
      },

      authorize: async (...[, args, ctx]) => {
        if (!authorizeApiUser(ctx, "artworkDeleteOwn")) return false;

        const count = await daoArObjectQueryCount({
          id: args.id,
          status: {
            notIn: [ArObjectStatusEnum.MINTED, ArObjectStatusEnum.DELETED],
          },
          creator: {
            id: ctx.appUser?.id ?? 0,
          },
        });

        return count === 1;
      },

      async resolve(...[, args]) {
        const arObject = await daoArObjectDelete(args.id);

        if (!arObject)
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Delete failed");

        return { result: true };
      },
    });
  },
});
