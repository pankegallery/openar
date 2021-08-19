import type { RoleName, PermissionNames } from "./roles";

export interface AuthenticatedApiUserFunctions {
  is(name: RoleName): boolean;
  has(names: RoleName | RoleName[]): boolean;
  can(permissions: PermissionNames | PermissionNames[]): boolean;
}

export interface AuthenticatedApiUserData {
  id: number;
  role: RoleName;
  roles: RoleName[];
  permissions: PermissionNames[];
  pseudonym: string;
  ethAddress: string;
  ens?: string;
}

export interface AuthenticatedApiUser
  extends AuthenticatedApiUserData,
    AuthenticatedApiUserFunctions {}

export interface JwtPayloadAuthenticatedApiUser {
  id: number;
  pseudonym?: string | null;
  email?: string | null;
  ethAddress?: string | null;
  role?: string;
  roles?: RoleName[];
  permissions?: PermissionNames[];
}

const is = (role: RoleName, name: RoleName): boolean => name === role;

const has = (roles: RoleName[], names: RoleName | RoleName[]): boolean =>
  (Array.isArray(names) ? names : [names]).some((name) => roles.includes(name));

const can = (
  permissions: PermissionNames[],
  perms: PermissionNames | PermissionNames[]
): boolean =>
  (Array.isArray(perms) ? perms : [perms]).some((perm) =>
    permissions.includes(perm)
  );

export const createAuthenticatedApiUser = (
  id: number,
  role: RoleName,
  roles: RoleName[],
  permissions: PermissionNames[],
  pseudonym: string, 
  ethAddress: string,
): AuthenticatedApiUser => {
  const user: AuthenticatedApiUser = {
    id,
    role,
    roles,
    permissions,
    pseudonym,
    ethAddress,
    is(name: RoleName) {
      return is(this.role, name);
    },
    has(names: RoleName | RoleName[]) {
      return has(this.roles, names);
    },
    can(perms: PermissionNames | PermissionNames[]) {
      return can(this.permissions, perms);
    },
  };

  return user;
};
