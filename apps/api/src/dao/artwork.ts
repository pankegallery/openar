import { Artwork, Prisma } from "@prisma/client";

import {
  filteredOutputByBlacklistOrNotFound,
  filteredOutputByBlacklist,
} from "../utils";

import { getPrismaClient } from "../db/client";
import { getApiConfig } from "../config";

const apiConfig = getApiConfig();
const prisma = getPrismaClient();

export const daoArtworkQuery = async (
  where: Prisma.ArtworkWhereInput,
  include: Prisma.ArtworkInclude | undefined,
  orderBy: Prisma.ArtworkOrderByInput | Prisma.ArtworkOrderByInput[],
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
  const artwork: Artwork | null = await prisma.artwork.findUnique({
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
  const artwork: Artwork | null = await prisma.artwork.findFirst({
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
  const artwork: Artwork | null = await prisma.artwork.findFirst({
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
  const term: Artwork = await prisma.artwork.update({
    data,
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    term,
    apiConfig.db.privateJSONDataKeys.artwork
  );
};

export const daoArtworkDelete = async (id: number): Promise<Artwork> => {
  const term: Artwork = await prisma.artwork.delete({
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    term,
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
