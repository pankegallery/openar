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
  ArtworkStatusEnum,
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
  daoSubgraphGetOwnedTokenByEthAddress,
  daoSubgraphGetParsedTokenInfo,
  daoSubgraphGetArObjectTokens,
  daoSubgraphGetParsedTokenInfos,
  daoPublicUserQuery,
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
    t.boolean("setInitialAsk");

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

    t.field("artwork", {
      type: "Artwork",
    });

    t.string("ownerEthAddress");

    t.string("url");
    t.string("video");
    t.float("lat");
    t.float("lng");

    // TODO: make good use of this
    t.boolean("isBanned");
    t.boolean("isPublic");

    t.field("heroImage", {
      type: "Image",
    });

    t.list.field("arModels", {
      type: "ArModel",
    });

    t.json("subgraphInfo");

    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const ArObjectQueryResult = objectType({
  name: "ArObjectQueryResult",
  description: dedent`
    List all the ArObjects in the database. Or the collection info of one user.
  `,
  definition: (t) => {
    t.int("totalCount");
    t.field("arObjects", {
      type: list("ArObject"),
    });
  },
});

export const ArObjectToken = objectType({
  name: "ArObjectToken",
  description: dedent`
    The user info and subgraph token info(s) for one collector.
  `,
  definition: (t) => {
    t.int("id");
    t.json("subgraphinfo");
    t.field("collector", {
      type: "User",
    });
  },
});

export const ArObjectTokens = objectType({
  name: "ArObjectTokens",
  description: dedent`
    Lists all toeksn of one arObject
  `,
  definition: (t) => {
    t.int("totalCount");
    t.field("tokens", {
      type: list("ArObjectToken"),
    });
  },
});

