/// <reference path="../../types/nexus-typegen.ts" />
import { parseResolveInfo } from "graphql-parse-resolve-info";
// import { filteredOutputByWhitelist } from "../../utils";

// import dedent from "dedent";
import {
  objectType,
  //   extendType,
  //   inputObjectType,
  nonNull,
  stringArg,
  //   intArg,
  //   arg,
  //   list,
} from "nexus";
// import httpStatus from "http-status";
// import { ApiError } from "../../utils";

// import { GQLJson } from "./nexusTypesShared";

// import { authorizeApiUser } from "../helpers";

// import { apiConfig } from "../../config";

import {
  daoArtworkQueryAll,
//   daoEventQueryCount,
//   daoEventQueryFirst,
//   daoEventCreate,
//   daoEventDelete,
//   daoUserGetById,
//   daoEventGetBySlug,
//   daoImageSaveImageTranslations,
} from "../../dao";

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
        return {
          title: "OpenAR.art",
          subtitle:
            "Platform launch and groupshow curated by Sakrowski and Jeremy Bailey",
          dateBegin: new Date("20210829").toISOString(),
          dateEnd: new Date("20211004").toISOString(),
          description:
            "On the occasion of the launch of the new platform “openar.art”, panke.gallery presents a hybrid group exhibition with experimental Augmented Reality works. The open platform makes it easy to exhibit, collect and discuss Augmented Reality works and allows artists to sell their works as NFTs. Since the platform is organized as a cooperative, profits will be shared among the artists. As part of the project openAR, the exhibition and platform have been developed in collaboration between workshop participants and digital artists Jeremy Bailey, Sarah Buser and Tamás Páll. The works examine the possibilities of AR technology in artistic applications. Visual, acoustic and performative Augmented Reality formats can be experienced in the exhibition.",

          artworks: daoArtworkQueryAll(),
        };
      },
    });
  },
});
