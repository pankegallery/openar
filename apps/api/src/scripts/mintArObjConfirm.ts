/* eslint-disable security/detect-non-literal-fs-filename */
import dotenv from "dotenv";

// !!!! ALWAY REMEMBER TO CLOSE YOU DB CONNECTION !!!
import Prisma from "@prisma/client";

import { GraphQLClient, gql } from "graphql-request";

const query = gql`
  query medias($arObjectKey: String!) {
    medias(where: { arObjectKey: $arObjectKey }, first: 100) {
      id
    }
  }
`;

import { getApiConfig } from "../config";
import logger from "../services/serviceLogging";
import { ArObjectStatusEnum } from "../utils";

dotenv.config();

const apiConfig = getApiConfig();

const doChores = async () => {
  const { PrismaClient } = Prisma;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `${apiConfig.db.url}&connection_limit=1`,
      },
    },
  });

  try {
    const client = new GraphQLClient(apiConfig.baseUrl.subgraph);

    const arObjects = await prisma.arObject.findMany({
      where: {
        status: ArObjectStatusEnum.MINTCONFIRM,
        updatedAt: {
          lte: new Date(new Date().getTime() - 60000),
        },
      },
      take: 10,
    });

    if (arObjects && arObjects.length > 0) {
      await Promise.all(
        arObjects.map(async (arObject: any) => {
          const variables = {
            arObjectKey: arObject.key,
          };

          // Overrides the clients headers with the passed values
          const data = await client.request(query, variables);
          if (
            data &&
            data.medias &&
            data.medias.length > 0 &&
            data.medias.length === arObject.editionOf
          ) {
            logger.info(
              `arObject: ${arObject.key} confirmed the mint of ${arObject.editionOf} tokens in subgraph`
            );
            await prisma.arObject.update({
              data: {
                status: ArObjectStatusEnum.MINTED,
              },
              where: {
                id: arObject.id,
              },
            });
          }
        })
      );
    } else {
      throw Error("Not found");
    }
  } catch (Err) {
    logger.error(Err);
    throw Err;
  } finally {
    if (prisma) await prisma.$disconnect();    
  }
};

doChores()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (Err) => {
    // eslint-disable-next-line no-console
    console.error(Err);
    logger.error(Err);
    process.exit(1);
  });
