import { Prisma, Token } from "@prisma/client";
import { getPrismaClient } from "../db/client";

import { TokenTypesEnum } from "../utils";

const prisma = getPrismaClient();

export const daoTokenDeleteMany = async (
  where: Prisma.TokenWhereInput
): Promise<number> => {
  const { count } = await prisma.token.deleteMany({
    where,
  });
  return count;
};

export const daoTokenFindFirst = async (
  where: Prisma.TokenWhereInput
): Promise<Token | null> => {
  const token: Token | null = await prisma.token.findFirst({
    where,
  });
  return token;
};

export const daoTokenCreate = async (
  token: string,
  ownerId: number,
  expires: Date,
  type: TokenTypesEnum
): Promise<Token> => {
  const tokenInDB = await prisma.token.create({
    data: {
      token,
      ownerId,
      expires: expires.toISOString(),
      type,
    },
  });

  return tokenInDB;
};

export const daoTokenFindByUserId = async (
  ownerId: number
): Promise<Token[]> => {
  const tokens = prisma.token.findMany({
    where: {
      ownerId,
    },
  });
  return tokens;
};

export const daoTokenGetUserIdByToken = async (
  token: string
): Promise<number | void> => {
  const foundToken = await prisma.token.findFirst({
    where: {
      token,
      type: TokenTypesEnum.ACCESS,
    },
  });

  if (foundToken) return foundToken.ownerId;
};

export const daoTokenDeleteByUserId = async (
  ownerId: number
): Promise<number> => {
  const count = await daoTokenDeleteMany({ ownerId });
  return count;
};

export const daoTokenDeleteExpired = async (): Promise<number> => {
  const count = await daoTokenDeleteMany({
    expires: {
      lt: new Date(),
    },
  });
  return count;
};

export default {
  TokenTypesEnum,
  daoTokenDeleteMany,
  daoTokenFindFirst,
  daoTokenCreate,
  daoTokenFindByUserId,
  daoTokenDeleteByUserId,
  daoTokenGetUserIdByToken,
};
