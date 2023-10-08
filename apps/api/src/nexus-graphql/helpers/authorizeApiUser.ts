import type { PermissionName } from "../../apiuser";
import type { NexusResolverContext } from "../context";

// Important: Don't change the strings of the thrown exceptions here, because they are 
// used for string matching in the frontend in order to determine whether the token
// needs to be refreshed...

export const authorizeApiUser = (
  ctx: NexusResolverContext,
  permissions: PermissionName | PermissionName[],
  doingRefresh = false
) => {
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
  ) {    
    throw Error("GQL authorization rejected");    
  }
    

  return true;
};

export default authorizeApiUser;
