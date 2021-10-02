import type { NexusResolverContext } from "../context";

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
