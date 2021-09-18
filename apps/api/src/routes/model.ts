import { Request, Response } from "express";
import httpStatus from "http-status";
import path from "path";
import multer from "multer";
import { mkdirSync } from "fs";
import { nanoid } from "nanoid";
import type { ApiArModelMetaInformation } from "../types";

import { logger } from "../services/serviceLogging";
import { arModelCreate } from "../services/serviceArModel";

import { getApiConfig } from "../config";
import { ApiError } from "../utils";

const apiConfig = getApiConfig();

const storage = multer.diskStorage({
  destination: async (_req: Request, _file, cb) => {
    const date = new Date();

    const uploadFolder = `${
      apiConfig.modelUploadDir
    }/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}`;
    const uploadPath = `${apiConfig.baseDir}/${apiConfig.publicDir}/${uploadFolder}`;

    try {
      // TODO: how to make this non blocking?
      mkdirSync(uploadPath, { recursive: true });
    } catch (e) {
      logger.error(e);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "[arModel] upload failed #1"
      );
    }

    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${nanoid()}${extension}`);
  },
});

export const arModelUpload = multer({
  storage,
  limits: {
    files: 1,
    fileSize: 51200000,
  },
});

const createArModelMetaInfo = (
  file: Express.Multer.File
): {
  fileNanoId: string;
  metainfo: ApiArModelMetaInformation;
} => {
  const extension = path.extname(file.originalname);

  const uploadFolder = file.destination.replace(
    `${apiConfig.baseDir}/${apiConfig.publicDir}`,
    ""
  );

  const fileNanoId = file.filename.replace(extension, "");

  // TODO: what to do about the image type?
  const metainfo: ApiArModelMetaInformation = {
    uploadFolder,
    originalFileName: file.filename,
    originalFileUrl: `${apiConfig.baseUrl.api}${uploadFolder}/${file.filename}`,
    originalFilePath: file.path,
    mimeType: file.mimetype,
    size: file.size,
  };

  return { fileNanoId, metainfo };
};

export const postArModel = async (req: Request, res: Response) => {
  // TODO: access protection
  // TODO: howto trigger refresh?
  // Maybe autosend auth token
  // Userland fix attempt for https://github.com/expressjs/multer/pull/971
  req.socket.on("error", (error) => {
    logger.warn(error);
    req.emit("end");
  });

  try {
    if (req.body.ownerId && !Number.isNaN(req.body.ownerId)) {
      if (req.file) {
        const { fileNanoId, metainfo } = createArModelMetaInfo(req.file);

        let connectWith;
        try {
          connectWith = req?.body?.connectWith
            ? JSON.parse(req?.body?.connectWith)
            : {};
        } catch (err) {
          // nothing to be done ...
        }

        const model = await arModelCreate(
          parseInt(req.body.ownerId, 10),
          fileNanoId,
          metainfo,
          req.body.type,
          connectWith
        );

        res.json(model);
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, "ArModel upload failed #1");
      }
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "ArModel upload failed #2");
    }
  } catch (err) {
    logger.error(err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "ArModel upload failed #3"
    );
  }
};

export default postArModel;
