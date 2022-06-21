/// <reference path="../../types/nexus-typegen.ts" />
// import { parseResolveInfo } from "graphql-parse-resolve-info";
// import { Prisma } from "@prisma/client";
// import { filteredOutputByWhitelist } from "../../utils";

import dedent from "dedent";
import {
  objectType,
  extendType,
  //   inputObjectType,
  nonNull,
  stringArg,
  intArg,
  arg,
  list,
} from "nexus";

import httpStatus from "http-status";
import { ApiError } from "../../utils";

import { GQLJson } from "./nexusTypesShared";

// import { authorizeApiUser } from "../helpers";

import { getApiConfig } from "../../config";

import {
  daoArtworkQuery,
  daoUserSelectFindFirst,
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

const apiConfig = getApiConfig();

export const ExhibitionCurator = objectType({
  name: "ExhibitionCurator",
  definition(t) {
    t.int("orderNumber");
    t.field("user", {
      type: "User",
    });
  },
});

const exhibitions: any = {
  "outside-in": async () => {
    return {
      id: 2,
      title: "Outside In",
      slug: "outside-in",
      imgUrl:
        "https://baserow.panke.gallery/media/user_files/p4Pyi5XD5DbUv6fBLE5td7sNesLd6VAL_e3689dfa15db995316664f7e80620857cc4dcbef8a57f3b9cafb9b35ab99985a.png",
      imgPosition: "center top",
      type: "groupshow",
      curators: [
        {
          orderNumber: 1,
          user: await daoUserSelectFindFirst(
            { ethAddress: "0xda61e47e66f5f208594fda6a0c2ef6994a93cf59" },
            {
              id: true,
              ethAddress: true,
              pseudonym: true,
              bio: true,
              profileImage: {
                select: {
                  status: true,
                  id: true,
                  meta: true,
                },
              },
            },
            true
          ),
        },
        {
          orderNumber: 2,
          user: await daoUserSelectFindFirst(
            { ethAddress: "0xef8d44e54d8be26a55a2b13e1e055019182b3824" },
            {
              id: true,
              ethAddress: true,
              pseudonym: true,
              profileImage: {
                select: {
                  status: true,
                  id: true,
                  meta: true,
                },
              },
            },
            true
          ),
        },
      ],
      dateBegin: new Date("2022-06-22 12:00"),
      dateEnd: new Date("2022-08-20 12:00"),
      description:
        '"Outside In" explores the augmented possibilities of reality. Spatial software introduced new materialities and perspectives to people’s perceptions. Humans are spatial creatures. We experience most of our lives in relation to space. Manuel Rossner’s work "Spatial Painting (Rosa-Luxemburg-Platz)" no longer distinguishes between the real world and the alternative world, but experiences space simultaneously as a physical dimension, virtual image and hyperreal medium. His drawings, created in VR, interfere with the location. Damjanski’s piece "Inside: Spatial Painting (Rosa-Luxemburg-Platz)" stands in dialogue to Manuel’s piece and gives visitors access to experience the work from the inside. A perspective that wouldn’t have been possible with AR technology. Both pieces complement each other by giving visitors a new spatial experience.',
      status: ExhibitionStatusEnum.PUBLISHED,
      // TODO: Arworks should also be listed by an order number ...
      artworks: await daoArtworkQuery(
        {
          status: {
            in: [
              ArtworkStatusEnum.PUBLISHED,
              ArtworkStatusEnum.HASMINTEDOBJECTS,
            ],
          },
          isPublic: true,
          key: {
            in: ["xKDVchzeldH8PXnE", "yD9OC0VzNcOA12jW"],
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
  "openar-art": async () => {
    return {
      id: 1,
      title: "OpenAR.art",
      slug: "openar-art",
      subtitle: "A groupshow curated by Sakrowski and Jeremy Bailey",
      imgUrl:
        "https://baserow.panke.gallery/media/user_files/kdMDZeqrEhGUOXeeaH9ymxJhKyK928R4_c64bd567451c1a69d4bb5b2bfae136df9661680694d32d8917921d5cbfd58d74.png",
      imgPosition: "center bottom",
      type: "groupshow",
      curators: [
        {
          orderNumber: 1,
          user: await daoUserSelectFindFirst(
            { ethAddress: "0xa358ba0c9777fa51340005c90511db0f193122e6" }, // Sakrowski
            {
              id: true,
              ethAddress: true,
              pseudonym: true,
              bio: true,
              profileImage: {
                select: {
                  status: true,
                  id: true,
                  meta: true,
                },
              },
            },
            true
          ),
        },
        {
          orderNumber: 2,
          user: await daoUserSelectFindFirst(
            { ethAddress: "0xa64b8a46236e7e14d0f33031ad21a88d0b93850c" }, // Jeremy Baley
            {
              id: true,
              ethAddress: true,
              pseudonym: true,
              profileImage: {
                select: {
                  status: true,
                  id: true,
                  meta: true,
                },
              },
            },
            true
          ),
        },
      ],
      dateBegin: new Date("2021-08-29 12:00"),
      dateEnd: new Date("2021-10-04 12:00"),
      description:
        "On the occasion of the launch of the new platform “openar.art”, panke.gallery presents a hybrid group exhibition with experimental Augmented Reality works. The exhibition and platform have been developed in collaboration between workshop participants and digital artists Jeremy Bailey, Sarah Buser and Tamás Páll. The works examine the possibilities of AR technology in artistic applications. Visual, acoustic and performative Augmented Reality formats can be experienced in the exhibition.",
      status: ExhibitionStatusEnum.PUBLISHED,
      // TODO: Arworks should also be listed by an order number ...
      artworks: await daoArtworkQuery(
        {
          status: {
            in: [
              ArtworkStatusEnum.PUBLISHED,
              ArtworkStatusEnum.HASMINTEDOBJECTS,
            ],
          },
          isPublic: true,
          key: {
            in: [
              "mjHQTN4VoyPRwBSk",
              "zqKV7VfoPXzFeZnN",
              "Yq2kXKW4YuwVSkrn",
              "jyKxfKBIt3tEkOyZ",
              "RVRHLyKFhk8jmeUN",
              "5IhBsxhzTw5aO8xJ",
              "yj9LVvzSilavLy3f",
              "649ddyQ3SF3Kz8SS",
              "HSMSPAQ20ljzbQlt",
              "8lNCQ7QZ00sNrO6c",
              "h0JnLBknAIMXFDYq",
            ],
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
};

export const Exhibition = objectType({
  name: "Exhibition",
  definition(t) {
    t.nonNull.int("id");
    t.json("title");
    t.json("slug");
    t.string("type");
    t.string("imgPosition");
    t.string("imgUrl");
    t.string("description");
    t.date("dateBegin");
    t.date("dateEnd");
    t.nonNull.int("status");

    t.list.field("curators", {
      type: "ExhibitionCurator",
    });

    t.list.field("artworks", {
      type: "Artwork",
    });

    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const ExhibitionQueryResult = objectType({
  name: "ExhibitionQueryResult",
  description: dedent`
    List all the exhibitions in the database.
  `,
  definition: (t) => {
    t.int("totalCount");
    t.field("exhibitions", {
      type: list("Exhibition"),
    });
  },
});

export const EventQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("exhibitions", {
      type: ExhibitionQueryResult,

      args: {
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

      async resolve() {
        const activeExhibitionsFunctions: any[] = Object.keys(
          exhibitions
        ).reduce((acc: any, key: any) => {
          if (typeof exhibitions[key] === "function")
            acc.push(
              new Promise(async (resolve, reject) => {
                try {
                  const ex = await exhibitions[key].call(null);
                  resolve(ex);
                } catch (err) {
                  reject(err);
                }
              })
            );

          return acc;
        }, [] as any);

        const activeExhibitions = await Promise.all(activeExhibitionsFunctions);

        return {
          totalCount: activeExhibitions.length,
          exhibitions: activeExhibitions,
        };
      },
    });

    t.nonNull.field("exhibition", {
      type: "Exhibition",

      args: {
        slug: nonNull(stringArg()),
      },

      async resolve(...[, args]) {
        if (
          !(args.slug in exhibitions) ||
          typeof exhibitions[args.slug] !== "function"
        )
          throw new ApiError(httpStatus.NOT_FOUND, "Not found");

        const exhibition = await exhibitions[args.slug].call(null);
        return exhibition;
      },
    });
  },
});
