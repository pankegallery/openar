import { parentPort } from "worker_threads";
import { prismaDisconnect } from "../db";
import { daoTokenDeleteExpired } from "../dao/token";

// ALWAY REMEMBER TO CLOSE YOU DB CONNECTION !!!

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
  try {
    const count = await daoTokenDeleteExpired();
    postMessage(`[WORKER:DbExpireTokens]: Deleted ${count} expired token`);
  } catch (Err) {
    postMessage(
      `[WORKER:DbExpireTokens]: Failed to run worker. ${Err.name} ${Err.message}`
    );
  }
};

const main = async () => {
  await doChores();
};

main()
  .then(async () => {
    await prismaDisconnect();
    if (parentPort) postMessage("done");
    else process.exit(0);
  })
  .catch(async (Err) => {
    await prismaDisconnect();
    postMessage(JSON.stringify(Err));
    process.exit(1);
  });
