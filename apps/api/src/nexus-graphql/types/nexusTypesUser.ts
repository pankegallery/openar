/// <reference path="../../types/nexus-typegen.ts" />

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
import { filteredOutputByWhitelist, ApiError } from "../../utils";

import {
  userRegister,
  userRead,
  userCreate,
  userUpdate,
  userDelete,
  userProfileUpdate,
} from "../../services/serviceUser";
import {
  tokenProcessRefreshToken,
  tokenClearRefreshToken,
} from "../../services/serviceToken";
import { GQLJson } from "./nexusTypesShared";
import {
  authorizeApiUser,
  isCurrentApiUser,
  isNotCurrentApiUser,
} from "../helpers";
import { getApiConfig } from "../../config";
import {
  daoUserQuery,
  daoUserQueryCount,
  daoUserFindFirst,
  daoImageGetById,
  daoUserProfileImageDelete,
  daoUserGetByEthAddress,
} from "../../dao";

const apiConfig = getApiConfig();

const UserBaseNode = interfaceType({
  name: "UserBaseNode",
  resolveType: (data) =>
    typeof (data as any).role !== "undefined" ? "User" : "PublicUser",
  definition(t) {
    t.nonNull.int("id");
    t.int("profileImageId");
    t.string("pseudonym");
    t.string("ethAddress");
    t.email("email");
    t.boolean("emailVerified");
    t.string("url");
    t.string("bio");
    t.list.string("roles");
    t.field("profileImage", {
      type: "Image",

      async resolve(...[parent]) {
        console.log(parent);

        if (parent?.profileImageId)
          return daoImageGetById(parent.profileImageId);

        return null;
      },
    });
  },
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.implements(UserBaseNode);
    t.boolean("isBanned");
    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const PublicUser = objectType({
  name: "PublicUser",
  definition(t) {
    t.implements(UserBaseNode);
    t.field("profileImage", {
      type: "Image",

      async resolve(...[parent]) {
        if (parent?.profileImageId)
          return daoImageGetById(parent.profileImageId);

        return null;
      },
    });
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

      // TODO: authorize: :  (...[, , ctx]) => authorizeApiUser(ctx, "userRead"),

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

    // TODO: this needs to go ...
    // t.field("adminUsers", {
    //   type: list("AdminUser"),
    //   deprecation:
    //     "A publicly accessible list Lists all users that have a the given roles",

    //   args: {
    //     roles: nonNull(list(stringArg())),
    //   },

    //   // // TODO: authorize: :  (...[, , ctx]) =>
    //   //   authorizeApiUser(ctx, "accessAsAuthenticatedUser"),

    //   async resolve(...[, args]) {
    //     const users = await daoUserQuery(
    //       {
    //         role: {
    //           in: (args.roles ?? []) as Prisma.Enumerable<string>,
    //         },
    //       },
    //       [{ firstName: "asc" }, { lastName: "asc" }],
    //       0,
    //       10000
    //     );

    //     return filteredOutputByWhitelist(users, [
    //       "id",
    //       "firstName",
    //       "lastName",
    //     ]);
    //   },
    // });

    t.nonNull.field("userByEthAddress", {
      type: "User",

      args: {
        ethAddress: nonNull(stringArg()),
      },

      // TODO: authorize: :  (...[, , ctx]) => authorizeApiUser(ctx, "userRead"),

      // resolve(root, args, ctx, info)
      async resolve(...[, args]) {
        return daoUserGetByEthAddress(args.ethAddress);
      },
    });

    t.nonNull.field("userRead", {
      type: "User",

      args: {
        id: nonNull(intArg()),
      },

      // TODO: authorize: :  (...[, , ctx]) => authorizeApiUser(ctx, "userRead"),

      // resolve(root, args, ctx, info)
      async resolve(...[, args]) {
        return userRead(args.id);
      },
    });

    t.nonNull.field("userProfileRead", {
      type: "PublicUser",

      args: {
        id: nonNull(intArg()),
      },

      // TODO: authorize: :  (...[, args, ctx]) =>
      //  authorizeApiUser(ctx, "profileRead") && isCurrentApiUser(ctx, args.id),

      // resolve(root, args, ctx, info)
      async resolve(...[, args]) {
        return userRead(args.id);
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
    // t.nonNull.field("userSignup", {
    //   type: "AuthPayload",
    //   args: {
    //     data: nonNull(UserSignupInput),
    //   },

    //   // TODO: authorize: :  () => apiConfig.enablePublicRegistration,

    //   async resolve(...[, args, { res }]) {
    //     const authPayload = await userRegister(args.data);

    //     if (!authPayload)
    //       throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Signup Failed");

    //     return tokenProcessRefreshToken(res, authPayload);
    //   },
    // });

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

    t.nonNull.field("userCreate", {
      type: "User",

      args: {
        data: nonNull(UserCreateInput),
      },

      // TODO: how to lock down the API // TODO: authorize: :  (...[, , ctx]) => authorizeApiUser(ctx, "userCreate"),

      async resolve(...[, args]) {
        const user = await userCreate(args.data);

        if (!user)
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Creation failed"
          );

        return user;
      },
    });

    t.nonNull.field("userUpdate", {
      type: "BooleanResult",

      args: {
        id: nonNull(intArg()),
        data: nonNull(UserUpdateInput),
      },

      // TODO: authorize: :  (...[, , ctx]) => authorizeApiUser(ctx, "userUpdate"),

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
        console.log(1, ctx?.appUser);
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
        console.log(2, ctx?.appUser);
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

      // TODO: authorize: :  (...[, args, ctx]) =>
      // authorizeApiUser(ctx, "userDelete") &&
      // isNotCurrentApiUser(ctx, args.id),

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
