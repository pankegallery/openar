/// <reference path="../../types/nexus-typegen.ts" />

import { objectType, extendType, nonNull, intArg, stringArg, arg } from "nexus";
import { AuthenticationError } from "apollo-server-express";

import {
  authLoginUserWithEmailAndPassword,
  authLogout,
  authRefresh,
  authRequestPasswordResetEmail,
  authResetPassword,
  authRequestEmailVerificationEmail,
  authVerifyEmail,
} from "../../services/serviceAuth";
import {
  tokenProcessRefreshToken,
  tokenClearRefreshToken,
} from "../../services/serviceToken";
import { authorizeApiUser, isCurrentApiUser } from "../helpers";
import { BooleanResult, GQLEmailAddress } from "./nexusTypesShared";

import { logger } from "../../services/serviceLogging";

export const AuthUser = objectType({
  name: "AuthUser",
  definition(t) {
    t.nonNull.int("id", { description: "Id of the user" });
    t.list.string("roles", { description: "The roles the user might hold" });
    t.list.string("permissions", {
      description: "The permissions the user might have been given",
    });
  },
});

export const AuthPayloadToken = objectType({
  name: "AuthPayloadToken",
  definition(t) {
    t.jwt("token");
    t.nonNull.string("expires");
  },
});

export const AuthPayloadTokens = objectType({
  name: "AuthPayloadTokens",
  definition(t) {
    t.field("access", {
      type: AuthPayloadToken,
    });
    t.field("refresh", {
      type: AuthPayloadToken,
    });
  },
});

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.field("user", {
      type: AuthUser,
    });
    t.field("tokens", {
      type: AuthPayloadTokens,
    });
  },
});

export const AuthMutations = extendType({
  type: "Mutation",

  definition(t) {
    t.nonNull.field("authLogin", {
      type: "AuthPayload",
      args: {
        email: nonNull(
          arg({
            type: GQLEmailAddress,
          })
        ),
        password: nonNull(stringArg()),
      },
      async resolve(...[, args, { res }]) {
        try {
          const authPayload = await authLoginUserWithEmailAndPassword(
            args.email,
            args.password
          );
          logger.debug(
            `authLogin, about toe set new refresh token cookie ${authPayload?.tokens?.refresh?.token}`
          );
          return tokenProcessRefreshToken(res, authPayload);
        } catch (Err) {
          throw new AuthenticationError("Login Failed");
        }
      },
    });

    t.nonNull.field("authRefresh", {
      type: "AuthPayload",

      authorize: (...[, , ctx]) =>
        authorizeApiUser(ctx, "canRefreshAccessToken", true),

      async resolve(...[, args, { res, req }]) {
        // throw new AuthenticationError("Access Denied"); TODO: REmove
        logger.debug("Auth refresh #1");
        const token = req?.cookies?.refreshToken;

        if (!token) throw new AuthenticationError("Access Denied");

        logger.debug("Auth refresh #2");
        const authPayload = await authRefresh(token);

        logger.debug("Auth refresh #3");
        if (!authPayload || !authPayload?.tokens?.refresh?.token)
          throw new AuthenticationError("Access Denied");

        logger.debug("Auth refresh #4");
        logger.debug(
          `authRefresh, about toe set new refresh token cookie ${authPayload.tokens.refresh.token}`
        );
        return tokenProcessRefreshToken(res, authPayload);
      },
    });

    t.nonNull.field("authLogout", {
      type: BooleanResult,
      args: {
        userId: nonNull(intArg()),
      },

      async resolve(...[, args, { res, apiUser }]) {
        // in any case we want to remove the refresh token for the submitting user

        logger.debug(`authLogout calling tokenClearRefreshToken`);
        tokenClearRefreshToken(res);

        // then test if the submitting user is the user to be logged out
        if (!apiUser || apiUser.id !== args.userId)
          throw new AuthenticationError("Logout Failed (1)");

        // okay then log the user out
        const result = await authLogout(args.userId);

        if (!result) throw new AuthenticationError("Logout Failed (2)");

        return { result };
      },
    });

    t.nonNull.field("authPasswordRequest", {
      type: BooleanResult,
      args: {
        scope: nonNull(stringArg()),
        email: nonNull(
          arg({
            type: GQLEmailAddress,
          })
        ),
      },

      async resolve(...[, args]) {
        const result = await authRequestPasswordResetEmail(
          args.email
        );

        return { result };
      },
    });

    t.nonNull.field("authRequestEmailVerificationEmail", {
      type: BooleanResult,
      args: {
        scope: nonNull(stringArg()),
        userId: nonNull(intArg()),
      },

      authorize: (...[, args, ctx]) =>
        authorizeApiUser(ctx, "profileUpdate") &&
        isCurrentApiUser(ctx, args.userId),

      async resolve(...[, args]) {
        const result = await authRequestEmailVerificationEmail(
          args.userId
        );

        return { result };
      },
    });

    t.nonNull.field("authPasswordReset", {
      type: BooleanResult,
      args: {
        password: nonNull(stringArg()),
        token: nonNull(stringArg()),
      },

      async resolve(...[, args, { res }]) {
        const result = await authResetPassword(args.password, args.token);

        logger.debug(`authPasswordReset calling tokenClearRefreshToken`);
        tokenClearRefreshToken(res);

        return { result };
      },
    });

    t.nonNull.field("authVerifyEmail", {
      type: BooleanResult,
      args: {
        token: nonNull(stringArg()),
      },

      async resolve(...[, args]) {
        const result = await authVerifyEmail(args.token);

        return { result };
      },
    });
  },
});
