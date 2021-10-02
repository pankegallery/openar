/// <reference path="../../types/nexus-typegen.ts" />
import { parseResolveInfo } from "graphql-parse-resolve-info";
import { Image as PrismaImage } from "@prisma/client";

import dedent from "dedent";
import {
  objectType,
  extendType,
  inputObjectType,
  nonNull,
  intArg,
  arg,
  list,
} from "nexus";
import httpStatus from "http-status";

import { ApiError } from "../../utils";

import { GQLJson } from "./nexusTypesShared";

import { authorizeApiUser } from "../helpers";

import { getApiConfig } from "../../config";

import {
  daoImageQuery,
  // daoImageCreate,
  // daoImageUpdate,
  daoImageQueryCount,
  daoImageGetById,
  daoImageGetStatusById,
  daoImageSetToDelete,
} from "../../dao";

const apiConfig = getApiConfig();

export const Image = objectType({
  name: "Image",
  definition(t) {
    t.nonNull.int("id");
    t.string("nanoid");
    t.int("status");
    t.json("meta");
    t.int("orderNumber");
    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const ImageStatus = objectType({
  name: "ImageStatus",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("status");
    t.json("meta");
  },
});

export const ImageQueryResult = objectType({
  name: "ImageQueryResult",

  description: dedent`
    List all the available images in the database.     
  `,

  definition: (t) => {
    t.int("totalCount");
    t.field("images", { type: list("Image") });
  },
});

export const ImageQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("images", {
      type: "ImageQueryResult",

      args: {
        taxonomyId: intArg(),
        pageIndex: intArg({
          default: 0,
        }),
        pageSize: intArg({
          default: apiConfig.db.defaultPageSize,
        }),
        orderBy: arg({
          type: GQLJson,
          default: undefined,
        }),
        where: arg({
          type: GQLJson,
          default: undefined,
        }),
      },

      async resolve(...[, args, , info]) {
        const pRI = parseResolveInfo(info);

        let totalCount;
        let images: PrismaImage[] | null = [];

        if ((pRI?.fieldsByTypeName?.ImageQueryResult as any)?.totalCount) {
          totalCount = await daoImageQueryCount(args.where);

          if (totalCount === 0)
            return {
              totalCount,
              images: [],
            };
        }

        if ((pRI?.fieldsByTypeName?.ImageQueryResult as any)?.images)
          images = await daoImageQuery(
            args.where,
            args.orderBy,
            args.pageIndex as number,
            args.pageSize as number
          );

        return {
          totalCount,
          images,
        };
      },
    });

    t.nonNull.field("imageStatus", {
      type: "ImageStatus",

      args: {
        id: nonNull(intArg()),
      },

      // resolve(root, args, ctx, info)
      async resolve(...[, args]) {
        const image = await daoImageGetStatusById(args.id);

        return {
          id: image.id,
          status: image.status,
          meta: image.meta,
        };
      },
    });
  },
});

export const ImageUpdateInput = inputObjectType({
  name: "ImageUpdateInput",
  definition(t) {
    t.nonNull.json("meta");
  },
});

export const ImageMutations = extendType({
  type: "Mutation",

  definition(t) {
    t.nonNull.field("imageDelete", {
      type: "BooleanResult",

      args: {
        id: nonNull(intArg()),
      },

      authorize: (...[, , ctx]) => authorizeApiUser(ctx, "imageDeleteOwn"),

      async resolve(...[, args]) {
        const image = await daoImageSetToDelete(args.id);

        if (!image)
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Image deletion failed"
          );

        return { result: true };
      },
    });
  },
});
