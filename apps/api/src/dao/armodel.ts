import { ArModel, Prisma } from "@prisma/client";
import {
  filteredOutputByBlacklist,
  ArModelStatusEnum,
  filteredOutputByBlacklistOrNotFound,
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
  const arModels: ArModel[] = await prisma.arModel.findMany({
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

export const daoArModelGetById = async (id: number): Promise<ArModel> => {
  const arModel: ArModel | null = await prisma.arModel.findUnique({
    where: { id },
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
  const arModel: ArModel = await prisma.arModel.create({
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
  const arModel: ArModel = await prisma.arModel.update({
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
  const arModel: ArModel = await prisma.arModel.delete({
    where: {
      id,
    },
  });

  // TODO: schedule task to wipe file off the disk
  return filteredOutputByBlacklistOrNotFound(
    arModel,
    apiConfig.db.privateJSONDataKeys.armodel
  );
};

export const daoArModelSetToDelete = async (id: number): Promise<ArModel> => {
  const arModel: ArModel = await prisma.arModel.update({
    data: {
      status: ArModelStatusEnum.DELETED,
    },

    where: {
      id,
    },
  });

  // TODO: schedule task to wipe file off the disk
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
