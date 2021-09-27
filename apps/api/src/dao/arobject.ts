import { ArObject, Prisma } from "@prisma/client";
import httpStatus from "http-status";

import {
  filteredOutputByBlacklistOrNotFound,
  filteredOutputByBlacklist,
  ArObjectStatusEnum,
  ApiError,
} from "../utils";

import { getPrismaClient } from "../db/client";
import { getApiConfig } from "../config";
import { daoImageSetToDelete, daoArModelSetToDelete } from ".";

const apiConfig = getApiConfig();
const prisma = getPrismaClient();

export const daoArObjectQuery = async (
  where: Prisma.ArObjectWhereInput,
  include: Prisma.ArObjectInclude | undefined,
  orderBy: any,
  pageIndex: number = 0,
  pageSize: number = apiConfig.db.defaultPageSize
): Promise<ArObject[]> => {
  const arObjects = await prisma.arObject.findMany({
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
  const arObject = await prisma.arObject.create({
    data: {
      ...data,
      orderNumber: 1,
    },
  });

  const count = await prisma.arObject.count({
    where: {
      artworkId: arObject.artworkId,
    },
  });

  if (count > 1) {
    await prisma.arObject.update({
      data: {
        orderNumber: count,
      },
      where: {
        id: arObject.id,
      },
    });
  }

  return filteredOutputByBlacklistOrNotFound(
    arObject,
    apiConfig.db.privateJSONDataKeys.arobject
  );
};

export const daoArObjectGetById = async (
  id: number,
  include?: Prisma.ArObjectInclude | undefined
): Promise<ArObject> => {
  const arObject = await prisma.arObject.findUnique({
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
  const arObject = await prisma.arObject.findFirst({
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
  const arObject = await prisma.arObject.findFirst({
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
  const arObject = await prisma.arObject.update({
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

export const daoArObjectReorder = async (
  id: number,
  data: any
): Promise<number> => {
  const promises = await prisma.$transaction(
    data.map(async (arO: any) => {
      return prisma.arObject.update({
        data: {
          orderNumber: arO.orderNumber,
        },
        where: {
          id: arO.id,
        },
      });
    })
  );

  return promises.length;
};

export const daoArObjectDelete = async (id: number): Promise<ArObject> => {
  const currentObject = await daoArObjectGetById(id, {
    arModels: true,
    heroImage: true,
  });

  if (
    !currentObject ||
    ![ArObjectStatusEnum.DRAFT, ArObjectStatusEnum.PUBLISHED].includes(
      currentObject.status
    )
  )
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Delete failed");

  await prisma.$transaction(
    (currentObject as any).arModels.map(async (obj: any) => {
      await daoArModelSetToDelete(obj.id);
    })
  );

  if (currentObject.heroImageId)
    await daoImageSetToDelete(currentObject.heroImageId);

  const arObject = await prisma.arObject.delete({
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
  daoArObjectReorder,
};
