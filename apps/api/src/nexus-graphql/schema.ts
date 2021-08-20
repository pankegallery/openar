/// <reference path="../types/nexus-typegen.ts" />

import { makeSchema, fieldAuthorizePlugin } from "nexus";
import type { core } from "nexus";

import { join } from "path";

import { getApiConfig } from "../config";

import * as types from "./types";

const apiConfig = getApiConfig();
// TODO: interesting plugins:
// https://www.npmjs.com/package/nexus-args-validation
// https://www.npmjs.com/package/@jcm/nexus-plugin-datetime
// https://nexusjs.org/docs/plugins/query-complexity

let schemaConfig: core.SchemaConfig = {
  types,
  plugins: [fieldAuthorizePlugin()],
};

// in production we don't need to generate typings or the schema file
if (process.env.NODE_ENV !== "production")
  schemaConfig = {
    ...schemaConfig,
    ...{
      outputs: {
        typegen: join(apiConfig.packageBaseDir, "src/types/nexus-typegen.ts"),
        schema: join(apiConfig.packageBaseDir, "graphql/schema.graphql"),
      },
      contextType: {
        module: join(apiConfig.packageBaseDir, "src/nexus-graphql/context.ts"),
        export: "NexusResolverContext",
      },
    },
  };

export const schema = makeSchema(schemaConfig);

export default schema;
