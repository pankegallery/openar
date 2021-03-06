import { Artwork, Prisma } from "@prisma/client";
import httpStatus from "http-status";

import {
  filteredOutputByBlacklistOrNotFound,
  filteredOutputByBlacklist,
} from "../utils";

import { getPrismaClient } from "../db/client";
import { getApiConfig } from "../config";
import { ApiError, ArtworkStatusEnum } from "../utils";
import { daoArObjectDelete, daoImageSetToDelete, daoUserUpdate } from ".";

const apiConfig = getApiConfig();
const prisma = getPrismaClient();

export const daoArtworkQuery = async (
  where: Prisma.ArtworkWhereInput,
  include: Prisma.ArtworkInclude | undefined,
  orderBy: any,
  pageIndex: number = 0,
  pageSize: number = apiConfig.db.defaultPageSize
): Promise<Artwork[]> => {
  const artworks: Artwork[] = await prisma.artwork.findMany({
    where,
    include,
    orderBy,
    skip: pageIndex * pageSize,
    take: Math.min(pageSize, apiConfig.db.maxPageSize),
  });

  return filteredOutputByBlacklist(
    artworks,
    apiConfig.db.privateJSONDataKeys.artwork
  );
};

export const daoArtworkQueryFirst = async (
  where: Prisma.ArtworkWhereInput,
  include: Prisma.ArtworkInclude | undefined
): Promise<Artwork> => {
  const artwork = await prisma.artwork.findFirst({
    where,
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    artwork,
    apiConfig.db.privateJSONDataKeys.artwork
  );
};

export const daoArtworkQueryCount = async (
  where: Prisma.ArtworkWhereInput
): Promise<number> => {
  return prisma.artwork.count({
    where,
  });
};

export const daoArtworkCreate = async (
  data: Prisma.ArtworkCreateInput
): Promise<Artwork> => {
  const artwork: Artwork = await prisma.artwork.create({
    data,
  });

  return filteredOutputByBlacklistOrNotFound(
    artwork,
    apiConfig.db.privateJSONDataKeys.artwork
  );
};

export const daoArtworkGetById = async (
  id: number,
  include?: Prisma.ArtworkInclude | undefined
): Promise<Artwork> => {
  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    artwork,
    apiConfig.db.privateJSONDataKeys.artwork
  );
};

export const daoArtworkGetOwnById = async (
  id: number,
  userId: number,
  include?: Prisma.ArtworkInclude | undefined
): Promise<Artwork> => {
  const artwork = await prisma.artwork.findFirst({
    where: {
      id,
      creator: {
        id: userId,
      },
    },
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    artwork,
    apiConfig.db.privateJSONDataKeys.artwork
  );
};

export const daoArtworkGetByKey = async (
  where: Prisma.ArtworkWhereInput | undefined,
  include?: Prisma.ArtworkInclude | undefined
): Promise<Artwork> => {
  const artwork = await prisma.artwork.findFirst({
    where,
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    artwork,
    apiConfig.db.privateJSONDataKeys.artwork
  );
};

export const daoArtworkUpdate = async (
  id: number,
  data: Prisma.ArtworkUpdateInput
): Promise<Artwork> => {
  const artworkInDb = await prisma.artwork.findUnique({
    select: {
      id: true,
      status: true,
      creator: {
        select: {
          id: true,
          roles: true,
        },
      },
      arObjects: true,
    },
    where: {
      id,
    },
  });

  if (artworkInDb) {
    if (
      [
        ArtworkStatusEnum.PUBLISHED,
        ArtworkStatusEnum.HASMINTEDOBJECTS,
      ].includes((data?.status as ArtworkStatusEnum) ?? ArtworkStatusEnum.DRAFT)
    ) {
      if (
        artworkInDb.arObjects.length > 0 &&
        artworkInDb?.creator?.roles &&
        !artworkInDb?.creator?.roles.includes("artist")
      ) {
        daoUserUpdate(artworkInDb?.creator?.id, {
          roles: [...artworkInDb?.creator?.roles, "artist"],
        });
      }
    }

    const artwork: Artwork = await prisma.artwork.update({
      data,
      where: {
        id,
      },
    });
    return filteredOutputByBlacklistOrNotFound(
      artwork,
      apiConfig.db.privateJSONDataKeys.artwork
    );
  }
  throw new ApiError(httpStatus.NOT_FOUND, "Not found");
};

export const daoArtworkDelete = async (id: number): Promise<Artwork> => {
  const currentArtwork = await daoArtworkGetById(id, {
    arObjects: {
      select: {
        id: true,
        status: true,
      },
    },
    heroImage: true,
  });

  if (
    !currentArtwork ||
    ![ArtworkStatusEnum.DRAFT, ArtworkStatusEnum.PUBLISHED].includes(
      currentArtwork.status
    )
  )
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Delete failed");

  await Promise.all(
    (currentArtwork as any).arObjects.map(async (obj: any) => {
      await daoArObjectDelete(obj.id);
    })
  );

  if (currentArtwork.heroImageId)
    await daoImageSetToDelete(currentArtwork.heroImageId);

  const artwork = await prisma.artwork.delete({
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    artwork,
    apiConfig.db.privateJSONDataKeys.artwork
  );
};

export default {
  daoArtworkGetByKey,
  daoArtworkQuery,
  daoArtworkQueryFirst,
  daoArtworkQueryCount,
  daoArtworkGetById,
  daoArtworkCreate,
  daoArtworkUpdate,
  daoArtworkDelete,
  daoArtworkGetOwnById,
};
