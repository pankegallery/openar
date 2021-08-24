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

import { ImageStatusEnum, ArtworkStatusEnum, ApiError } from "../../utils";
import { GQLJson } from "./nexusTypesShared";

import { authorizeApiUser } from "../helpers";

import { getApiConfig } from "../../config";

import {
  daoArtworkQuery,
  daoArtworkQueryCount,
  daoArtworkCreate,
  daoArtworkUpdate,
  daoArtworkDelete,
  daoArtworkGetByKey,
  daoArtworkGetOwnById,
  daoNanoidCustom16,
} from "../../dao";
import context from "../context";

const apiConfig = getApiConfig();

export const Artwork = objectType({
  name: "Artwork",
  definition(t) {
    t.nonNull.int("id");
    t.int("type");
    t.string("key");
    t.string("title");
    t.string("description");
    t.nonNull.int("status");
    t.field("creator", {
      type: "User",
    });

    t.string("url");
    t.string("video");
    t.float("lat");
    t.float("lng");
    
    // TODO: make good use of this
    t.boolean("isBanned");

    t.field("heroImage", {
      type: "Image",
    });
    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const ArtworkQueryResult = objectType({
  name: "ArtworkQueryResult",
  description: dedent`
    List all the artworks in the database.
  `,
  definition: (t) => {
    t.int("totalCount");
    t.field("artworks", {
      type: list("Artwork"),
    });
  },
});

export const ArtworkQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("artworks", {
      type: ArtworkQueryResult,

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
        let artworks;
        let where: Prisma.ArtworkWhereInput = args.where ?? {};

        if ((pRI?.fieldsByTypeName?.ArtworkQueryResult as any)?.totalCount) {
          totalCount = await daoArtworkQueryCount(args.where);

          if (totalCount === 0)
            return {
              totalCount,
              artworks: [],
            };
        }

        if ((pRI?.fieldsByTypeName?.ArtworkQueryResult as any)?.artworks) {
          let include = {};

          if (
            (pRI as any).fieldsByTypeName?.ArtworkQueryResult?.artworks
              ?.fieldsByTypeName.Artwork?.heroImage
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

          if ((pRI?.fieldsByTypeName?.Artwork as any)?.creator)
            include = {
              ...include,
              creator: {
                select: {
                  pseudonym: true,
                  ethAddress: true,
                  isBanned: true,
                },
              },
            };

          artworks = await daoArtworkQuery(
            where,
            Object.keys(include).length > 0 ? include : undefined,
            args.orderBy,
            args.pageIndex as number,
            args.pageSize as number
          );
        }

        return {
          totalCount,
          artworks,
        };
      },
    });

    t.nonNull.field("artwork", {
      type: "Artwork",

      args: {
        key: nonNull(stringArg()),
      },

      // resolve(root, args, ctx, info)
      async resolve(...[, args, , info]) {
        const pRI = parseResolveInfo(info);

        let include = {};
        let where: Prisma.ArtworkWhereInput = {
          key: args.key,
        };
        if ((pRI?.fieldsByTypeName?.Artwork as any)?.heroImage) {
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

        if ((pRI?.fieldsByTypeName?.Artwork as any)?.creator)
          include = {
            ...include,
            creator: {
              select: {
                pseudonym: true,
                ethAddress: true,
                isBanned: true,
              },
            },
          };

        return daoArtworkGetByKey(
          where,
          Object.keys(include).length > 0 ? include : undefined
        );
      },
    });

    t.field("artworksReadOwn", {
      type: ArtworkQueryResult,

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
        let artworks;
        let where: Prisma.ArtworkWhereInput = args.where ?? {};

        where = {
          ...where,
          creator: {
            id: ctx.appUser?.id ?? 0,
          },
        };
        if ((pRI?.fieldsByTypeName?.ArtworkQueryResult as any)?.totalCount) {
          totalCount = await daoArtworkQueryCount(args.where);

          if (totalCount === 0)
            return {
              totalCount,
              artworks: [],
            };
        }

        if ((pRI?.fieldsByTypeName?.ArtworkQueryResult as any)?.artworks) {
          let include = {};

          if (
            (pRI as any).fieldsByTypeName?.ArtworkQueryResult?.artworks
              ?.fieldsByTypeName.Artwork?.heroImage
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

          artworks = await daoArtworkQuery(
            where,
            Object.keys(include).length > 0 ? include : undefined,
            args.orderBy,
            args.pageIndex as number,
            args.pageSize as number
          );
        }

        return {
          totalCount,
          artworks,
        };
      },
    });

    t.nonNull.field("artworkReadOwn", {
      type: "Artwork",

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
        if ((pRI?.fieldsByTypeName?.Artwork as any)?.heroImage)
          include = {
            ...include,
            heroImage: true,
          };

        if ((pRI?.fieldsByTypeName?.Artwork as any)?.creator)
          include = {
            ...include,
            creator: true,
          };

        return daoArtworkGetOwnById(
          args.id,
          appUser?.id ?? 0,
          Object.keys(include).length > 0 ? include : undefined
        );
      },
    });
  },
});

export const ArtworkUpsertInput = inputObjectType({
  name: "ArtworkUpsertInput",
  definition(t) {
    t.int("id");
    t.nonNull.string("title");
    t.int("type");
    t.int("status");
    t.nonNull.string("description");
    t.string("url");
    t.string("video");
    t.json("heroImage");
    t.json("creator");
    t.json("objects");
    t.json("files");
    t.json("images");
  },
});

export const ArtworkMutations = extendType({
  type: "Mutation",

  definition(t) {
    t.nonNull.field("artworkCreate", {
      type: "Artwork",

      args: {
        data: nonNull("ArtworkUpsertInput"),
      },

      authorize: (...[, , ctx]) => authorizeApiUser(ctx, "artworkCreate"),

      async resolve(...[, args]) {
        const page = await daoArtworkCreate({
          ...args.data,
          key: daoNanoidCustom16(),
        });

        if (!page)
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Creation failed"
          );

        return page;
      },
    });

    t.nonNull.field("artworkUpdate", {
      type: "Artwork",

      args: {
        id: nonNull(intArg()),
        data: nonNull("ArtworkUpsertInput")
      },

      authorize: async (...[, args, ctx]) => {
        if (!authorizeApiUser(ctx, "artworkUpdateOwn")) return false;

        const count = await daoArtworkQueryCount({
          id: args.id,
          status: {
            notIn: [ArtworkStatusEnum.MINTED, ArtworkStatusEnum.DELETED],
          },
          creator: {
            id: ctx.appUser?.id ?? 0,
          },
        });

        return count === 1;
      },

      async resolve(...[, args]) {
        const artwork = await daoArtworkUpdate(args.id, args.data);

        if (!artwork)
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Update failed");

        return artwork;
      },
    });

    t.nonNull.field("artworkDelete", {
      type: "BooleanResult",

      args: {
        id: nonNull(intArg()),
      },

      authorize: async (...[, args, ctx]) => {
        if (!authorizeApiUser(ctx, "artworkDeleteOwn")) return false;

        const count = await daoArtworkQueryCount({
          id: args.id,
          status: {
            notIn: [ArtworkStatusEnum.MINTED, ArtworkStatusEnum.DELETED],
          },
          creator: {
            id: ctx.appUser?.id ?? 0,
          },
        });

        return count === 1;
      },

      async resolve(...[, args]) {
        const artwork = await daoArtworkDelete(args.id);

        if (!artwork)
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Delete failed");

        return { result: true };
      },
    });
  },
});
