import { app, initializeExpressApp } from "./app";
import { startApi } from "./startApi";
import { initializeApolloServer } from "./server";
import { updateApiConfig } from "./config";

// @ts-ignore (CMSetting is JS file)
import OpenARSettings from "../../../openar.config";

const start = async () => {
  // The api makes use of the default prisma.schema found in
  // ./packages/api/prisma/ you can run your own schema  by extending/changing
  // the base schema and having a second prisma folder, generating an own
  // Prisma client and setting the instance before you start the server.
  // db.setPrismaClient(YourPrismaClientInstance)

  // db.setPrismaClient(prismaClientInstance)

  // before we start the server we want to make sure to
  // prepare the default settings and overwrite it with
  // additional customization and plugin initialization that might
  // have been done in ./openar.config.js
  // This is all done by clalling config.update() and passing the imported settings

  updateApiConfig(OpenARSettings);

  // cors settings do need to be set twice for the express app (serving everything)
  // but ../graphql served by the apollo server. Apropriate defaults are in place but
  // you can overwrite them using the following method.
  // config.updateCors(cors);

  // as now evertying is configured initialize the express app.
  initializeExpressApp();

  /*
    Here you could attach further routes and middleware to your express app

    app.use((req, res) => {
      res.status(200);
      res.send("Hello world!");
      res.end();
    });
  */

  // change TODO:
  // this is to make sure that the root domain is anwering something.
  app.get("/", function (req, res) {
    res.send("ok");
  });

  // app.use(errorToApiErrorConverter);
  // app.use(errorDisplayInResponse);

  // now configure the server (either pass a GraphQL Schema)
  // or use the preinstalled one by not setting and config settings.
  initializeApolloServer();

  // and now run the whole thing ...
  await startApi();
};

start();

process.on("unhandledRejection", (reason: any) => {
  // eslint-disable-next-line no-console
  console.error("Error: Unhandled Rejection at:", reason.stack || reason);
});
