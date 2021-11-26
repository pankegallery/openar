import Prisma from "@prisma/client";

import { getApiConfig } from "../config";
import { logger } from "../services/serviceLogging";

const apiConfig = getApiConfig();
const { PrismaClient } = Prisma;

declare const global: {
  prisma: Prisma.PrismaClient | undefined;
};

let instance: Prisma.PrismaClient | undefined;

export const createPrismaClient = (): Prisma.PrismaClient => {
  logger.info("Creating new prisma client instance");
  return new PrismaClient({
    datasources: {
      db: {
        url: `${apiConfig.db.url}&connection_limit=${apiConfig.db.connectionLimit}`,
      },
    },
    log:
      apiConfig.env.NODE_ENV === "development"
        ? ["query", "error", "info", "warn"]
        : [],
  });
};

export const setPrismaClient = (pClient: Prisma.PrismaClient) => {
  if (process.env.NODE_ENV === "production") {
    instance = pClient;
  } else {
    global.prisma = pClient;
  }
};

export const getPrismaClient = (): Prisma.PrismaClient => {
  instance = instance || global.prisma || createPrismaClient();

  if (process.env.NODE_ENV === "development" && !global.prisma)
    global.prisma = instance;

  return instance;
};

export const prismaDisconnect = async function () {
  if (instance instanceof PrismaClient) await instance.$disconnect();
  instance = undefined;
  global.prisma = undefined;
};

export default {
  prismaDisconnect,
  setPrismaClient,
  getPrismaClient,
};
