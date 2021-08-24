import { parentPort } from "worker_threads";

// !!!! Attention main thread also has to import "sharp" to ensure that the C libraries are always available
import sharp from "sharp";

// !!!! ALWAY REMEMBER TO CLOSE YOU DB CONNECTION !!!
import Prisma from "@prisma/client";
import type { ApiImageMetaInformation, ApiImageSizeInfo } from "../types";
import { ImageStatusEnum } from "../utils";

import type { ApiConfigImageFormat } from "../config";

import { getApiConfig } from "../config";

const apiConfig = getApiConfig();
// https://github.com/breejs/bree#long-running-jobs
// Or use https://threads.js.org/usage for a queing experience .. .
// if (parentPort)
//   parentPort.once("message", (message) => {
//     //
//     // TODO: once we can manipulate concurrency option to p-map
//     // we could make it `Number.MAX_VALUE` here to speed cancellation up
//     // <https://github.com/sindresorhus/p-map/issues/28>
//     //
//     if (message === "cancel") isCancelled = true;
//   });

const postMessage = (msg: string) => {
  if (parentPort) parentPort.postMessage(msg);
  // eslint-disable-next-line no-console
  else console.log(msg);
};

const createImageSizeWebP = async (
  size: ApiConfigImageFormat,
  nanoid: string,
  imageMeta: any
): Promise<ApiImageSizeInfo> =>
  new Promise((resolve, reject) => {
    const newImgFileName = `${nanoid}-${size.width}-${size.height}.webp`;
    const newImgUrl = `${apiConfig.baseUrl.api}/${imageMeta.uploadFolder}/${newImgFileName}`;
    const newImgPath =
      `${apiConfig.baseDir}/${apiConfig.publicDir}/${imageMeta.uploadFolder}/${newImgFileName}`.replace(
        /\/\//g,
        "/"
      );

    sharp(imageMeta.originalFilePath)
      .resize(size.width, size.height, {
        fit: size.crop ? sharp.fit.cover : sharp.fit.inside,
      })
      .toFile(newImgPath)
      .then((resizedImageMeta) => {
        resolve({
          width: resizedImageMeta.width,
          height: resizedImageMeta.height,
          url: newImgUrl,
          isJpg: false,
          isWebP: true,
        });
      })
      .catch((Err) => {
        postMessage(JSON.stringify(Err));
        reject(Err);
      });
  });

const createImageSizeJpg = async (
  size: ApiConfigImageFormat,
  nanoid: string,
  imageMeta: any
): Promise<ApiImageSizeInfo> =>
  new Promise((resolve, reject) => {
    const newImgFileName = `${nanoid}-${size.width}-${size.height}.jpg`;
    const newImgUrl = `${apiConfig.baseUrl.api}/${imageMeta.uploadFolder}/${newImgFileName}`;
    const newImgPath = `${apiConfig.baseDir}/${apiConfig.publicDir}/${imageMeta.uploadFolder}/${newImgFileName}`;

    sharp(imageMeta.originalFilePath)
      .resize(size.width, size.height, {
        fit: size.crop ? sharp.fit.cover : sharp.fit.inside,
      })
      .jpeg({
        mozjpeg: true,
      })
      .toFile(newImgPath)
      .then((resizedImageMeta) => {
        resolve({
          width: resizedImageMeta.width,
          height: resizedImageMeta.height,
          url: newImgUrl,
          isJpg: true,
          isWebP: false,
        });
      })
      .catch((Err) => {
        postMessage(JSON.stringify(Err));
        reject(Err);
      });
  });

const doChores = async () => {
  // !!!! ALWAY REMEMBER TO CLOSE YOU DB CONNECTION !!!
  postMessage("Creating prisma client");
  const { PrismaClient } = Prisma;
  const prisma = new PrismaClient({
    // TODO: how to ensuere how many connections are allowe??? Should only be one for this one...
    datasources: {
      db: {
        url: apiConfig.db.url,
      },
    },
  });

  try {
    let count = 0;
    const images = await prisma.image.findMany({
      where: {
        status: ImageStatusEnum.UPLOADED,
      },
      take: 10,
      select: {
        id: true,
        meta: true,
        nanoid: true,
      },
    });

    if (images && images.length > 0) {
      const ids = images.map((image) => image.id);
      postMessage(`Found ${images.length} to process`);
      await prisma.image.updateMany({
        data: {
          status: ImageStatusEnum.PROCESSING,
        },
        where: {
          id: {
            in: ids,
          },
        },
      });
      await Promise.all(
        images.map(async (image) => {
          if (!image.meta) throw Error("Faulty meta data (no meta)");

          const meta = image.meta as ApiImageMetaInformation;

          if (!meta.originalFilePath)
            throw Error("Faulty meta data (no originalFileName)");

          const originalImageMetaData = await sharp(
            meta.originalFilePath
          ).metadata();

          if (!originalImageMetaData)
            throw Error("Original image meta data read error");

          const processedSizesMetaInfo = await Promise.all(
            apiConfig.imageFormats[meta.imageType].reduce(
              (
                acc: Promise<ApiImageSizeInfo>[],
                size: ApiConfigImageFormat
              ) => {
                if (
                  size.width > (originalImageMetaData?.width ?? 0) &&
                  size.height > (originalImageMetaData?.height ?? 0)
                )
                  return acc;

                if (size.asJpg)
                  acc.push(createImageSizeJpg(size, image.nanoid, meta));

                if (size.asWebP)
                  acc.push(createImageSizeWebP(size, image.nanoid, meta));

                return acc;
              },
              [] as Promise<ApiImageSizeInfo>[]
            )
          );

          const newMeta = {
            ...meta,
            availableSizes: {
              original: {
                width: originalImageMetaData.width ?? 0,
                height: originalImageMetaData.height ?? 0,
                url: meta.originalFileUrl,
                isJpg:
                  originalImageMetaData.format === "jpeg" ||
                  originalImageMetaData.format === "jpg",
                isWebP: originalImageMetaData.format === "webp",
              },
              ...processedSizesMetaInfo.reduce(
                (acc: object, sizeMetaInfo: ApiImageSizeInfo) => ({
                  ...acc,
                  [`${sizeMetaInfo.width}-${sizeMetaInfo.height}-${
                    sizeMetaInfo.isWebP ? "webp" : "jpg"
                  }`]: sizeMetaInfo,
                }),
                {}
              ),
            },
          };

          try {
            await prisma.image.update({
              data: {
                meta: newMeta,
                status: ImageStatusEnum.READY,
              },
              where: {
                id: image.id,
              },
            });
          } catch (dbError) {
            postMessage(JSON.stringify(dbError));
          }

          count += 1;
        })
      );
    }

    await prisma.$disconnect();
    postMessage(`[WORKER:DbConvertImages]: Processed ${count} images`);
  } catch (Err) {
    if (prisma) await prisma.$disconnect();
    postMessage(
      `[WORKER:DbConvertImages]: Failed to run worker. ${Err.name} ${Err.message}`
    );
  }
};

const main = async () => {
  await doChores();
};

main()
  .then(async () => {
    if (parentPort) postMessage("done");
    else process.exit(0);
  })
  .catch((Err) => {
    postMessage(JSON.stringify(Err));
    process.exit(1);
  });
