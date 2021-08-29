import type { RoleName, PermissionName } from "./roles";

export interface AuthenticatedAppUserFunctions {
  has(names: RoleName | RoleName[]): boolean;
  can(permissions: PermissionName | PermissionName[]): boolean;
}

export interface AuthenticatedAppUserData {
  id: number;
  roles: RoleName[];
  permissions: PermissionName[];
  pseudonym: string;
  ethAddress: string;
  ens?: string;
}

export interface AuthenticatedAppUser
  extends AuthenticatedAppUserData,
    AuthenticatedAppUserFunctions {}

export interface JwtPayloadAuthenticatedAppUser {
  id: number;
  pseudonym?: string | null;
  email?: string | null;
  ethAddress: string;
  roles?: RoleName[];
  permissions?: PermissionName[];
}

const has = (roles: RoleName[], names: RoleName | RoleName[]): boolean =>
  (Array.isArray(names) ? names : [names]).some((name) => roles.includes(name));

const can = (
  permissions: PermissionName[],
  perms: PermissionName | PermissionName[]
): boolean =>
  (Array.isArray(perms) ? perms : [perms]).some((perm) =>
    permissions.includes(perm)
  );

export const createAuthenticatedAppUser = (
  id: number,
  roles: RoleName[],
  permissions: PermissionName[],
  pseudonym: string,
  ethAddress: string
): AuthenticatedAppUser => {
  const user: AuthenticatedAppUser = {
    id,
    roles,
    permissions,
    pseudonym,
    ethAddress,
    has(names: RoleName | RoleName[]) {
      return has(this.roles, names);
    },
    can(perms: PermissionName | PermissionName[]) {
      return can(this.permissions, perms);
    },
  };

  return user;
};
