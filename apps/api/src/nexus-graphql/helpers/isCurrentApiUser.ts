import type { NexusResolverContext } from "../context";
import { logger } from "../../services/serviceLogging"

export const isCurrentApiUser = (ctx: NexusResolverContext, userId: number) => {
  logger.warn("Token info ID: " + JSON.stringify(ctx.tokenInfo, null, 4))
  if (
    !ctx.tokenInfo.validAccessTokenProvided &&
    ctx.tokenInfo.validRefreshTokenProvided
  )
    return Error("Authentication failed (maybe refresh) 1");

  if (!(ctx.appUser && ctx.appUser.id === userId))
    throw Error("GQL authorization rejected 4");

  return true;
};

export const isCurrentApiUserByEthAddress = (
  ctx: NexusResolverContext,
  ethAddress: string
) => {
  logger.warn("Token info ETH: " + JSON.stringify(ctx.tokenInfo, null, 4))
  if (
    !ctx.tokenInfo.validAccessTokenProvided &&
    ctx.tokenInfo.validRefreshTokenProvided
  )
    return Error("Authentication failed (maybe refresh) 2");

  if (
    !(
      ctx.appUser &&
      ctx.appUser.ethAddress.toLowerCase() === ethAddress.toLowerCase()
    )
  )
    throw Error("GQL authorization rejected 5");

  return true;
};

export default isCurrentApiUser;
