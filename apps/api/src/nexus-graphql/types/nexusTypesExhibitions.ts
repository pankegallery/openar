export default {};

// /// <reference path="../../types/nexus-typegen.ts" />
import { parseResolveInfo } from "graphql-parse-resolve-info";
// import { filteredOutputByWhitelist } from "../../utils";

// import dedent from "dedent";
import {
  objectType,
//   extendType,
//   inputObjectType,
//   nonNull,
//   stringArg,
//   intArg,
//   arg,
//   list,
} from "nexus";
// import httpStatus from "http-status";
// import { ApiError } from "../../utils";

// import { GQLJson } from "./nexusTypesShared";

// import { authorizeApiUser } from "../helpers";

// import { apiConfig } from "../../config";

// import {
//   daoEventQuery,
//   daoEventQueryCount,
//   daoEventQueryFirst,
//   daoEventCreate,
//   daoEventDelete,
//   daoUserGetById,
//   daoEventGetBySlug,
//   daoImageSaveImageTranslations,
// } from "../../dao";

// import { eventUpdate } from "../../services/serviceEvent";

// export const EventDate = objectType({
//   name: "EventDate",
//   definition(t) {
//     t.nonNull.int("id");
//     t.date("date");
//     t.date("begin");
//     t.date("end");

//     t.date("createdAt");
//     t.date("updatedAt");
//   },
// });

export const Exhibition = objectType({
  name: "Exhibition",
  definition(t) {
    t.nonNull.int("id");
    t.json("title");
    t.json("slug");
    t.string("subtitle");
    t.date("dateBegin");
    t.date("dateEnd");
    t.nonNull.int("status");
    
    t.field("curators", {
      type: "User",

      // // resolve(root, args, ctx, info)
      // async resolve(...[p]) {
      //   if (p.ownerId) {
      //     const user = await daoUserGetById(p.ownerId);
      //     if (user)
      //       return filteredOutputByWhitelist(user, [
      //         "id",
      //         "firstName",
      //         "lastName",
      //       ]);
      //   }
      //   return null;
      // },
    });

    t.list.field("artworks", {
      type: "Artwork",
    });

    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const EventQueries = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("exhibition", {
      type: "Exhibition",

      args: {
        slug: nonNull(stringArg()),
      },

      // resolve(root, args, ctx, info)
      async resolve(...[, args, , info]) {
        const pRI = parseResolveInfo(info);

        let include = {};

        if ((pRI?.fieldsByTypeName?.Event as any)?.terms)
          include = {
            ...include,
            terms: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          };

        if ((pRI?.fieldsByTypeName?.Event as any)?.dates)
          include = {
            ...include,
            dates: {
              select: {
                id: true,
                date: true,
                begin: true,
                end: true,
              },
              orderBy: {
                date: "asc",
              },
            },
          };

        if ((pRI?.fieldsByTypeName?.Event as any)?.locations)
          include = {
            ...include,
            locations: {
              select: {
                id: true,
                title: true,
                description: true,
                lat: true,
                lng: true,
              },
              orderBy: {
                title: "asc",
              },
            },
          };

        if ((pRI?.fieldsByTypeName?.Event as any)?.heroImage)
          include = {
            ...include,
            heroImage: {
              include: {
                translations: true,
              },
            },
          };

        return daoEventQueryFirst(
          {
            id: args.id,
          },
          Object.keys(include).length > 0 ? include : undefined
        );
      },
    });
  },
});
