/// <reference path="../../types/nexus-typegen.ts" />

import { objectType, extendType, nonNull, intArg, stringArg } from "nexus";
import { AuthenticationError } from "apollo-server-express";

import {
  authPreLoginUserWithEthAddress,
  authLoginUserWithSignature,
  authLogout,
  authRefresh,
  authRequestEmailVerificationEmail,
  authVerifyEmail,
  authRegisterByEmail,
  authLoginByEmail,
  authChangePassword,
  authResetPassword,
  authResetPasswordRequest
} from "../../services/serviceAuth";
import {
  tokenProcessRefreshToken,
  tokenClearRefreshToken,
} from "../../services/serviceToken";
import { authorizeApiUser, isCurrentApiUser } from "../helpers";
import { BooleanResult } from "./nexusTypesShared";

import { logger } from "../../services/serviceLogging";

export const AuthUser = objectType({
  name: "AuthUser",
  definition(t) {
    t.nonNull.int("id", { description: "Id of the user" });
    t.nonNull.string("ethAddress", { description: "ethAddress of the user" });
    t.string("pseudonym", { description: "Pseudonym of the user" });
    t.string("email", { description: "email address of the user" });
    t.string("message", {
      description: "The message that should be signed on login",
    });
    t.boolean("isNew", {
      description:
        "true if this ethAddress has just been registered in the system (first connect)",
    });
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
    t.field("sign", {
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
    t.nonNull.field("authRegisterByEmail", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      async resolve(...[, args, ctx]) {
        try {
          logger.warn("Starting authRegisterByEmail")
          const { authPayload, user } = await authRegisterByEmail(
            args.email.toLowerCase().trim(),
            args.password
          );

          logger.warn("Got user")
          logger.warn(user.email)
          
          if (user)
            await authRequestEmailVerificationEmail(user.id)

            logger.warn("Requested email")

          logger.debug(
            `authRegisterByEmail ${authPayload?.tokens?.sign?.token}`
          );

          return tokenProcessRefreshToken(ctx.res, authPayload);
        } catch (Err) {
          logger.debug(Err);
          throw new AuthenticationError("Email Registration Failed");
        }
      },
    });

    t.nonNull.field("authLoginByEmail", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      async resolve(...[, args, ctx]) {
        try {
          const authPayload = await authLoginByEmail(
            args.email.toLowerCase().trim(),
            args.password
          );

          logger.debug(
            `authLoginByEmail ${authPayload?.tokens?.sign?.token}`
          );

          return tokenProcessRefreshToken(ctx.res, authPayload);
        } catch (Err) {
          logger.debug(Err);
          throw new AuthenticationError("Email Login Failed");
        }
      },
    });

    t.nonNull.field("authPreLogin", {
      type: "AuthPayload",
      args: {
        ethAddress: nonNull(stringArg()),
      },
      async resolve(...[, args, ctx]) {
        try {
          const authPayload = await authPreLoginUserWithEthAddress(
            args.ethAddress,
            ctx
          );

          logger.debug(
            `authLogin, about sign message ${authPayload?.tokens?.sign?.token}`
          );

          return tokenProcessRefreshToken(ctx.res, authPayload);
        } catch (Err) {
          logger.debug(Err);
          throw new AuthenticationError("Pre login Failed");
        }
      },
    });

    t.nonNull.field("authLogin", {
      type: "AuthPayload",
      args: {
        ethAddress: nonNull(stringArg()),
        signedMessage: nonNull(stringArg()),
      },

      async resolve(...[, args, ctx]) {
        try {
          const authPayload = await authLoginUserWithSignature(
            args.ethAddress,
            args.signedMessage
          );

          logger.debug(
            `authLogin, about sign message ${authPayload?.tokens?.sign?.token}`
          );

          return tokenProcessRefreshToken(ctx.res, authPayload);
        } catch (Err) {
          throw new AuthenticationError("Pre login Failed");
        }
      },
    });

    t.nonNull.field("authRefresh", {
      type: "AuthPayload",

      authorize: (...[, , ctx]) =>
        authorizeApiUser(ctx, "canRefreshAccessToken", true),

      async resolve(...[, , { res, req }]) {
        const token = req?.cookies?.refreshToken;

        if (!token) throw new AuthenticationError("Access Denied");

        const authPayload = await authRefresh(token);

        if (!authPayload || !authPayload?.tokens?.refresh?.token)
          throw new AuthenticationError("Access Denied");

        return tokenProcessRefreshToken(res, authPayload);
      },
    });

    t.nonNull.field("authLogout", {
      type: BooleanResult,
      args: {
        userId: nonNull(intArg()),
      },

      async resolve(...[, args, { res, appUser }]) {
        // in any case we want to remove the refresh token for the submitting user

        logger.debug(`authLogout calling tokenClearRefreshToken`);
        tokenClearRefreshToken(res);

        // then test if the submitting user is the user to be logged out
        if (!appUser || appUser.id !== args.userId)
          throw new AuthenticationError("Logout Failed (1)");

        // okay then log the user out
        const result = await authLogout(args.userId);

        if (!result) throw new AuthenticationError("Logout Failed (2)");

        return { result };
      },
    });

    t.nonNull.field("authChangePassword", {
      type: BooleanResult,
      args: {
        userId: nonNull(intArg()),
        currentPassword: nonNull(stringArg()),
        newPassword: nonNull(stringArg())
      },

      authorize: (...[, args, ctx]) =>
        authorizeApiUser(ctx, "profileUpdate") &&
        isCurrentApiUser(ctx, args.userId),

      async resolve(...[, args]) {
        const result = await authChangePassword(args.userId, args.currentPassword, args.newPassword);
        if (!result) throw new AuthenticationError("Failed to update password");

        return { result };
      },
    });

    t.nonNull.field("authResetPasswordRequest", {
      type: BooleanResult,
      args: {
        email: nonNull(stringArg()),
      },

      async resolve(...[, args]) {
        const result = await authResetPasswordRequest(args.email);
        if (!result) throw new AuthenticationError("Failed request to reset password");

        return { result };
      },
    });

    t.nonNull.field("authResetPassword", {
      type: BooleanResult,
      args: {
        password: nonNull(stringArg()),
        token: nonNull(stringArg()),
      },

      async resolve(...[, args]) {
        const result = await authResetPassword(args.password, args.token);
        if (!result) throw new AuthenticationError("Failed to reset password");

        return { result };
      },
    });

    t.nonNull.field("authRequestEmailVerificationEmail", {
      type: BooleanResult,
      args: {
        userId: nonNull(intArg()),
      },

      authorize: (...[, args, ctx]) =>
        authorizeApiUser(ctx, "profileUpdate") &&
        isCurrentApiUser(ctx, args.userId),

      async resolve(...[, args]) {
        const result = await authRequestEmailVerificationEmail(args.userId);

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
