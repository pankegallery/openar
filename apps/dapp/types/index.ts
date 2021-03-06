import { PlatformCuts, Decimal } from "@openar/crypto";
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

export interface AppMenuItem {
  slug: string;
  label: string;
  url: string;
  target?: string;
  rel?: string;
}

export type AppConfigSettings = {
  apiUrl?: string | undefined;
  restrictedAccessRedirectUrl?: string | undefined;
  apiDomain?: string | undefined;
  baseUrl?: string | undefined;
  apiGraphQLUrl?: string | undefined;
  subgraphGraphQLUrl?: string | undefined;
  contactEmail?: string | undefined;
  infuraApiKey?: string | undefined;
  ankrXDaiRPCURL?: string | undefined;
  reauthenticateRedirectUrl?: string | undefined;
  defaultPageSize?: number;
  chainId?: number;
  numBlockConfirmations?: number;
  platformCuts: PlatformCuts;
  mainMenu: AppMenuItem[];
  secondaryMenu: AppMenuItem[];
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

export type ApiArModelMetaInformation = {
  uploadFolder: string;
  originalFileName: string;
  originalFileUrl: string;
  originalFilePath: string;
  mimeType: any;
  size: number;
};

export interface ModuleAccessRules {
  userIs?: RoleName | RoleName[] | undefined;
  userCan?: PermissionName | PermissionName[] | undefined;
}

interface ModelViewerJSX {
  src: string;
}
