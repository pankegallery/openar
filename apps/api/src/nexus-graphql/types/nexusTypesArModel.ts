/// <reference path="../../types/nexus-typegen.ts" />
import { objectType, extendType, nonNull, intArg } from "nexus";
import httpStatus from "http-status";

import { ApiError } from "../../utils";

// import { authorizeApiUser } from "../helpers"; TODO: enable!

import {
  daoArModelGetById,
  daoArModelGetStatusById,
  daoArModelSetToDelete,
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
    t.nonNull.field("arModelRead", {
      type: "ArModel",

      args: {
        id: nonNull(intArg()),
      },

      // TODO: how to protect individual assets only own or authorize: (...[, , ctx]) => authorizeApiUser(ctx, "artworkReadOwn"),

      // resolve(root, args, ctx, info)
      async resolve(...[, args]) {
        return daoArModelGetById(args.id);
      },
    });

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

      // TODO enable later also check if user owns if not full access ... authorize: (...[, , ctx]) => authorizeApiUser(ctx, "arModelDelete"),

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
