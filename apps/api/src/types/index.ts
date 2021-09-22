import "./missing/graceful";

export type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined;
};

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type AppScopes = "api" | "dapp" | "subgraph";

export type ApiImageFormats = "square" | "normal";
export type ApiArModelFormats = "glb" | "gltf" | "usdz" | "usd";

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

