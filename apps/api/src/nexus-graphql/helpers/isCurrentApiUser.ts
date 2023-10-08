import type { NexusResolverContext } from "../context";
import { logger } from "../../services/serviceLogging"

// Important: Don't change the strings of the thrown exceptions here, because they are 
// used for string matching in the frontend in order to determine whether the token
// needs to be refreshed...

export const isCurrentApiUser = (ctx: NexusResolverContext, userId: number) => {
  if (
    !ctx.tokenInfo.validAccessTokenProvided &&
    ctx.tokenInfo.validRefreshTokenProvided
  )
    return Error("Authentication failed (maybe refresh)");

  if (!(ctx.appUser && ctx.appUser.id === userId))
    throw Error("GQL authorization rejected");

  return true;
};

export const isCurrentApiUserByEthAddress = (
  ctx: NexusResolverContext,
  ethAddress: string
) => {
  if (
    !ctx.tokenInfo.validAccessTokenProvided &&
    ctx.tokenInfo.validRefreshTokenProvided
  )
    return Error("Authentication failed (maybe refresh)");

  if (
    !(
      ctx.appUser &&
      ctx.appUser.ethAddress.toLowerCase() === ethAddress.toLowerCase()
    )
  )
    throw Error("GQL authorization rejected");

  return true;
};

export default isCurrentApiUser;
