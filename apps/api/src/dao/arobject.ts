import { ArObject, Prisma } from "@prisma/client";

import {
  filteredOutputByBlacklistOrNotFound,
  filteredOutputByBlacklist,
} from "../utils";

import { getPrismaClient } from "../db/client";
import { getApiConfig } from "../config";

const apiConfig = getApiConfig();
const prisma = getPrismaClient();

export const daoArObjectQuery = async (
  where: Prisma.ArObjectWhereInput,
  include: Prisma.ArObjectInclude | undefined,
  orderBy: Prisma.ArObjectOrderByInput | Prisma.ArObjectOrderByInput[],
  pageIndex: number = 0,
  pageSize: number = apiConfig.db.defaultPageSize
): Promise<ArObject[]> => {
  const arObjects: ArObject[] = await prisma.arObject.findMany({
    where,
    include,
    orderBy,
    skip: pageIndex * pageSize,
    take: Math.min(pageSize, apiConfig.db.maxPageSize),
  });

  return filteredOutputByBlacklist(
    arObjects,
    apiConfig.db.privateJSONDataKeys.arobject
  );
};

export const daoArObjectQueryFirst = async (
  where: Prisma.ArObjectWhereInput,
  include: Prisma.ArObjectInclude | undefined
): Promise<ArObject> => {
  const arObject = await prisma.arObject.findFirst({
    where,
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    arObject,
    apiConfig.db.privateJSONDataKeys.arobject
  );
};

export const daoArObjectQueryCount = async (
  where: Prisma.ArObjectWhereInput
): Promise<number> => {
  return prisma.arObject.count({
    where,
  });
};

export const daoArObjectCreate = async (
  data: Prisma.ArObjectCreateInput
): Promise<ArObject> => {
  const arObject: ArObject = await prisma.arObject.create({
    data,
  });

  return filteredOutputByBlacklistOrNotFound(
    arObject,
    apiConfig.db.privateJSONDataKeys.arobject
  );
};

export const daoArObjectGetById = async (
  id: number,
  include?: Prisma.ArObjectInclude | undefined
): Promise<ArObject> => {
  const arObject: ArObject | null = await prisma.arObject.findUnique({
    where: { id },
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    arObject,
    apiConfig.db.privateJSONDataKeys.arobject
  );
};

export const daoArObjectGetOwnById = async (
  id: number,
  userId: number,
  include?: Prisma.ArObjectInclude | undefined
): Promise<ArObject> => {
  const arObject: ArObject | null = await prisma.arObject.findFirst({
    where: {
      id,
      creator: {
        id: userId,
      },
    },
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    arObject,
    apiConfig.db.privateJSONDataKeys.arobject
  );
};

export const daoArObjectGetByKey = async (
  where: Prisma.ArObjectWhereInput | undefined,
  include?: Prisma.ArObjectInclude | undefined
): Promise<ArObject> => {
  const arObject: ArObject | null = await prisma.arObject.findFirst({
    where,
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    arObject,
    apiConfig.db.privateJSONDataKeys.arobject
  );
};

export const daoArObjectUpdate = async (
  id: number,
  data: Prisma.ArObjectUpdateInput
): Promise<ArObject> => {
  const arObject: ArObject = await prisma.arObject.update({
    data,
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    arObject,
    apiConfig.db.privateJSONDataKeys.arobject
  );
};

export const daoArObjectDelete = async (id: number): Promise<ArObject> => {
  const arObject: ArObject = await prisma.arObject.delete({
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    arObject,
    apiConfig.db.privateJSONDataKeys.arobject
  );
};

export default {
  daoArObjectGetByKey,
  daoArObjectQuery,
  daoArObjectQueryFirst,
  daoArObjectQueryCount,
  daoArObjectGetById,
  daoArObjectCreate,
  daoArObjectUpdate,
  daoArObjectDelete,
  daoArObjectGetOwnById,
};
