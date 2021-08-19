/*
  Adapted version of https://github.com/shellscape/apollo-log/blob/master/src/index.ts

  Copyright © 20219 Andrew Powell
  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";
import {
  GraphQLRequestMetrics,
  GraphQLRequestContext,
} from "apollo-server-types";
import winston from "winston";
import { customAlphabet } from "nanoid";

export type LogMutateData = Record<string, string>;

export interface LogOptions {
  events: { [name: string]: boolean };
  logger: winston.Logger | undefined;
}

interface LogData {
  event: string;
  query?: string;
  variables?: string[];
  operationName: string;
  queryStartsWith?: string | null;
  errors?: readonly any[];
  ctx: GraphQLRequestContext;
  metrics?: GraphQLRequestMetrics;
}

const defaults: LogOptions = {
  events: {
    requestDidStart: true,

    didResolveSource: false,

    parsingDidStart: false,

    validationDidStart: false,
    validationDidStartEnd: false,

    didResolveOperation: false,
    responseForOperation: false,

    executionDidStart: true,
    executionDidStartEnd: false,

    willSendResponse: true,

    didEncounterErrors: true,
  },
  logger: undefined,
};
const nanoid = customAlphabet("1234567890abcdef", 6);
const ignoredOps = ["IntrospectionQuery"];

const getInternalLogger = (logger: winston.Logger | undefined) => {
  return (id: string, data: LogData) => {
    if (!logger) return;

    if (data.errors) {
      data.errors.forEach((err) =>
        logger.log(
          "warn",
          `GRAPHQL #${id} - ${data.event} - E: [${err.name}: ${
            err.message
          }] OP: ${data.operationName} ${
            data.queryStartsWith ? `- Q: "${data.queryStartsWith} ..."` : ""
          }`
        )
      );
    } else {
      logger.log(
        "info",
        `GRAPHQL #${id} - ${data.event} - OP: ${data.operationName} ${
          data.queryStartsWith ? `- Q: "${data.queryStartsWith} ..."` : ""
        }`
      );
    }

    if (
      data.event === "didEncounterErrors" &&
      data.errors &&
      process.env.NODE_ENV === "development"
    ) {
      logger.debug(
        `GRAPHQL #${id} - ${data.event} ${"\n"}GRAPHQL #${id} Full Query: ${
          data.query
        }`
      );
    }
  };
};

export const ApolloLogPlugin = (
  opts: Partial<LogOptions> = {}
): ApolloServerPlugin => {
  const options: LogOptions = { ...{}, ...defaults, ...opts };
  const log = getInternalLogger(options.logger);

  return {
    async requestDidStart(context) {
      const operationId = nanoid();
      let operationName = context?.request?.operationName ?? "";

      let query =
        context.request?.query
          ?.replace(/\n/g, "")
          .replace(/\s\s+/g, " ")
          .trim() || "[undefined]";

      if (query !== "[undefined]") {
        if (query.indexOf("query") === -1 && query.indexOf("mutation") === -1)
          query = `query ${query}`;
      }

      let queryStartsWith = "";

      const matches = query.match(/((mutation|query)?[^{]*{[^{(]*)/g);
      if (matches && matches.length > 0)
        queryStartsWith = matches[0]
          .replace(/\([^)(]*\)/gm, " ( ... )")
          .replace("\t", "")
          .replace("  ", " ");

      const { events } = options;
      const ignore = ignoredOps.includes(operationName);

      if (ignore) return {};

      if (operationName === "")
        operationName =
          query.indexOf("mutation ") > -1 ? "[mutation]" : "[query]";

      const variables = Object.keys(context.request.variables || {});

      if (events.requestDidStart)
        log(operationId, {
          event: "requestDidStart",
          operationName,
          query,
          queryStartsWith,
          variables,
          ctx: context,
        });

      const handlers: GraphQLRequestListener = {
        async didResolveSource(ctx) {
          if (events.didResolveSource)
            log(operationId, {
              event: "didResolveSource",
              ctx,
              variables,
              operationName,
            });
        },

        async parsingDidStart(ctx) {
          if (events.parsingDidStart)
            log(operationId, {
              event: "parsingDidStart",
              operationName,
              variables,
              ctx,
            });
        },

        async validationDidStart(ctx) {
          if (events.validationDidStart)
            log(operationId, {
              event: "validationDidStart",
              operationName,
              variables,
              ctx,
            });
          return async (errors) => {
            if (events.validationDidStartEnd)
              if (errors)
                log(operationId, {
                  event: "validationDidStartEnd",
                  operationName,
                  variables,
                  errors,
                  ctx,
                });
          };
        },

        async didResolveOperation(ctx) {
          if (events.didResolveOperation)
            log(operationId, {
              event: "didResolveOperation",
              ctx,
              queryStartsWith,
              operationName,
              variables,
            });
        },

        async responseForOperation(ctx) {
          if (events.responseForOperation)
            log(operationId, {
              event: "responseForOperation",
              ctx,
              operationName,
              variables,
            });
          return null;
        },
        async executionDidStart(ctx) {
          if (events.executionDidStart)
            log(operationId, {
              event: "executionDidStart",
              operationName,
              queryStartsWith,
              variables,
              ctx,
            });
          return {
            async(errors) {
              log(operationId, {
                event: "executionDidStartEnd",
                operationName,
                variables,
                ctx,
                errors,
              });
            },
          };
        },

        async didEncounterErrors(ctx) {
          if (events.didEncounterErrors)
            log(operationId, {
              event: "didEncounterErrors",
              operationName,
              query,
              queryStartsWith,
              variables,
              ctx,
              errors: ctx.errors,
            });
        },

        async willSendResponse(ctx) {
          if (options.events.willSendResponse)
            log(operationId, {
              event: "willSendResponse",
              queryStartsWith,
              operationName,
              variables,
              ctx,
            });
        },
      };

      return handlers;
    },
  };
};

export default ApolloLogPlugin;