export const ArObjectQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("arObjects", {
      type: "ArObjectQueryResult",

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
          isPublic: true,
          status: {
            in: [
              ArObjectStatusEnum.PUBLISHED,
              ArObjectStatusEnum.MINTING,
              ArObjectStatusEnum.MINTED,
            ],
          },
          creator: {
            isBanned: false,
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
          isBanned: false,
          creator: {
            id: ctx.appUser?.id ?? 0,
            isBanned: false,
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

        return daoArObjectGetOwnById(
          args.id,
          appUser?.id ?? 0,
          Object.keys(include).length > 0 ? include : undefined
        );
      },
    });

    t.nonNull.field("collection", {
      type: "ArObjectQueryResult",

      args: {
        ethAddress: nonNull(stringArg()),
      },

      // resolve(root, args, ctx, info)
      async resolve(...[, args]) {
        let ownedTokens = await daoSubgraphGetOwnedTokenByEthAddress(
          args.ethAddress,
          1000,
          0
        );
        if (ownedTokens) {
          ownedTokens = ownedTokens.filter(
            (token: any) => token.creator.id !== token.owner.id
          );
          if (!ownedTokens || ownedTokens.length === 0)
            return {
              totalCount: 0,
              arObjects: [],
            };

          const tokensInfo = await daoSubgraphGetParsedTokenInfo(ownedTokens);

          if (!tokensInfo || tokensInfo.length === 0)
            return {
              totalCount: 0,
              arObjects: [],
            };

          const keys = Object.keys(tokensInfo);

          let include: Prisma.ArObjectInclude = {
            artwork: {
              select: {
                id: true,
                key: true,
                title: true,
                heroImage: true,
              },
            },
            heroImage: true,
            creator: {
              select: {
                id: true,
                pseudonym: true,
                ethAddress: true,
              },
            },
          };

          const arObjects = await daoArObjectQuery(
            {
              key: {
                in: keys,
              },
              artwork: {
                isPublic: true,
                isBanned: false,
              },
              isBanned: false,
              isPublic: true,
              creator: {
                isBanned: false,
              },
            },
            include,
            {
              updatedAt: "desc",
            },
            0,
            1000
          );

          if (arObjects) {
            return {
              totalCount: arObjects.length,
              arObjects: arObjects.map((arObj: any) => {
                return {
                  ...arObj,
                  subgraphInfo: tokensInfo[arObj.key] ?? [],
                };
              }),
            };
          }
        }
        return {
          totalCount: 0,
          arObjects: [],
        };
      },
    });

    t.nonNull.field("arObjectTokens", {
      type: "ArObjectTokens",

      args: {
        key: nonNull(stringArg()),
      },

      // resolve(root, args, ctx, info)
      async resolve(...[, args]) {
        const arObjTokens = await daoSubgraphGetArObjectTokens(
          args.key,
          100,
          0
        );

        if (arObjTokens) {
          const tokenInfo = await daoSubgraphGetParsedTokenInfos(arObjTokens);

          if (!tokenInfo || tokenInfo.length === 0)
            return {
              totalCount: 0,
              tokens: [],
            };

          const collectors = tokenInfo.reduce((colls: string[], token: any) => {
            if (token.owner === token.creator || colls.includes(token.owner))
              return colls;

            return [...colls, token.owner];
          }, []);

          const arObjCollectors = await daoPublicUserQuery(
            {
              ethAddress: {
                in: collectors,
              },
            },
            {
              pseudonym: "asc",
            },
            0,
            1000
          );

          return {
            totalCount: tokenInfo.length,
            tokens: tokenInfo.map((token: any) => {
              let collector = null;

              if (collectors.includes(token.owner)) {
                collector = arObjCollectors
                  ? arObjCollectors.find(
                      (c) => c.ethAddress?.toLowerCase() === token.owner
                    )
                  : null;
              }

              return {
                id: token.id,
                subgraphinfo: token,
                collector,
              };
            }),
          };
        }
        return {
          totalCount: 0,
          tokens: [],
        };
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

export const ArObjectMintInput = inputObjectType({
  name: "ArObjectMintInput",
  definition(t) {
    t.int("id");
    t.float("askPrice");
    t.boolean("setInitialAsk");
    t.int("editionOf");
    t.json("mintSignature");
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
              ArObjectStatusEnum.MINT,
              ArObjectStatusEnum.MINTING,
              ArObjectStatusEnum.MINTED,
              ArObjectStatusEnum.MINTERROR,
              ArObjectStatusEnum.MINTRETRY,
              ArObjectStatusEnum.DELETED,
            ],
          },
          creator: {
            id: ctx.appUser?.id ?? 0,
          },
        });

        return count === 1;
      },

      async resolve(...[, args, ctx]) {
        const currentObject = await daoArObjectGetOwnById(
          args.id,
          ctx?.appUser?.id ?? 0
        );

        if (!currentObject)
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Update failed");

        const arObject = await daoArObjectUpdate(args.id, {
          ...args.data,

          status: [
            ArObjectStatusEnum.DRAFT,
            ArObjectStatusEnum.PUBLISHED,
          ].includes(currentObject?.status)
            ? args.data?.status ?? ArObjectStatusEnum.DRAFT
            : undefined,
        });

        if (!arObject)
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Update failed");

        return arObject;
      },
    });

    t.nonNull.field("arObjectMint", {
      type: "ArObject",

      args: {
        id: nonNull(intArg()),
        data: nonNull("ArObjectMintInput"),
      },

      authorize: async (...[, args, ctx]) => {
        if (!authorizeApiUser(ctx, "artworkUpdateOwn")) return false;

        const count = await daoArObjectQueryCount({
          id: args.id,
          status: {
            notIn: [
              ArObjectStatusEnum.MINT,
              ArObjectStatusEnum.MINTING,
              ArObjectStatusEnum.MINTED,
              ArObjectStatusEnum.MINTERROR,
              ArObjectStatusEnum.MINTRETRY,
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
          editionOf: args.data.editionOf,
          setInitialAsk: !!args.data.setInitialAsk,
          askPrice: args.data.askPrice,
          mintSignature: args.data.mintSignature,
          status: ArObjectStatusEnum.MINT,
          artwork: {
            update: {
              status: ArtworkStatusEnum.HASMINTEDOBJECTS,
            },
          },
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
            notIn: [
              ArObjectStatusEnum.MINT,
              ArObjectStatusEnum.MINTING,
              ArObjectStatusEnum.MINTED,
              ArObjectStatusEnum.MINTERROR,
              ArObjectStatusEnum.MINTRETRY,
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
        const arObject = await daoArObjectDelete(args.id);

        if (!arObject)
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Delete failed");

        return { result: true };
      },
    });
  },
});
