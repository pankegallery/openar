import { PartialRecord } from "../types";

export type RoleName =
  | "administrator"
  | "editor"
  | "contributor"
  | "user"
  | "refresh"
  | "api"
  | "test";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfAdministrator =
  | "userCreate"
  | "userRead"
  | "userUpdate"
  | "userDelete"
  | "settingRead"
  | "settingUpdate";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfEditor =
  | "locationRead"
  | "locationCreate"
  | "locationUpdate"
  | "locationDelete"
  | "eventRead"
  | "eventCreate"
  | "eventUpdate"
  | "eventDelete"
  | "tourRead"
  | "tourCreate"
  | "tourUpdate"
  | "tourDelete"
  | "pageRead"
  | "pageCreate"
  | "pageUpdate"
  | "pageDelete"
  | "taxCreate"
  | "taxRead"
  | "taxUpdate"
  | "taxDelete"
  | "imageDelete";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfContributor =
  | "locationRead"
  | "locationCreate"
  | "locationUpdate"
  | "locationDeleteOwn"
  | "eventRead"
  | "eventCreate"
  | "eventUpdate"
  | "eventDeleteOwn"
  | "tourRead"
  | "tourCreate"
  | "tourUpdate"
  | "tourDeleteOwn"
  | "imageRead"
  | "imageUpdate"
  | "imageCreate"
  | "imageDeleteOwn"
  | "pageRead"
  | "pageCreate"
  | "pageUpdate"
  | "pageDeleteOwn";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfUser =
  | "accessAsAuthenticatedUser"
  | "profileRead"
  | "profileUpdate";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfRefresh = "canRefreshAccessToken";

// !!! Also add new permissions to the constructing arrays on the bottom
export type PermissionsOfApi = "canConfirmToken";

export type PermissionNames =
  | PermissionsOfAdministrator
  | PermissionsOfEditor
  | PermissionsOfContributor
  | PermissionsOfUser
  | PermissionsOfRefresh
  | PermissionsOfApi;

export interface Role {
  name: RoleName;
  permissions: PermissionNames[];
  extends: RoleName[];
}

export interface ApiRolesAndPermissions {
  roles: PartialRecord<RoleName, Role>;
  add: (
    name: RoleName,
    permissions?: PermissionNames | PermissionNames[]
  ) => void;
  addPermissions: (
    roleName: RoleName,
    permissions?: PermissionNames | PermissionNames[]
  ) => void;
  getOwnPermissions: (roleName: RoleName) => PermissionNames[];
  getCombinedPermissions: (roles: RoleName[]) => PermissionNames[];
}

export const apiRolesAndPermissions: ApiRolesAndPermissions = {
  roles: {},
  add(name: RoleName, permissions?: PermissionNames | PermissionNames[]) {
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
    permissions?: PermissionNames | PermissionNames[]
  ) {
    if (roleName in this.roles) {
      (Array.isArray(permissions)
        ? permissions
        : ([permissions] as PermissionNames[])
      ).forEach((perm) => {
        if (!(perm in (this.roles[roleName] as Role).permissions))
          (this.roles[roleName] as Role).permissions.push(perm);
      });
    }
  },
  getOwnPermissions(roleName: RoleName): PermissionNames[] {
    if (roleName in this.roles) {
      return Array.from(
        // using Array.from(new Set(...)) to filter duplicates out
        new Set((this.roles[roleName] as Role).permissions.values())
      );
    }
    return [];
  },
  getCombinedPermissions(roles: RoleName[]): PermissionNames[] {

    return roles.reduce((permissions, roleName) => {
      if (!(roleName in this.roles))
        return permissions;

      return [...permissions, ...this.getOwnPermissions(roleName)];

    }, [] as PermissionNames[]);
  },
};

apiRolesAndPermissions.add("api", ["canConfirmToken"]);
apiRolesAndPermissions.add("refresh", ["canRefreshAccessToken"]);

apiRolesAndPermissions.add("user", [
  "accessAsAuthenticatedUser",
  "profileRead",
  "profileUpdate",
]);

// TODO: extend roles 
apiRolesAndPermissions.add("contributor", [
  "locationRead",
  "locationCreate",
  "locationUpdate",
  "locationDeleteOwn",
  "eventRead",
  "eventCreate",
  "eventUpdate",
  "eventDeleteOwn",
  "tourRead",
  "tourCreate",
  "tourUpdate",
  "tourDeleteOwn",
  "pageRead",
  "pageCreate",
  "pageUpdate",
  "pageDeleteOwn",
]);


apiRolesAndPermissions.add("editor", [
  "locationRead",
  "locationCreate",
  "locationUpdate",
  "locationDelete",
  "eventRead",
  "eventCreate",
  "eventUpdate",
  "eventDelete",
  "tourRead",
  "tourCreate",
  "tourUpdate",
  "tourDelete",
  "pageRead",
  "pageCreate",
  "pageUpdate",
  "pageDelete",
  "taxCreate",
  "taxRead",
  "taxUpdate",
  "taxDelete",
]);

apiRolesAndPermissions.add("administrator", [
  "userCreate",
  "userRead",
  "userUpdate",
  "userDelete",
  "settingRead",
  "settingUpdate",
]);
export default apiRolesAndPermissions;
