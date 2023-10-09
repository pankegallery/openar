// import bcrypt from "bcrypt";
import httpStatus from "http-status";
import bcrypt from "bcryptjs"
import { User, Prisma } from "@prisma/client";

import {
  ApiError,
  filteredOutputByBlacklistOrNotFound,
  filteredOutputByBlacklist,
} from "../utils";
import { getApiConfig } from "../config";
import { getPrismaClient } from "../db/client";
import { daoImageSetToDelete } from "./image";
import { logger } from "../services/serviceLogging";

const apiConfig = getApiConfig();
const prisma = getPrismaClient();

export const daoUserCheckIsEmailTaken = async (
  email: string,
  id?: number | undefined
): Promise<boolean> => {
  let where: Prisma.UserWhereInput = {
    email,
  };

  if (id && !Number.isNaN(id)) {
    where = {
      ...where,
      id: {
        not: id,
      },
    };
  }

  const count = await prisma.user.count({
    where,
  });

  return count > 0;
};

export const daoUserCreate = async (
  data: Prisma.UserCreateInput
): Promise<User> => {
  // if (await daoUserCheckIsEmailTaken(data.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  // }

  logger.warn("daoUserCreate")
  logger.warn(JSON.stringify(data, null, 4))

  let user : User | null = null
  try {
    user = await prisma.user.create({
      data: {
        ...data,
        ethAddress: data.ethAddress?.toLowerCase() ?? "",
      },
    });
  } catch (e) {
    logger.warn("Caught exception in creating user")
    logger.warn(e)
  }

  logger.warn("prisma user created")

  return filteredOutputByBlacklistOrNotFound(
    user,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export const daoUserQuery = async (
  where: Prisma.UserWhereInput,
  orderBy: any,
  pageIndex: number = 0,
  pageSize: number = apiConfig.db.defaultPageSize
): Promise<User[]> => {
  const users: User[] = await prisma.user.findMany({
    where,
    orderBy,
    skip: pageIndex * pageSize,
    take: Math.min(pageSize, apiConfig.db.maxPageSize),
  });

  return filteredOutputByBlacklist(
    users,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export const daoUserSelectQuery = async (
  where: Prisma.UserWhereInput,
  select: Prisma.UserSelect,
  orderBy: any,
  pageIndex: number = 0,
  pageSize: number = apiConfig.db.defaultPageSize
): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where,
    select,
    orderBy,
    skip: pageIndex * pageSize,
    take: Math.min(pageSize, apiConfig.db.maxPageSize),
  });

  return filteredOutputByBlacklist(
    users,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export const daoPublicUserQuery = async (
  where: Prisma.UserWhereInput,
  orderBy: any,
  pageIndex: number = 0,
  pageSize: number = apiConfig.db.defaultPageSize
): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where: { ...where, isBanned: false },
    select: {
      id: true,
      pseudonym: true,
      ethAddress: true,
    },
    orderBy,
    skip: pageIndex * pageSize,
    take: Math.min(pageSize, apiConfig.db.maxPageSize),
  });

  return filteredOutputByBlacklist(
    users,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export const daoUserFindFirst = async (
  where: Prisma.UserWhereInput,
  include?: Prisma.UserInclude | undefined
): Promise<User> => {
  const user = await prisma.user.findFirst({
    where,
    include,
  });

  return filteredOutputByBlacklistOrNotFound(
    user,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export const daoUserSelectFindFirst = async (
  where: Prisma.UserWhereInput,
  select: Prisma.UserSelect,
  allowNull?: boolean
): Promise<User> => {
  const user = await prisma.user.findFirst({
    where,
    select,
  });

  if (allowNull)
    return filteredOutputByBlacklist(
      user,
      apiConfig.db.privateJSONDataKeys.user
    );
  return filteredOutputByBlacklistOrNotFound(
    user,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export const daoUserQueryCount = async (
  where: Prisma.UserWhereInput
): Promise<number> => {
  return prisma.user.count({
    where,
  });
};

export const daoUserGetById = async (id: number): Promise<User> => {
  const user: User | null = await prisma.user.findUnique({ where: { id } });

  return filteredOutputByBlacklistOrNotFound(
    user,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export const daoUserGetByEthAddress = async (
  ethAddress: string
): Promise<User | null> => {
  let user: User | null
  
  if (ethAddress) {
    user = await prisma.user.findFirst({
      where: {
        ethAddress: ethAddress.toLowerCase(),
      },
    });  
  } else {
    user = null
  }

  if (user) {
    return filteredOutputByBlacklistOrNotFound(
      user,
      apiConfig.db.privateJSONDataKeys.user
    );  
  } else {
    return null
  }
};

export const daoUserFindByEthAddress = async (
  ethAddress: string
): Promise<User | null> => {
  return await daoUserGetByEthAddress(ethAddress)
};

export const daoUserFindByEmail = async (email: string) : Promise<User> => {
  const user: User | null = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
    },
  });

  logger.warn(user)

  return filteredOutputByBlacklist(user, apiConfig.db.privateJSONDataKeys.user);
}

export const daoUserByEmailCheckPassword = async (email: string, passwordPlain : string) : Promise<User | null> => {  
  const user: User | null = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase().trim(),
    },
  });

  if (bcrypt.compareSync(passwordPlain, user?.password)) {
    return filteredOutputByBlacklist(user, apiConfig.db.privateJSONDataKeys.user);
  } else {
    return null
  }
}

export const daoUserUpdatePassword = async (userId: number, newPassword : string) : Promise<boolean> => {
  try {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        password: newPassword
      }
    })  
  } catch (e) {
    logger.error("Caught exception in updating password: ", e)
    return false
  }

  return true
}

export const daoUserUpdate = async (
  id: number,
  data: Prisma.UserUpdateInput
): Promise<User> => {
  const updateData = data;

  if (await daoUserCheckIsEmailTaken(`${data.email ?? ""}`, id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const user: User = await prisma.user.update({
    data: {
      ...updateData,
      ethAddress:
        "ethAddress" in updateData
          ? (updateData?.ethAddress as string).toLowerCase()
          : undefined,
    },
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    user,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export const daoUserDelete = async (id: number): Promise<User> => {
  const user: User = await prisma.user.delete({
    where: {
      id,
    },
  });

  return filteredOutputByBlacklistOrNotFound(
    user,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export const daoUserProfileImageDelete = async (
  imageId: number,
  userId: number
): Promise<User> => {
  const user: User = await prisma.user.update({
    data: {
      profileImage: {
        disconnect: true,
      },
    },
    where: {
      id: userId,
    },
  });

  await daoImageSetToDelete(imageId);

  return filteredOutputByBlacklistOrNotFound(
    user,
    apiConfig.db.privateJSONDataKeys.user
  );
};

export default {
  daoUserCreate,
  daoUserQuery,
  daoUserSelectQuery,
  daoUserQueryCount,
  daoUserGetById,
  daoUserUpdate,
  daoUserDelete,
  daoUserFindFirst,
  daoUserSelectFindFirst,
  daoUserProfileImageDelete,
  daoUserCheckIsEmailTaken,
  daoUserGetByEthAddress,
  daoUserFindByEthAddress,
};
