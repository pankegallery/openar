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
export type PermissionsOfArtist = "artworkUpdateOwn" | "artworkDeleteOwn";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfCollector =
  | "collectionSellOwn"
  | "collectionUpdateOwn";

export type PermissionsOfCurator =
  | "exhibitionUpdateOwn"
  | "exhibitionDeleteOwn";

export type PermissionsOfCritic = "critiqueUpdateOwn" | "critiqueDeleteOwn";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfUser =
  | "critiqueCreate"
  | "exhibitionCreate"
  | "artworkCreate"
  | "artworkReadOwn"
  | "collectionReadOwn"
  | "exhibitionReadOwn"
  | "critiqueReadOwn";

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
  | PermissionsOfCritic
  | PermissionsOfCurator
  | PermissionsOfCollector
  | PermissionsOfArtist
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

apiRolesAndPermissions.add("artist", ["artworkUpdateOwn", "artworkDeleteOwn"]);

apiRolesAndPermissions.add("collector", [
  "accessAsAuthenticatedUser",
  "profileRead",
  "profileUpdate",
]);

apiRolesAndPermissions.add("curator", [
  "exhibitionUpdateOwn",
  "exhibitionDeleteOwn",
]);

apiRolesAndPermissions.add("critic", [
  "critiqueUpdateOwn",
  "critiqueDeleteOwn",
]);

apiRolesAndPermissions.add("user", [
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
