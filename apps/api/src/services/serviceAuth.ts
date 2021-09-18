import httpStatus from "http-status";
import { User } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { JwtPayload } from "jsonwebtoken";

import type { RoleName, AuthenticatedAppUser } from "../apiuser";
import { createAuthenticatedAppUser } from "../apiuser";

import { AuthPayload } from "../types/auth";
import { daoTokenDeleteMany } from "../dao/token";

import type { NexusResolverContext } from "../nexus-graphql";

import {
  daoUserGetById,
  daoUserUpdate,
  daoUserGetByEthAddress,
  daoUserFindByEthAddress,
  daoUserCreate,
} from "../dao/user";
import { ApiError, TokenTypesEnum } from "../utils";
import {
  tokenVerify,
  tokenGenerateSignatureToken,
  tokenVerifyInDB,
  tokenGenerateAuthTokens,
  tokenGenerateVerifyEmailToken,
} from "./serviceToken";

import { logger } from "./serviceLogging";

import { sendEmailConfirmationEmail } from "./serviceEmail";

export const authSendEmailConfirmationEmail = async (
  userId: number,
  ethAddress: string,
  email: string
) => {
  const emailVerificationToken = await tokenGenerateVerifyEmailToken(
    userId,
    ethAddress
  );

  sendEmailConfirmationEmail(email, emailVerificationToken);
  return true;
};

export const authAuthenticateUserByToken = (
  token: string
): AuthenticatedAppUser | null => {
  try {
    const tokenPayload: JwtPayload | null = tokenVerify(token);

    if (tokenPayload) {
      if ("user" in tokenPayload) {
        if (
          !(
            "id" in tokenPayload.user &&
            "roles" in tokenPayload.user &&
            "permissions" in tokenPayload.user
          )
        )
          return null;

        return createAuthenticatedAppUser(
          tokenPayload.user.id,
          tokenPayload.user.roles,
          tokenPayload.user.permissions,
          tokenPayload.user.pseudonym,
          tokenPayload.user.ethAddress
        );
      }
    }
  } catch (err: any) {
    logger.debug(`[auth.authenticateUserByToken]: ${err.name}: ${err.message}`);
  }

  return null;
};

export const authLoginUserWithSignature = async (
  ethAddress: string,
  signedMessage: string
): Promise<AuthPayload> => {
  const user = await daoUserGetByEthAddress(ethAddress);

  if (!user)
    throw new ApiError(httpStatus.UNAUTHORIZED, "[auth] Access denied");

  if (user.isBanned)
    throw new ApiError(httpStatus.UNAUTHORIZED, "[auth] Access denied");

  // TODO: Implement
  logger.info(signedMessage);

  daoTokenDeleteMany({
    ownerId: user.id,
    type: {
      in: [
        TokenTypesEnum.REFRESH,
        TokenTypesEnum.ACCESS,
        TokenTypesEnum.SIGNATURE,
      ],
    },
  });

  const authPayload = await tokenGenerateAuthTokens(
    {
      id: user.id,
      pseudonym: user.pseudonym,
      email: user.email,
      ethAddress,
    },
    user.roles as RoleName[]
  );

  authPayload.user = {
    id: user.id,
    pseudonym: user.pseudonym,
    ethAddress,
    email: user.email,
  };

  return authPayload;
};

