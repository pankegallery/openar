import type { PermissionName } from "../../apiuser";
import type { NexusResolverContext } from "../context";

export const authorizeApiUser = (
  ctx: NexusResolverContext,
  permissions: PermissionName | PermissionName[],
  doingRefresh = false
) => {
  if (doingRefresh && !ctx.tokenInfo.validRefreshTokenProvided)
    throw Error("GQL authorization rejected 1");

  if (
    !doingRefresh &&
    !ctx.tokenInfo.validAccessTokenProvided &&
    ctx.tokenInfo.validRefreshTokenProvided
  )
    return Error("Authentication failed (maybe refresh) 3");

  if (!ctx.appUser) throw Error("GQL authorization rejected 2");

  if (
    !(typeof ctx?.appUser?.can === "function" && ctx.appUser.can(permissions))
  ) {    
    throw Error("GQL authorization rejected 3");    
  }
    

  return true;
};

export default authorizeApiUser;
