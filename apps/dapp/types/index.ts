import type { RoleName, PermissionName } from "~/appuser/roles";

export type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined;
};

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type MutationProgressInfo = {
  total: number;
  loaded: number;
  percent: string;
};

export type AppConfigSettings = {
  apiUrl?: string | undefined;
  apiDomain?: string | undefined;
  apiGraphQLUrl?: string | undefined;
  contactEmail?: string | undefined;
  infuraApiKey?: string | undefined;
  ankrXDaiRPCURL?: string | undefined;
  defaultPageSize?: number;
};

export type AppConfig = Complete<AppConfigSettings>;

export type AppScopes = "api" | "dapp";

export type ApiImageFormats = "square" | "normal";

export type ApiImageSizeInfo = {
  width: number;
  height: number;
  url: string;
  isJpg: boolean;
  isWebP: boolean;
};

export type ApiImageMetaInformation = {
  uploadFolder: string;
  originalFileName: string;
  originalFileUrl: string;
  originalFilePath: string;
  mimeType: any;
  imageType: ApiImageFormats;
  size: number;
  availableSizes?: Record<string, ApiImageSizeInfo>;
};

export interface ModuleAccessRules {
  userIs?: RoleName | RoleName[] | undefined;
  userCan?: PermissionName | PermissionName[] | undefined;
}
