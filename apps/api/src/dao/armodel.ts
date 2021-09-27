import { ArModel, Prisma } from "@prisma/client";
import httpStatus from "http-status";

import {
  filteredOutputByBlacklist,
  ArModelStatusEnum,
  filteredOutputByBlacklistOrNotFound,
  ApiError,
  ArObjectStatusEnum,
} from "../utils";

import { getApiConfig } from "../config";

import { getPrismaClient } from "../db/client";

const apiConfig = getApiConfig();
const prisma = getPrismaClient();

export const daoArModelTranslatedColumns = ["alt", "credits"];

export const daoArModelQuery = async (
  where: Prisma.ArModelWhereInput,
  orderBy: any,
  pageIndex: number = 0,
  pageSize: number = apiConfig.db.defaultPageSize
): Promise<ArModel[]> => {
  const arModels = await prisma.arModel.findMany({
    where,
    orderBy,
    skip: pageIndex * pageSize,
    take: Math.min(pageSize, apiConfig.db.maxPageSize),
  });

  return filteredOutputByBlacklist(
    arModels,
    apiConfig.db.privateJSONDataKeys.armodel
  );
};

export const daoArModelQueryCount = async (
  where: Prisma.ArModelWhereInput
): Promise<number> => {
  return prisma.arModel.count({
    where,
  });
};

export const daoArModelGetById = async (
  id: number,
  include?: Prisma.ArModelInclude | undefined
): Promise<ArModel> => {
  const arModel = await prisma.arModel.findUnique({
    where: { id },
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    arModel,
    apiConfig.db.privateJSONDataKeys.armodel
  );
};

export const daoArModelGetStatusById = async (id: number): Promise<ArModel> => {
  const arModel = await prisma.arModel.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      meta: true,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    arModel,
    apiConfig.db.privateJSONDataKeys.armodel
  );
};

export const daoArModelCreate = async (
  data: Prisma.ArModelCreateInput
): Promise<ArModel> => {
  const arModel = await prisma.arModel.create({
    data,
  });

  return filteredOutputByBlacklistOrNotFound(
    arModel,
    apiConfig.db.privateJSONDataKeys.armodel
  );
};

export const daoArModelUpdate = async (
  id: number,
  data: Prisma.ArModelUpdateInput
): Promise<ArModel> => {
  const arModel = await prisma.arModel.update({
    data,
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    arModel,
    apiConfig.db.privateJSONDataKeys.armodel
  );
};

export const daoArModelDelete = async (id: number): Promise<ArModel> => {
  const arModel = await prisma.arModel.delete({
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    arModel,
    apiConfig.db.privateJSONDataKeys.armodel
  );
};

export const daoArModelSetToDelete = async (id: number): Promise<ArModel> => {
  const currentModel = await daoArModelGetById(id, {
    arObject: {
      select: {
        id: true,
        status: true,
      },
    },
  });

  if (
    !currentModel ||
    ![ArObjectStatusEnum.DRAFT, ArObjectStatusEnum.PUBLISHED].includes(
      (currentModel as any)?.arObject?.status
    )
  )
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Delete failed");

  const arModel = await prisma.arModel.update({
    data: {
      status: ArModelStatusEnum.DELETED,
      arObject: {
        disconnect: true,
      },
    },

    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    arModel,
    apiConfig.db.privateJSONDataKeys.armodel
  );
};

export default {
  daoArModelQuery,
  daoArModelQueryCount,
  daoArModelGetById,
  daoArModelCreate,
  daoArModelUpdate,
  daoArModelDelete,
  daoArModelSetToDelete,
  daoArModelGetStatusById,
  daoArModelTranslatedColumns,
};
