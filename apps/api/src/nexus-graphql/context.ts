import { Request, Response } from "express";

import { AuthenticatedAppUser } from "../apiuser";

import { logger } from "../services/serviceLogging";

import { authAuthenticateUserByToken } from "../services/serviceAuth";

export interface NexusResolverContext {
  req: Request;
  res: Response;
  appUser: AuthenticatedAppUser | null;
  queryStartsWith: string;
  tokenInfo: {
    accessTokenProvided: boolean;
    refreshTokenProvided: boolean;
    validAccessTokenProvided: boolean;
    validRefreshTokenProvided: boolean;
  };
}

export const context = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): NexusResolverContext => {
  let appUser: AuthenticatedAppUser | null = null;
  let accessTokenProvided = false;
  let refreshTokenProvided = false;
  let validAccessTokenProvided = false;
  let validRefreshTokenProvided = false;

  const queryStartsWith = req?.body?.query
    ? req.body.query
        .replace("\t", "")
        .replace("  ", " ")
        .replace("\n", "")
        .substring(0, 40)
    : "no query passed in the body";

  let accessToken = req?.headers?.authorization ?? "";
  
  if (accessToken) {
    accessTokenProvided = true;

    try {
      if (accessToken.indexOf("Bearer") > -1)
        accessToken = accessToken.replace(/(Bearer:? )/g, "");

      appUser = authAuthenticateUserByToken(accessToken);

      if (appUser) {
        validAccessTokenProvided = true;
      } else {
        logger.warn("Authentication token invalid in context (1)");
      }
    } catch (Err) {
      logger.warn("Authentication token invalid in context (2)");
    }
  }

  // TODO: REMOVE
  // logger.debug(`Context: Auth token: ${accessToken}`);

  const refreshToken = req?.cookies?.refreshToken ?? "";

  // TODO: REMOVE
  // logger.debug(`Context: Refresh token: ${refreshToken}`);

  // TODO: Remove
  // if (refreshToken)
  //   console.log(refreshToken, authAuthenticateUserByToken(refreshToken ?? ""));

  if (refreshToken) {
    refreshTokenProvided = true;

    try {
      const appUserInRefreshToken = authAuthenticateUserByToken(refreshToken);

      if (appUserInRefreshToken) {
        validRefreshTokenProvided = true;

        if (!appUser && !validAccessTokenProvided) {
          // seems like the request has no (valid) auth token
          // let us try to set at least the very basic reresh user from the refresh token
          appUser = appUserInRefreshToken;
          logger.info(
            "Auth token potentially invalid. But refresh token valid."
          );
        }
      } else {
        logger.warn("Refresh token invalid in context (1)");
      }
    } catch (Err) {
      logger.warn("Refresh token invalid in context (2)");
    }
  }

  if (accessTokenProvided || refreshTokenProvided)
    logger.debug(
      `Context: resolved ApiUser ID(${appUser?.id}) AT: ${accessTokenProvided} RT: ${refreshTokenProvided}`
    );

  return {
    req,
    res,
    queryStartsWith,
    appUser,
    tokenInfo: {
      accessTokenProvided,
      refreshTokenProvided,
      validAccessTokenProvided,
      validRefreshTokenProvided,
    },
  };
};

export default context;
