import { ArModel } from "@prisma/client";
import httpStatus from "http-status";
import { mkdir } from "fs/promises";
import { nanoid } from "nanoid";
import type { ApiArModelMetaInformation, ApiArModelFormats } from "../types";
import { ArModelStatusEnum, ApiError } from "../utils";
import { getApiConfig } from "../config";

import { daoArModelCreate } from "../dao";
import { logger } from "./serviceLogging";

const apiConfig = getApiConfig();

export const arModelGetUploadInfo = async (): Promise<{
  path: string;
  nanoid: string;
  baseUrl: string;
  uploadFolder: string;
}> => {
  const date = new Date();

  const uploadFolder = `ar/${apiConfig.uploadDir}/${date.getUTCFullYear()}/${
    date.getUTCMonth() + 1
  }`;
  const path =
    `${apiConfig.baseDir}/${apiConfig.publicDir}${uploadFolder}`.replace(
      /\/\//g,
      "/"
    );
  const baseUrl = `${apiConfig.baseUrl.api}${uploadFolder}`;

  try {
    await mkdir(path, { recursive: true });
  } catch (e) {
    logger.error(e);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "[arModel] upload failed #1"
    );
  }

  return { path, nanoid: nanoid(), baseUrl, uploadFolder };
};

export const arModelCreate = async (
  ownerId: number,
  arModelNanoId: string,
  meta: ApiArModelMetaInformation,
  type: ApiArModelFormats,
  connectWith?: any
): Promise<ArModel> => {
  const arModel: ArModel = await daoArModelCreate({
    owner: {
      connect: {
        id: ownerId,
      },
    },
    type,
    nanoid: arModelNanoId,
    meta,
    status: ArModelStatusEnum.UPLOADED,
    ...connectWith,
  });

  if (!arModel)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "New profile arModel could not be created"
    );

  return arModel;
};

export default {
  arModelGetUploadInfo,
  arModelCreate,
};
