import { parentPort } from "worker_threads";
import { spawn } from "child_process";

// !!!! ALWAY REMEMBER TO CLOSE YOU DB CONNECTION !!!
import Prisma from "@prisma/client";

import { GraphQLClient, gql } from "graphql-request";

import { getApiConfig } from "../config";

const apiConfig = getApiConfig();
import { ArObjectStatusEnum } from "../utils";

const query = gql`
  query medias($arObjectKey: String!) {
    medias(where: { arObjectKey: $arObjectKey }, first: 100) {
      id
    }
  }
`;

// https://github.com/breejs/bree#long-running-jobs
// Or use https://threads.js.org/usage for a queing experience .. .
// if (parentPort)
//   parentPort.once("message", (message) => {
//     //
//     // we could make it `Number.MAX_VALUE` here to speed cancellation up
//     // <https://github.com/sindresorhus/p-map/issues/28>
//     //
//     if (message === "cancel") isCancelled = true;
//   });

const postMessage = (msg: string) => {
  if (parentPort) parentPort.postMessage(msg);
  // eslint-disable-next-line no-console
  else console.log(msg);
};

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
    const arObject = await prisma.arObject.findFirst({
      where: {
        status: {
          in: [ArObjectStatusEnum.MINT, ArObjectStatusEnum.MINTRETRY],
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    await prisma.$disconnect();

    if (arObject) {
      const buildFolder =
        process.env.NODE_ENV !== "production" ? "build" : "live";
      const chainId = process.env.NODE_ENV !== "production" ? 31337 : 100;

      spawn(
        "node",
        [
          `${apiConfig.packageBaseDir}/${buildFolder}/scripts/mintArObj.js`,
          `--chainId=${chainId}`,
          `--objectId=${arObject.id}`,
        ],
        {
          detached: true,
        }
      );
      postMessage(`[WORKER:mint]: Triggered mint for obj: ${arObject.key}`);
    }

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
        arObjects.map(async (arObj: any) => {
          const variables = {
            arObjectKey: arObj.key,
          };

          // Overrides the clients headers with the passed values
          const data = await client.request(query, variables);
          if (
            data &&
            data.medias &&
            data.medias.length > 0 &&
            data.medias.length === arObj.editionOf
          ) {
            postMessage(
              `[WORKER:mint]: arObject: ${arObj.key} confirmed the mint of ${arObj.editionOf} tokens in subgraph`
            );
            await prisma.arObject.update({
              data: {
                status: ArObjectStatusEnum.MINTED,
              },
              where: {
                id: arObj.id,
              },
            });
          }
        })
      );
    }
  } catch (Err: any) {
    if (prisma) await prisma.$disconnect();
    postMessage(
      `[WORKER:mint]: Failed to run worker. ${Err.name} ${Err.message}`
    );
  }
};

doChores()
  .then(async () => {
    if (parentPort) postMessage("done");
    else process.exit(0);
  })
  .catch((Err) => {
    postMessage(JSON.stringify(Err));
    process.exit(1);
  });
