import { Request, Response } from "express";
import httpStatus from "http-status";
import path from "path";
import multer from "multer";
import { mkdirSync } from "fs";
import { nanoid } from "nanoid";
import type { ApiImageMetaInformation } from "../types";

import { logger } from "../services/serviceLogging";
import { imageCreate } from "../services/serviceImage";

import { getApiConfig } from "../config";
import { ApiError } from "../utils";

const apiConfig = getApiConfig();

const storage = multer.diskStorage({
  destination: async (req: Request, file, cb) => {
    const date = new Date();

    const uploadFolder = `${apiConfig.imgUploadDir}/${date.getUTCFullYear()}/${
      date.getUTCMonth() + 1
    }`;
    const uploadPath = `${apiConfig.baseDir}/${apiConfig.publicDir}/${uploadFolder}`;

    try {
      // TODO: how to make this non blocking?
      mkdirSync(uploadPath, { recursive: true });
    } catch (e) {
      logger.error(e);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "[image] upload failed #1"
      );
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${nanoid()}${extension}`);
  },
});

export const postImageUpload = multer({ storage });

const createImageMetaInfo = (
  file: Express.Multer.File
): {
  fileNanoId: string;
  metainfo: ApiImageMetaInformation;
} => {
  const extension = path.extname(file.originalname);

  const uploadFolder = file.destination.replace(
    `${apiConfig.baseDir}/${apiConfig.publicDir}`,
    ""
  );

  const fileNanoId = file.filename.replace(extension, "");

  // TODO: what to do about the image type?
  const metainfo: ApiImageMetaInformation = {
    uploadFolder,
    originalFileName: file.originalname,
    originalFileUrl: `${apiConfig.baseUrl.api}${uploadFolder}/${file.filename}`,
    originalFilePath: file.path,
    mimeType: file.mimetype,
    imageType: "square",
    size: file.size,
  };

  return { fileNanoId, metainfo };
};

export const postImage = async (req: Request, res: Response) => {
  // TODO: access protection
  // TODO: howto trigger refresh?
  // Maybe autosend auth token

  try {
    if (req.body.ownerId && !Number.isNaN(req.body.ownerId)) {
      if (req.file) {
        const { fileNanoId, metainfo } = createImageMetaInfo(req.file);

        let connectWith;
        try {
          connectWith = req?.body?.connectWith
            ? JSON.parse(req?.body?.connectWith)
            : {};
        } catch (err) {
          // nothing to be done ...
        }

        const image = await imageCreate(
          parseInt(req.body.ownerId, 10),
          fileNanoId,
          metainfo,
          "image",
          connectWith
        );

        res.json(image);
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, "Image upload failed #1");
      }
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Image upload failed #2");
    }
  } catch (err) {
    logger.error(err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Image upload failed #3"
    );
  }
};

export const postProfileImage = async (req: Request, res: Response) => {
  // TODO: access protection
  // TODO: howto trigger refresh?
  // Maybe autosend auth token

  try {
    if (req.body.ownerId && !Number.isNaN(req.body.ownerId)) {
      if (req.file) {
        const { fileNanoId, metainfo } = createImageMetaInfo(req.file);

        const image = await imageCreate(
          parseInt(req.body.ownerId, 10),
          fileNanoId,
          metainfo,
          "profile"
        );

        res.json(image);
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Profile image upload failed #1"
        );
      }
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Profile image upload failed #2"
      );
    }
  } catch (err) {
    logger.error(err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Profile image upload failed #3"
    );
  }
};

export default postImage;
