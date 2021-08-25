import { Image, Prisma } from "@prisma/client";
import {
  filteredOutputByBlacklist,
  ImageStatusEnum,
  filteredOutputByBlacklistOrNotFound,
} from "../utils";

import { getApiConfig } from "../config";

import { getPrismaClient } from "../db/client";

const apiConfig = getApiConfig();
const prisma = getPrismaClient();

export const daoImageTranslatedColumns = ["alt", "credits"];

export const daoImageQuery = async (
  where: Prisma.ImageWhereInput,
  orderBy: Prisma.ImageOrderByInput | Prisma.ImageOrderByInput[],
  pageIndex: number = 0,
  pageSize: number = apiConfig.db.defaultPageSize
): Promise<Image[]> => {
  const images: Image[] = await prisma.image.findMany({
    where,
    orderBy,
    skip: pageIndex * pageSize,
    take: Math.min(pageSize, apiConfig.db.maxPageSize),
  });

  return filteredOutputByBlacklist(
    images,
    apiConfig.db.privateJSONDataKeys.image
  );
};

export const daoImageQueryCount = async (
  where: Prisma.ImageWhereInput
): Promise<number> => {
  return prisma.image.count({
    where,
  });
};

export const daoImageGetById = async (id: number): Promise<Image> => {
  const image: Image | null = await prisma.image.findUnique({
    where: { id },
  });

  return filteredOutputByBlacklistOrNotFound(
    image,
    apiConfig.db.privateJSONDataKeys.image
  );
};

export const daoImageGetStatusById = async (id: number): Promise<Image> => {
  const image = await prisma.image.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      meta: true,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    image,
    apiConfig.db.privateJSONDataKeys.image
  );
};

export const daoImageCreate = async (
  data: Prisma.ImageCreateInput
): Promise<Image> => {
  const image: Image = await prisma.image.create({
    data,
  });

  return filteredOutputByBlacklistOrNotFound(
    image,
    apiConfig.db.privateJSONDataKeys.image
  );
};

export const daoImageUpdate = async (
  id: number,
  data: Prisma.ImageUpdateInput
): Promise<Image> => {
  const image: Image = await prisma.image.update({
    data,
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    image,
    apiConfig.db.privateJSONDataKeys.image
  );
};

export const daoImageDelete = async (id: number): Promise<Image> => {
  const image: Image = await prisma.image.delete({
    where: {
      id,
    },
  });

  // TODO: schedule task to wipe file off the disk
  return filteredOutputByBlacklistOrNotFound(
    image,
    apiConfig.db.privateJSONDataKeys.image
  );
};

export const daoImageSetToDelete = async (id: number): Promise<Image> => {
  const image: Image = await prisma.image.update({
    data: {
      status: ImageStatusEnum.DELETED,
      // does it need to be extended for reviews and tours?
      artworks: {
        set: [],
      },
      arObjects: {
        set: [],
      },
      profileImageUsers: {
        set: [],
      },
      heroImageArtworks: {
        set: [],
      },
      heroImageArObjects: {
        set: [],
      },
    },
    where: {
      id,
    },
  });

  // TODO: schedule task to wipe file off the disk
  return filteredOutputByBlacklistOrNotFound(
    image,
    apiConfig.db.privateJSONDataKeys.image
  );
};

export default {
  daoImageQuery,
  daoImageQueryCount,
  daoImageGetById,
  daoImageCreate,
  daoImageUpdate,
  daoImageDelete,
  daoImageSetToDelete,
  daoImageGetStatusById,
  daoImageTranslatedColumns,
};
