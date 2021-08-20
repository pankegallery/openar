import httpStatus from "http-status";
import { User } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { JwtPayload } from "jsonwebtoken";

import type { RoleName, AuthenticatedAppUser } from "../apiuser";
import { createAuthenticatedAppUser } from "../apiuser";

import { AuthPayload } from "../types/auth";
import { daoTokenDeleteMany } from "../dao/token";

import {
  daoUserGetByLogin,
  daoUserGetById,
  daoUserUpdate,
  daoUserGetByEmail,
} from "../dao/user";
import { ApiError, TokenTypesEnum } from "../utils";
import {
  tokenVerify,
  tokenGenerateResetPasswordToken,
  tokenVerifyInDB,
  tokenGenerateAuthTokens,
  tokenGenerateVerifyEmailToken,
} from "./serviceToken";

import { logger } from "./serviceLogging";

import {
  sendResetPasswordEmail,
  sendEmailConfirmationEmail,
} from "./serviceEmail";

export const authSendEmailConfirmationEmail = async (
  userId: number,
  email: string
) => {
  const emailVerificationToken = await tokenGenerateVerifyEmailToken(userId);

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
          tokenPayload.user.pseudonym,
          tokenPayload.user.ethAddress,
          tokenPayload.user.role,
          tokenPayload.user.roles,
          tokenPayload.user.permissions
        );
      }
    }
  } catch (err) {
    logger.debug(`[auth.authenticateUserByToken]: ${err.name}: ${err.message}`);
  }

  return null;
};

export const authLoginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthPayload> => {
  const user = await daoUserGetByLogin(email, password);

  if (!user) {
    throw new AuthenticationError("Incorrect email or password");
  }

  if (user.isBanned)
    throw new ApiError(httpStatus.UNAUTHORIZED, "[auth] Access denied");

  daoTokenDeleteMany({
    ownerId: user.id,
    type: {
      in: [TokenTypesEnum.REFRESH, TokenTypesEnum.ACCESS],
    },
  });

  const authPayload: AuthPayload = await tokenGenerateAuthTokens(
    {
      id: user.id,
      pseudonym: user.pseudonym,
    },
    user.roles as RoleName[]
  );

  authPayload.user = {
    id: user.id,
    pseudonym: user.pseudonym,
    ethAddress: user.ethAddress,
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
        ethAddress: user.ethAddress,
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

export const authRequestPasswordResetEmail = async (
  email: string
): Promise<boolean> => {
  try {
    const userInDB = await daoUserGetByEmail(email);

    const passwordResetToken = await tokenGenerateResetPasswordToken(
      userInDB.email
    );

    sendResetPasswordEmail(email, passwordResetToken);

    return true;
  } catch (error) {
    logger.warn(error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "[auth.authRequestPasswordReset] Password reset request failed"
    );
  }
};

export const authRequestEmailVerificationEmail = async (
  userId: number
): Promise<boolean> => {
  try {
    const userInDb = await daoUserGetById(userId);

    if (userInDb)
      return await authSendEmailConfirmationEmail(userInDb.id, userInDb.email);

    return false;
  } catch (error) {
    logger.warn(error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "[auth.authRequestEmailVerificationEmail] Email verification request failed"
    );
  }
};

export const authResetPassword = async (
  password: string,
  token: string
): Promise<boolean> => {
  try {
    const tokenPayload = await tokenVerifyInDB(
      token,
      TokenTypesEnum.RESET_PASSWORD
    );

    if (tokenPayload && "user" in tokenPayload && "id" in tokenPayload.user) {
      const user = await daoUserGetById(tokenPayload.user.id);

      // TODO: what do we need to do here?
      // await daoUserUpdate(user.id, { password });

      daoTokenDeleteMany({
        ownerId: user.id,
        type: {
          in: [
            TokenTypesEnum.RESET_PASSWORD,
            TokenTypesEnum.ACCESS,
            TokenTypesEnum.REFRESH,
          ],
        },
      });

      return true;
    }

    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "[auth.authRefresh] Token validation failed"
    );
  } catch (error) {
    logger.warn(error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "[auth.authResetPassword] Password reset failed"
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
  authLoginUserWithEmailAndPassword,
  authLogout,
  authRefresh,
  authRequestPasswordResetEmail,
  authRequestEmailVerificationEmail,
  authResetPassword,
  authSendEmailConfirmationEmail,
  authVerifyEmail,
};
