/// <reference path="../../types/nexus-typegen.ts" />
// import { parseResolveInfo } from "graphql-parse-resolve-info";
// import { filteredOutputByWhitelist } from "../../utils";

// import dedent from "dedent";
import {
  objectType,
  extendType,
  //   inputObjectType,
  nonNull,
  stringArg,
  //   intArg,
  //   arg,
  //   list,
} from "nexus";

import httpStatus from "http-status";
import { ApiError } from "../../utils";

// import { GQLJson } from "./nexusTypesShared";

// import { authorizeApiUser } from "../helpers";

// import { apiConfig } from "../../config";

import {
  daoArtworkQuery,
  //   daoEventQueryCount,
  //   daoEventQueryFirst,
  //   daoEventCreate,
  //   daoEventDelete,
  //   daoUserGetById,
  //   daoEventGetBySlug,
  //   daoImageSaveImageTranslations,
} from "../../dao";

import {
  ArtworkStatusEnum,
  ExhibitionStatusEnum,
  ArObjectStatusEnum,
} from "../../utils";

export const Exhibition = objectType({
  name: "Exhibition",
  definition(t) {
    t.nonNull.int("id");
    t.json("title");
    t.json("slug");
    t.string("subtitle");
    t.string("description");
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

      async resolve(...[, args]) {
        if (args.slug !== "open-ar")
          throw new ApiError(httpStatus.NOT_FOUND, "Not found");

        return {
          id: 1,
          title: "OpenAR.art",
          slug: "openar-art",
          subtitle: "A groupshow curated by Sakrowski and Jeremy Bailey",
          dateBegin: new Date("2021-08-29 12:00"),
          dateEnd: new Date("2021-10-04 12:00"),
          description:
            "On the occasion of the launch of the new platform “openar.art”, panke.gallery presents a hybrid group exhibition with experimental Augmented Reality works. The exhibition and platform have been developed in collaboration between workshop participants and digital artists Jeremy Bailey, Sarah Buser and Tamás Páll. The works examine the possibilities of AR technology in artistic applications. Visual, acoustic and performative Augmented Reality formats can be experienced in the exhibition.",
          status: ExhibitionStatusEnum.PUBLISHED,
          artworks: await daoArtworkQuery(
            {
              status: {
                in: [
                  ArtworkStatusEnum.PUBLISHED,
                  ArtworkStatusEnum.HASMINTEDOBJECTS,
                ],
              },
              isPublic: true,
              id: {
                in: [3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22],
              },
            },
            {
              heroImage: {
                select: {
                  status: true,
                  id: true,
                  meta: true,
                },
              },
              creator: {
                select: {
                  id: true,
                  bio: true,
                  pseudonym: true,
                  ethAddress: true,
                },
              },
              arObjects: {
                select: {
                  id: true,
                  status: true,
                  key: true,
                  orderNumber: true,
                  title: true,
                  askPrice: true,
                  editionOf: true,
                  heroImage: {
                    select: {
                      meta: true,
                      status: true,
                      id: true,
                    },
                  },
                },
                where: {
                  status: {
                    in: [
                      ArObjectStatusEnum.PUBLISHED,
                      ArObjectStatusEnum.MINTING,
                      ArObjectStatusEnum.MINTCONFIRM,
                      ArObjectStatusEnum.MINTED,
                    ],
                  },
                },
                orderBy: {
                  orderNumber: "asc",
                },
              },
            },
            {},
            0,
            1000
          ),
        };
      },
    });
  },
});
