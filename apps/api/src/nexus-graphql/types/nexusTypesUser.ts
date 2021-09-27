/// <reference path="../../types/nexus-typegen.ts" />
import { parseResolveInfo } from "graphql-parse-resolve-info";
import dedent from "dedent";
import { Prisma, User as PrismaTypeUser } from "@prisma/client";

import {
  objectType,
  extendType,
  inputObjectType,
  nonNull,
  stringArg,
  intArg,
  arg,
  list,
  interfaceType,
} from "nexus";
import httpStatus from "http-status";

import {
  userRead,
  userCreate,
  userUpdate,
  userDelete,
  userProfileUpdate,
} from "../../services/serviceUser";

import { GQLJson } from "./nexusTypesShared";
import {
  authorizeApiUser,
  isCurrentApiUser,
  isNotCurrentApiUser,
  isCurrentApiUserByEthAddress,
} from "../helpers";
import { getApiConfig } from "../../config";
import {
  daoUserQuery,
  daoUserQueryCount,
  daoUserFindFirst,
  daoUserProfileImageDelete,
} from "../../dao";

import {
  ImageStatusEnum,
  ArObjectStatusEnum,
  ArtworkStatusEnum,
  ApiError,
} from "../../utils";

const apiConfig = getApiConfig();

const UserBaseNode = interfaceType({
  name: "UserBaseNode",
  resolveType: (data) =>
    typeof (data as any).role !== "undefined" ? "User" : "PublicUser",
  definition(t) {
    t.nonNull.int("id");
    t.string("pseudonym");
    t.string("ethAddress");
    t.string("url");
    t.string("bio");
    t.list.string("roles");

    t.field("profileImage", {
      type: "Image",
    });

    t.list.field("artworks", {
      type: "Artwork",

      // async resolve(...[parent]) {
      //   if (parent?.profileImageId)
      //     return daoImageGetById(parent.profileImageId);

      //   return null;
      // },
    });
  },
});

