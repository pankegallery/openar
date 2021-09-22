import { parentPort } from "worker_threads";

// !!!! ALWAY REMEMBER TO CLOSE YOU DB CONNECTION !!!
import Prisma from "@prisma/client";

import { getApiConfig } from "../config";

const apiConfig = getApiConfig();

// https://github.com/breejs/bree#long-running-jobs
// Or use https://threads.js.org/usage for a queing experience .. .
// if (parentPort)
//   parentPort.once("message", (message) => {
//     //
//     // TODO: once we can manipulate concurrency option to p-map
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
    const { count } = await prisma.token.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });

    postMessage(`[WORKER:DbExpireTokens]: Deleted ${count} expired token`);
  } catch (Err: any) {
    postMessage(
      `[WORKER:DbExpireTokens]: Failed to run worker. ${Err.name} ${Err.message}`
    );
  } finally {
    if (prisma) await prisma.$disconnect();
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
