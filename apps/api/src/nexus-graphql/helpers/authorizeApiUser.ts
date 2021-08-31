import type { PermissionName } from "../../apiuser";
import type { NexusResolverContext } from "../context";

export const authorizeApiUser = (
  ctx: NexusResolverContext,
  permissions: PermissionName | PermissionName[],
  doingRefresh = false
) => {
  // // TODO: enable auth gateway
  // return true;

  if (doingRefresh && !ctx.tokenInfo.validRefreshTokenProvided)
    throw Error("GQL authorization rejected");

  if (
    !doingRefresh &&
    !ctx.tokenInfo.validAccessTokenProvided &&
    ctx.tokenInfo.validRefreshTokenProvided
  )
    return Error("Authentication failed (maybe refresh)");

  if (!ctx.appUser) throw Error("GQL authorization rejected");

  if (
    !(typeof ctx?.appUser?.can === "function" && ctx.appUser.can(permissions))
  )
    throw Error("GQL authorization rejected");

  return true;
};

export default authorizeApiUser;
