import { Image } from "@prisma/client";
import httpStatus from "http-status";
import { mkdir } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import type { ApiImageMetaInformation } from "../types";
import { ImageStatusEnum, ApiError } from "../utils";
import { getApiConfig } from "../config";

import { daoImageCreate } from "../dao";
import { logger } from "./serviceLogging";

const apiConfig = getApiConfig();

export const imageGetUploadInfo = async (): Promise<{
  path: string;
  uuid: string;
  baseUrl: string;
  uploadFolder: string;
}> => {
  const date = new Date();

  const uploadFolder = `${apiConfig.uploadDir}/${date.getUTCFullYear()}/${
    date.getUTCMonth() + 1
  }`;
  const path =
    `${apiConfig.baseDir}/${apiConfig.publicDir}/${uploadFolder}`.replace(
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
      "[image] upload failed #1"
    );
  }

  return { path, uuid: uuidv4(), baseUrl, uploadFolder };
};

export const imageCreate = async (
  ownerId: number,
  imageUuid: string,
  meta: ApiImageMetaInformation,
  type: "image" | "profile" = "image",
  connectWith?: any
): Promise<Image> => {
  const image: Image = await daoImageCreate({
    owner: {
      connect: {
        id: ownerId,
      },
    },

    uuid: imageUuid,
    meta,
    type,
    status: ImageStatusEnum.UPLOADED,
    ...connectWith,
    ...(type === "profile"
      ? {
          profileImageUsers: {
            connect: {
              id: ownerId,
            },
          },
        }
      : {}),
  });

  if (!image)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "New profile image could not be created"
    );

  // TODO: xxx schedule resizing tasks.

  return image;
};

export default {
  imageGetUploadInfo,
  imageCreate,
  // imageUpdate,
  // imageRead,
};
