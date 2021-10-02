/// <reference path="../../types/nexus-typegen.ts" />
import { objectType, extendType, nonNull, intArg } from "nexus";
import httpStatus from "http-status";

import { ApiError } from "../../utils";
import { authorizeApiUser } from "../helpers";

import {
  daoArModelGetStatusById,
  daoArModelSetToDelete,
  daoArModelQueryCount,
} from "../../dao";

export const ArModel = objectType({
  name: "ArModel",
  definition(t) {
    t.nonNull.int("id");
    t.string("nanoid");
    t.int("status");
    t.json("meta");
    t.string("type");
    t.int("orderNumber");
    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const ArModelStatus = objectType({
  name: "ArModelStatus",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("status");
    t.json("meta");
  },
});

export const ArModelQueries = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("arModelStatus", {
      type: "ArModelStatus",

      args: {
        id: nonNull(intArg()),
      },

      // resolve(root, args, ctx, info)
      async resolve(...[, args]) {
        const arModel = await daoArModelGetStatusById(args.id);

        return {
          id: arModel.id,
          status: arModel.status,
          meta: arModel.meta,
        };
      },
    });
  },
});

export const ArModelMutations = extendType({
  type: "Mutation",

  definition(t) {
    t.nonNull.field("arModelDelete", {
      type: "BooleanResult",

      args: {
        id: nonNull(intArg()),
      },

      authorize: async (...[, args, ctx]) => {
        if (!authorizeApiUser(ctx, "artworkDeleteOwn")) return false;

        const count = await daoArModelQueryCount({
          id: args.id,

          owner: {
            id: ctx.appUser?.id ?? 0,
          },
        });

        return count === 1;
      },

      async resolve(...[, args]) {
        const arModel = await daoArModelSetToDelete(args.id);

        if (!arModel)
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "ArModel deletion failed"
          );

        return { result: true };
      },
    });
  },
});
