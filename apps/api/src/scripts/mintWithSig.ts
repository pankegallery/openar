import Prisma from "@prisma/client";
import { prismaDisconnect } from "../db";
import dotenv from "dotenv";
import minimist from "minimist";

import { MarketFactory } from "@openar/contracts";
import { ipfsCreateClient } from "@openar/crypto";
import { getApiConfig } from "../config";
import logger from "../services/serviceLogging";
import { ArObjectStatusEnum } from "../utils";

dotenv.config();

const apiConfig = getApiConfig();
// connect to a different API
const ipfs = ipfsCreateClient(apiConfig.ipfsApiUrl);

const doChores = async () => {
  const args = minimist(process.argv.slice(2), {
    //string: ['tokenURI', 'metadataURI', 'contentHash', 'metadataHash'],
  });

  if (!args.objectId) {
    throw new Error("--objectId object ID is required");
  }

  if (!args.chainId) {
    throw new Error("--chainId chain ID is required");
  }

  const { PrismaClient } = Prisma;
  const prisma = new PrismaClient({
    // TODO: how to ensuere how many connections are allowe??? Should only be one for this one...
    datasources: {
      db: {
        url: apiConfig.db.url,
      },
    },
  });

  try {
    const arObject = await prisma.arObject.findUnique({
      where: {
        id: args.objectId,
      },
      include: {
        heroImage: true,
        arModels: true,
      },
    });

    if (arObject) {
      if (
        ![ArObjectStatusEnum.MINT, ArObjectStatusEnum.MINTRETRY].includes(
          arObject.status
        )
      )
        throw Error("Status of object excludes it from projecssing");

      console.log(arObject);
    }
  } catch (Err) {
    logger.error(Err);
    throw Err;
  }
};

doChores()
  .then(async () => {
    await prismaDisconnect();
    process.exit(0);
  })
  .catch(async (Err) => {
    // eslint-disable-next-line no-console
    console.error(Err);
    logger.error(Err);
    await prismaDisconnect();
    process.exit(1);
  });
