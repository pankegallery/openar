import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { addDays, addMinutes } from "date-fns";
import {
  apiRolesAndPermissions,
  RoleName,
  JwtPayloadAuthenticatedApiUser,
} from "../apiuser";
import { Response } from "express";

import { apiConfig } from "../config";
import { AuthPayload } from "../types/auth";
import { daoTokenCreate, daoTokenFindFirst } from "../dao/token";
import { daoUserGetByEmail } from "../dao/user";

import { ApiError, TokenTypesEnum } from "../utils";

import { logger } from "./serviceLogging";

export const generateToken = (
  payloadUser: JwtPayloadAuthenticatedApiUser,
  roles: RoleName[],
  expires: Date,
  type: TokenTypesEnum,
  secret?: string
) => {
  let user: JwtPayloadAuthenticatedApiUser = {
    id: payloadUser.id,
  };

  if (payloadUser.pseudonym)
    user = {
      ...user,
      pseudonym: payloadUser.pseudonym,
    };

  if (payloadUser.ethAddress)
    user = {
      ...user,
      ethAddress: payloadUser.ethAddress,
    };

  if (roles) {
    if (type === TokenTypesEnum.ACCESS)
      user = {
        ...user,
        ...{
          roles,
          permissions: apiRolesAndPermissions.getCombinedPermissions(roles),
        },
      };

    // the refresh token should only grant the minimal permissions
    if (type === TokenTypesEnum.REFRESH)
      user = {
        ...user,
        ...{
          roles: ["refresh"],
          permissions: apiRolesAndPermissions.getCombinedPermissions(["refresh"]),
        },
      };
  }

  // expose roles in token TODO: expose roles
  const payload = {
    user,
    iat: new Date().getTime() / 1000,
    exp: expires.getTime() / 1000,
    type,
  };

  return jwt.sign(payload, secret ?? apiConfig.jwt.secret);
};

export const tokenVerify = (token: string): JwtPayload | null => {
  try {
    if (!apiConfig.jwt.secret) {
      const msg = "Please configure your JWT Secret";
      logger.info(`Error: ${msg}`);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "(VT 1)");
    }

    const tokenPayload: JwtPayload | string = jwt.verify(
      token,
      apiConfig.jwt.secret ?? "",
      {}
    );

    if (typeof tokenPayload === "object") {
      console.log(`Token payload.exp ${tokenPayload.exp ?? 0}`);

      if (Date.now() >= (tokenPayload.exp ?? 0) * 1000) {
        logger.debug(`Error: Token expired (VT 2)`);
        throw new ApiError(httpStatus.UNAUTHORIZED, "(VT 2)");
      }
    } else {
      return null;
    }
    return tokenPayload;
  } catch (err) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      `Token not authorized (${err.message})`
    );
  }
};

export const tokenVerifyInDB = async (
  token: string,
  type: TokenTypesEnum
): Promise<JwtPayload | null> => {
  try {
    const tokenPayload = tokenVerify(token);

    if (!(tokenPayload as any)?.user?.id) {
      logger.debug(`Error: Supplied token incomplete (VTDB 1)`);
      throw new ApiError(httpStatus.UNAUTHORIZED, "VTDB 1");
    }

    // this should be dao

    const tokenInDB = await daoTokenFindFirst({
      token,
      type,
      ownerId: parseInt((tokenPayload as any).user.id, 10),
    });

    if (!tokenInDB) {
      logger.debug({
        token,
        type,
        ownerId: parseInt((tokenPayload as any).user.id, 10),
      });
      logger.debug(`Error: Token not found (VTDB 2)`);
      throw new ApiError(httpStatus.UNAUTHORIZED, "VTDB 2");
    }

    return tokenPayload;
  } catch (err) {
    logger.debug(`Token not authorized (${err.message})`);
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      `Token not authorized (${err.message})`
    );
  }
};

export const tokenGenerateAuthTokens = async (
  user: JwtPayloadAuthenticatedApiUser,
  roles: RoleName[]
): Promise<AuthPayload> => {
  const accessTokenExpires = addMinutes(
    new Date(),
    apiConfig.jwt.expiration.access
  );

  const accessToken = generateToken(
    user,
    roles,
    accessTokenExpires,
    TokenTypesEnum.ACCESS
  );

  const refreshTokenExpires = addDays(
    new Date(),
    apiConfig.jwt.expiration.refresh
  );

  const refreshToken = generateToken(
    {
      id: user.id,
    },
    roles,
    refreshTokenExpires,
    TokenTypesEnum.REFRESH
  );

  await daoTokenCreate(
    refreshToken,
    user.id,
    refreshTokenExpires,
    TokenTypesEnum.REFRESH
  );

  const authPayload: AuthPayload = {
    user: undefined,
    tokens: {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toISOString(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toISOString(),
      },
    },
  };
  return authPayload;
};

export const tokenGenerateResetPasswordToken = async (
  email: string
) => {
  const user = await daoUserGetByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Email not found");
  }
  const expires = addMinutes(
    new Date(),
    apiConfig.jwt.expiration.passwordReset
  );

  const resetPasswordToken = generateToken(
    {
      id: user.id,
    },
    ["api"],
    expires,
    TokenTypesEnum.RESET_PASSWORD
  );
  await daoTokenCreate(
    resetPasswordToken,
    user.id,
    expires,
    TokenTypesEnum.RESET_PASSWORD
  );
  return resetPasswordToken;
};

export const tokenGenerateVerifyEmailToken = async (
  ownerId: number
) => {
  const expires = addDays(
    new Date(),
    apiConfig.jwt.expiration.emailConfirmation
  );
  const verifyEmailToken = generateToken(
    {
      id: ownerId,
    },
    ["api"],
    expires,
    TokenTypesEnum.VERIFY_EMAIL
  );
  await daoTokenCreate(
    verifyEmailToken,
    ownerId,
    expires,
    TokenTypesEnum.VERIFY_EMAIL
  );
  return verifyEmailToken;
};

export const tokenProcessRefreshToken = (
  res: any, // TODO: this should be properly typed
  authPayload: AuthPayload
): AuthPayload => {
  const secureCookie = apiConfig.baseUrl.api.indexOf("localhost") === -1;
  res.cookie("refreshToken", (authPayload as any).tokens.refresh.token, {
    sameSite: secureCookie ? "none" : "lax",
    secure: secureCookie ?? undefined,
    httpOnly: true,
    maxAge:
      new Date((authPayload as any).tokens.refresh.expires).getTime() -
      new Date().getTime(),
  });

  // eslint-disable-next-line no-param-reassign
  (authPayload as any).tokens.refresh.token = "content is hidden ;-P";

  return authPayload;
};

export const tokenClearRefreshToken = (res: Response): void => {
  const secureCookie = apiConfig.baseUrl.api.indexOf("localhost") === -1;
  res.cookie("refreshToken", "", {
    sameSite: secureCookie ? "none" : "lax",
    secure: secureCookie ?? undefined,
    httpOnly: true,
    maxAge: 0,
  });
};

export default {
  generateToken,
  tokenVerify,
  tokenVerifyInDB,
  tokenGenerateAuthTokens,
  tokenGenerateResetPasswordToken,
  tokenGenerateVerifyEmailToken,
  tokenProcessRefreshToken,
};