export const authPreLoginUserWithEthAddress = async (
  ethAddress: string,
  ctx: NexusResolverContext
): Promise<AuthPayload> => {
  let authPayload: AuthPayload;
  let user = await daoUserFindByEthAddress(ethAddress);

  if (!user) {
    user = await daoUserCreate({
      ethAddress,
      roles: ["user"],
    });
    authPayload = await tokenGenerateAuthTokens(
      {
        id: user.id,
        pseudonym: user.pseudonym,
        email: user.email,
        ethAddress,
      },
      user.roles as RoleName[]
    );
  }

  if (!user) throw new AuthenticationError("[auth] Could not pre login user");

  if (user.isBanned)
    throw new ApiError(httpStatus.UNAUTHORIZED, "[auth] Access denied");

  if (ctx.appUser && ctx.tokenInfo.validRefreshTokenProvided) {
    const tokenPayload: JwtPayload | null = await tokenVerifyInDB(
      ctx.req?.cookies?.refreshToken,
      TokenTypesEnum.REFRESH
    );

    if (!tokenPayload)
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "[auth.authRefresh] Please authenticate (1)"
      );

    authPayload = await tokenGenerateAuthTokens(
      {
        id: user.id,
        pseudonym: user.pseudonym,
        email: user.email,
        ethAddress,
      },
      user.roles as RoleName[]
    );
  } else {
    daoTokenDeleteMany({
      ownerId: user.id,
      type: {
        in: [
          TokenTypesEnum.REFRESH,
          TokenTypesEnum.ACCESS,
          TokenTypesEnum.SIGNATURE,
        ],
      },
    });
    authPayload = await tokenGenerateSignatureToken({
      id: user.id,
      ethAddress,
    });
  }

  authPayload.user = {
    id: user.id,
    pseudonym: user.pseudonym,
    ethAddress,
    email: user.email,
  };

  return authPayload;
};

export const authLogout = async (ownerId: number): Promise<boolean> => {
  daoTokenDeleteMany({
    ownerId,
    type: {
      in: [TokenTypesEnum.REFRESH, TokenTypesEnum.ACCESS],
    },
  });

  return true;
};

export const authRefresh = async (refreshToken: string) => {
  try {
    const tokenPayload: JwtPayload | null = await tokenVerifyInDB(
      refreshToken,
      TokenTypesEnum.REFRESH
    );

    if (!tokenPayload)
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "[auth.authRefresh] Please authenticate (1)"
      );

    const user: User = await daoUserGetById(tokenPayload.user.id);

    if (!user) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "[auth.authRefresh] Please authenticate (2)"
      );
    }

    if (user.isBanned)
      throw new ApiError(httpStatus.FORBIDDEN, "[auth] Access denied");

    await daoTokenDeleteMany({
      ownerId: user.id,
      type: TokenTypesEnum.REFRESH,
    });

    return await tokenGenerateAuthTokens(
      {
        id: user.id,
        pseudonym: user.pseudonym,
        ethAddress: user.ethAddress ?? "",
        email: user.email,
      },
      user.roles as RoleName[]
    );
  } catch (error) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "[auth.authRefresh] Please authenticate (3)"
    );
  }
};

export const authRequestEmailVerificationEmail = async (
  userId: number
): Promise<boolean> => {
  try {
    const userInDb = await daoUserGetById(userId);

    if (userInDb && userInDb.email)
      return await authSendEmailConfirmationEmail(
        userInDb.id,
        userInDb.ethAddress ?? "",
        userInDb.email
      );

    return false;
  } catch (error) {
    logger.warn(error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "[auth.authRequestEmailVerificationEmail] Email verification request failed"
    );
  }
};

export const authVerifyEmail = async (token: string) => {
  try {
    const tokenPayload = await tokenVerifyInDB(
      token,
      TokenTypesEnum.VERIFY_EMAIL
    );
    if (tokenPayload && "user" in tokenPayload && "id" in tokenPayload.user) {
      daoTokenDeleteMany({
        ownerId: tokenPayload.id,
        type: TokenTypesEnum.VERIFY_EMAIL,
      });
      await daoUserUpdate(tokenPayload.user.id, {
        emailVerified: true,
      });

      return true;
    }

    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "[auth.authVerifyEmail] Token validation failed"
    );
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

export default {
  authAuthenticateUserByToken,
  authLoginUserWithSignature,
  authLogout,
  authRefresh,
  authRequestEmailVerificationEmail,
  authSendEmailConfirmationEmail,
  authVerifyEmail,
};
