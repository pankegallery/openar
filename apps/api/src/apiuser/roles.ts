import { PartialRecord } from "../types";

export type RoleName =
  | "administrator"
  | "artist"
  | "collector"
  | "curator"
  | "critic"
  | "user"
  | "newuser"
  | "refresh"
  | "api"
  | "test";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfAdministrator =
  | "userRead"
  | "userUpdate"
  | "userDelete";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfUser =
  | "artworkUpdateOwn"
  | "artworkDeleteOwn"
  | "collectionSellOwn"
  | "collectionUpdateOwn"
  | "critiqueUpdateOwn"
  | "critiqueDeleteOwn"
  | "critiqueCreate"
  | "exhibitionCreate"
  | "artworkCreate"
  | "artworkReadOwn"
  | "collectionReadOwn"
  | "exhibitionReadOwn"
  | "critiqueReadOwn"
  | "exhibitionUpdateOwn"
  | "exhibitionDeleteOwn";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfNewUser =
  | "accessAsAuthenticatedUser"
  | "profileRead"
  | "profileUpdate";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfRefresh = "canRefreshAccessToken";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfApi = "canConfirmToken";

export type PermissionName =
  | PermissionsOfAdministrator
  | PermissionsOfUser
  | PermissionsOfNewUser
  | PermissionsOfRefresh
  | PermissionsOfApi;

export interface Role {
  name: RoleName;
  permissions: PermissionName[];
  extends: RoleName[];
}

export interface ApiRolesAndPermissions {
  roles: PartialRecord<RoleName, Role>;
  add: (
    name: RoleName,
    permissions?: PermissionName | PermissionName[]
  ) => void;
  addPermissions: (
    roleName: RoleName,
    permissions?: PermissionName | PermissionName[]
  ) => void;
  getOwnPermissions: (roleName: RoleName) => PermissionName[];
  getCombinedPermissions: (roles: RoleName[]) => PermissionName[];
}

export const apiRolesAndPermissions: ApiRolesAndPermissions = {
  roles: {},
  add(name: RoleName, permissions?: PermissionName | PermissionName[]) {
    if (!(name in this.roles)) {
      this.roles[name] = {
        name,
        permissions: [],
        extends: [],
      };
      this.addPermissions(name, permissions);
    }
  },
  addPermissions(
    roleName: RoleName,
    permissions?: PermissionName | PermissionName[]
  ) {
    if (roleName in this.roles) {
      (Array.isArray(permissions)
        ? permissions
        : ([permissions] as PermissionName[])
      ).forEach((perm) => {
        if (!(perm in (this.roles[roleName] as Role).permissions))
          (this.roles[roleName] as Role).permissions.push(perm);
      });
    }
  },
  getOwnPermissions(roleName: RoleName): PermissionName[] {
    if (roleName in this.roles) {
      return Array.from(
        // using Array.from(new Set(...)) to filter duplicates out
        new Set((this.roles[roleName] as Role).permissions.values())
      );
    }
    return [];
  },
  getCombinedPermissions(roles: RoleName[]): PermissionName[] {
    return roles.reduce((permissions, roleName) => {
      if (!(roleName in this.roles)) return permissions;

      return [...permissions, ...this.getOwnPermissions(roleName)];
    }, [] as PermissionName[]);
  },
};

apiRolesAndPermissions.add("api", ["canConfirmToken"]);
apiRolesAndPermissions.add("refresh", ["canRefreshAccessToken"]);
apiRolesAndPermissions.add("artist", []);
apiRolesAndPermissions.add("collector", []);
apiRolesAndPermissions.add("curator", []);
apiRolesAndPermissions.add("critic", []);

apiRolesAndPermissions.add("user", [
  "artworkUpdateOwn",
  "artworkDeleteOwn",
  "exhibitionUpdateOwn",
  "exhibitionDeleteOwn",
  "critiqueUpdateOwn",
  "critiqueDeleteOwn",
  "critiqueCreate",
  "exhibitionCreate",
  "artworkCreate",
  "artworkReadOwn",
  "critiqueReadOwn",
  "exhibitionReadOwn",
]);

apiRolesAndPermissions.add("newuser", [
  "accessAsAuthenticatedUser",
  "profileRead",
  "profileUpdate",
]);

apiRolesAndPermissions.add("administrator", [
  "userRead",
  "userUpdate",
  "userDelete",
]);
export default apiRolesAndPermissions;
