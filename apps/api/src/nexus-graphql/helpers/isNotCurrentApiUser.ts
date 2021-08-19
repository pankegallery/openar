import type { NexusResolverContext } from "../context";

export const isNotCurrentApiUser = (
  ctx: NexusResolverContext,
  userId: number
) => {
  if (
    !ctx.tokenInfo.validAccessTokenProvided &&
    ctx.tokenInfo.validRefreshTokenProvided
  )
    return Error("Authentication failed (maybe refresh)");

  if (!ctx.apiUser || ctx.apiUser.id === userId)
    throw Error("GQL authorization rejected");

  return true;
};

export default isNotCurrentApiUser;