export const PublicUser = objectType({
  name: "PublicUser",
  definition(t) {
    t.implements(UserBaseNode);
  },
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.implements(UserBaseNode);
    t.email("email");
    t.boolean("emailVerified");
    t.boolean("isBanned");
    t.boolean("acceptedTerms");
    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const UsersQueryResult = objectType({
  name: "UsersQueryResult",
  description: dedent`
    TODO: write better descriptions
    last item in the list. Pass this cuSimple wrapper around our list of launches that contains a cursor to the
    last item in the list. Pass this cursor to the launches query to fetch results
    after these.
  `,
  definition: (t) => {
    t.int("totalCount");
    t.field("users", { type: list(User) });
  },
});

export const UserQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("users", {
      type: UsersQueryResult,
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

      authorize: (...[, , ctx]) => authorizeApiUser(ctx, "userRead"),

      async resolve(...[, args]) {
        const totalCount = await daoUserQueryCount(args.where);
        let users: PrismaTypeUser[] = [];

        if (totalCount)
          users = await daoUserQuery(
            args.where,
            args.orderBy,
            args.pageIndex as number,
            args.pageSize as number
          );

        return {
          totalCount,
          users,
        };
      },
    });

    t.field("user", {
      type: "PublicUser",

      args: {
        ethAddress: nonNull(stringArg()),
      },

      // resolve(root, args, ctx, info)
      async resolve(...[, args, , info]) {
        const pRI = parseResolveInfo(info);
        let include = {};
        let where: Prisma.UserWhereInput = {
          isBanned: false,
          ethAddress: args.ethAddress,
        };
        if ((pRI?.fieldsByTypeName?.PublicUser as any)?.profileImage) {
          include = {
            ...include,
            profileImage: {
              select: {
                meta: true,
                status: true,
                id: true,
              },
            },
          };
          where = {
            ...where,
            OR: [
              {
                profileImage: {
                  status: ImageStatusEnum.READY,
                },
              },
              {
                profileImage: null,
              },
            ],
          };
        }

        if ((pRI?.fieldsByTypeName?.PublicUser as any)?.artworks) {
          include = {
            ...include,
            artworks: {
              select: {
                id: true,
                key: true,
                title: true,
                description: true,
                url: true,
                video: true,
                createdAt: true,
                isPublic: true,
                heroImage: {
                  select: {
                    id: true,
                    meta: true,
                    status: true,
                  },
                },
                creator: {
                  select: {
                    id: true,
                    ethAddress: true,
                    pseudonym: true,
                  },
                },
                arObjects: {
                  select: {
                    id: true,
                    status: true,
                    key: true,
                    orderNumber: true,
                    title: true,
                    askPrice: true,
                    editionOf: true,
                    isPublic: true,
                    heroImage: {
                      select: {
                        id: true,
                        meta: true,
                        status: true,
                      },
                    },
                    arModels: true,
                  },
                  where: {
                    isBanned: false,
                    isPublic: true,

                    status: {
                      in: [
                        ArObjectStatusEnum.PUBLISHED,
                        ArObjectStatusEnum.MINTCONFIRM,
                        ArObjectStatusEnum.MINT,
                        ArObjectStatusEnum.MINTING,
                        ArObjectStatusEnum.MINTED,
                      ],
                    },
                  },
                  orderBy: {
                    orderNumber: "asc",
                  },
                },
              },
              where: {
                isBanned: false,
                isPublic: true,
                status: {
                  in: [
                    ArtworkStatusEnum.PUBLISHED,
                    ArtworkStatusEnum.HASMINTEDOBJECTS,
                  ],
                },
                arObjects: {
                  some: {
                    status: {
                      in: [
                        ArObjectStatusEnum.PUBLISHED,
                        ArObjectStatusEnum.MINTCONFIRM,
                        ArObjectStatusEnum.MINT,
                        ArObjectStatusEnum.MINTING,
                        ArObjectStatusEnum.MINTED,
                      ],
                    },
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          };
        }
        return daoUserFindFirst(
          where,
          Object.keys(include).length > 0 ? include : undefined
        );
      },
    });

    t.field("userRead", {
      type: "User",

      args: {
        id: nonNull(intArg()),
      },

      authorize: (...[, , ctx]) => authorizeApiUser(ctx, "userRead"),

      // resolve(root, args, ctx, info)
      async resolve(...[, args]) {
        return userRead(args.id);
      },
    });

    t.field("userProfileRead", {
      type: "User",

      args: {
        ethAddress: nonNull(stringArg()),
      },

      authorize: (...[, args, ctx]) =>
        authorizeApiUser(ctx, "profileRead") &&
        isCurrentApiUserByEthAddress(ctx, args.ethAddress),

      // resolve(root, args, ctx, info)
      async resolve(...[, args, , info]) {
        const pRI = parseResolveInfo(info);
        let include = {};
        let where: Prisma.UserWhereInput = {
          isBanned: false,
          ethAddress: args.ethAddress,
        };

        if ((pRI?.fieldsByTypeName?.User as any)?.profileImage) {
          include = {
            ...include,
            profileImage: {
              select: {
                meta: true,
                status: true,
                id: true,
              },
            },
          };
          where = {
            ...where,
            OR: [
              {
                profileImage: {
                  status: ImageStatusEnum.READY,
                },
              },
              {
                profileImage: null,
              },
            ],
          };
        }

        if ((pRI?.fieldsByTypeName?.User as any)?.artworks) {
          include = {
            ...include,
            artworks: {
              select: {
                id: true,
                key: true,
                title: true,
                description: true,
                url: true,
                video: true,
                createdAt: true,
                isPublic: true,
                heroImage: {
                  select: {
                    id: true,
                    meta: true,
                    status: true,
                  },
                },
                creator: {
                  select: {
                    id: true,
                    ethAddress: true,
                    pseudonym: true,
                  },
                },
                arObjects: {
                  select: {
                    id: true,
                    status: true,
                    key: true,
                    orderNumber: true,
                    title: true,
                    askPrice: true,
                    editionOf: true,
                    isPublic: true,
                    heroImage: {
                      select: {
                        id: true,
                        meta: true,
                        status: true,
                      },
                    },
                    arModels: true,
                  },
                  where: {
                    isBanned: false,
                  },

                  orderBy: {
                    orderNumber: "asc",
                  },
                },
              },
              where: {
                isBanned: false,
                status: {
                  not: {
                    in: [ArtworkStatusEnum.TRASHED, ArtworkStatusEnum.DELETED],
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          };
        }
        return daoUserFindFirst(
          where,
          Object.keys(include).length > 0 ? include : undefined
        );
      },
    });
  },
});

export const UserSignupInput = inputObjectType({
  name: "UserSignupInput",
  definition(t) {
    t.nonNull.string("firstName");
    t.nonNull.string("lastName");
    t.nonNull.email("email");
    t.nonNull.string("password");
    t.nonNull.boolean("acceptedTerms");
  },
});

export const UserProfileUpdateInput = inputObjectType({
  name: "UserProfileUpdateInput",
  definition(t) {
    t.nonNull.string("pseudonym");
    t.nonNull.string("bio");
    t.nonNull.string("url");
    t.nonNull.email("email");
    t.nonNull.boolean("acceptedTerms");
  },
});

export const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  definition(t) {
    t.nonNull.string("firstName");
    t.nonNull.string("lastName");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.string("role");
    t.nonNull.boolean("isBanned");
    t.nonNull.boolean("acceptedTerms");
  },
});
export const UserUpdateInput = inputObjectType({
  name: "UserUpdateInput",
  definition(t) {
    t.nonNull.string("pseudonym");
    t.nonNull.string("url");
    t.nonNull.string("bio");
    t.nonNull.string("role");
    t.nonNull.boolean("isBanned");
  },
});

export const UserMutations = extendType({
  type: "Mutation",

  definition(t) {
    t.nonNull.field("userProfileUpdate", {
      type: "User",

      args: {
        id: nonNull(intArg()),
        data: nonNull(UserProfileUpdateInput),
      },

      authorize: (...[, args, ctx]) =>
        authorizeApiUser(ctx, "profileUpdate") &&
        isCurrentApiUser(ctx, args.id),

      async resolve(...[, args]) {
        const user = await userProfileUpdate(args.id, args.data);

        if (!user)
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Update failed");

        return user;
      },
    });

    t.nonNull.field("userUpdate", {
      type: "BooleanResult",

      args: {
        id: nonNull(intArg()),
        data: nonNull(UserUpdateInput),
      },

      authorize: (...[, , ctx]) => authorizeApiUser(ctx, "userUpdate"),

      async resolve(...[, args]) {
        const user = await userUpdate(args.id, args.data);

        if (!user)
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Update failed");

        return { result: true };
      },
    });

    t.nonNull.field("userProfileImageDelete", {
      type: "BooleanResult",

      args: {
        id: nonNull(intArg()),
      },

      authorize: async (...[, args, ctx]) => {
        const user = await daoUserFindFirst({ profileImageId: args.id });

        if (user) {
          return (
            authorizeApiUser(ctx, "profileUpdate") &&
            isCurrentApiUser(ctx, user.id)
          );
        }

        return false;
      },

      async resolve(...[, args, ctx]) {
        const user = await daoUserProfileImageDelete(
          args.id,
          ctx?.appUser?.id ?? 0
        );

        if (!user)
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Profile image delete failed"
          );

        return { result: true };
      },
    });

    t.nonNull.field("userDelete", {
      type: "BooleanResult",

      args: {
        id: nonNull(intArg()),
      },

      authorize: (...[, args, ctx]) =>
        authorizeApiUser(ctx, "userDelete") &&
        isNotCurrentApiUser(ctx, args.id),

      async resolve(...[, args]) {
        const user = await userDelete(args.id);

        if (!user)
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "User delete failed"
          );

        return { result: true };
      },
    });
  },
});
