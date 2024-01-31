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

// TODO: Arworks should also be listed by an order number ...
const getExhibitionArtworks = async (keys: string[]) => {
  const artworks = await daoArtworkQuery(
    {
      status: {
        in: [ArtworkStatusEnum.PUBLISHED, ArtworkStatusEnum.HASMINTEDOBJECTS],
      },
      isPublic: true,
      key: {
        in: keys,
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
  );

  return artworks;
};

const getExhibitionUser = async (ethAddress: string) => {
  const user = await daoUserSelectFindFirst(
    { ethAddress },
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
  );
  return user;
};

const getExhibitionUserById = async (id: number) => {
  const user = await daoUserSelectFindFirst(
    { id },
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
  );
  return user;
};

const exhibitions: any = {
  "geo-1": async () => {
    return {
      id: 5,
      title: "G.E.O. (1)",
      slug: "geo-1",
      imgUrl:
        "https://baserow.panke.gallery/media/user_files/62F6LCevXfByaSk9Tk4Y4oDs7voNk7qJ_b74b2b1adddf0184532f89144ebb73c2d9e3f4d9ab6787d138c509df42306b94.jpg",
      imgPosition: "left center",
      type: "solo exhibition",
      // A group show curated by ABC and BBB
      subtitlePrefix: "A solo exhibition by",
      curators: [
        {
          orderNumber: 1,
          user: await getExhibitionUserById(
            17
          ),
        }
      ],
      dateBegin: new Date("2024-02-01 12:00"),
      dateEnd: new Date("2024-03-03 23:59"),
      description:
        `Joachim Blank's solo exhibition G.E.O. – Geographic Environment Observation – is currently on display at 'Die Moeglichkeit einer Insel' in Berlin, featuring an AR component presented by OpenAR. In 2018, Joachim Blank acquired an archive of the German-language reportage magazine GEO spanning from 1976 to the end of the 1990s. While leafing through the magazines, he captured their contents using his smartphone, forming an independent, digital image archive of more than 3000 pictures. For the exhibition, the artist reused and further processed selected images, hence creating pictures of pictures of pictures. In dialogue with an AI and digital image filters, he created installative images that return to the physical space as large-format fine art prints with epoxy layers. He also reconstructed image fragments into three AR figures with installative interventions in the exhibition space.`,
      status: ExhibitionStatusEnum.PUBLISHED,
        artworks: await getExhibitionArtworks([
        "iP8pp3MSI4Xls0yy", 
      ]),
    };
  },
  "animal-city-unleashed": async () => {
    return {
      id: 4,
      title: "ANIMAL()CITY: Unleashed!",
      slug: "animal-city-unleashed",
      imgUrl:
        "https://baserow.panke.gallery/media/user_files/I4Sv6eNyUim7LKbiEg2aL6csA1nWf5Hg_ea68826944b3ba7df66b390c90c3d50d5c6d607adef341a08429bff47e07aa6b.jpg",
      imgPosition: "center center",
      type: "groupshow",
      // A group show curated by ABC and BBB
      subtitlePrefix: "A group show curated by",
      curators: [
        {
          orderNumber: 1,
          user: await getExhibitionUserById(
            18
          ),
        }
      ],
      dateBegin: new Date("2023-12-27 12:00"),
      dateEnd: new Date("2023-12-30 23:00"),
      description:
        `The immersive exhibition invites you into a world where the urban landscape intertwines with the untamed essence of the wild. Building on the evocative spirit of Animal()City, this iteration takes place against the backdrop of the 37th Chaos Communication Congress (37c3) in Hamburg. Inspired by the nocturnal presence of foxes roaming the streets of Berlin, the exhibition continues to unravel the enigmatic layers of urban environments, where wildlife thrives unseen amidst concrete and neon. Just as online worlds harbor hidden AI entities, the city echoes this intricate web, provoking reflection on merging physical and virtual domains. Redefining the urban canvas, encounters with wildlife remind us of the city's hidden vitality. Enter this spectral realm, where boundaries blur, and the city pulsates with a life both cryptic and familiar.`,
      status: ExhibitionStatusEnum.PUBLISHED,
      artworks: await getExhibitionArtworks([
        "7ewb9Sk5LFW1LJxp", 
        "fhu664SGZOIZNkgU", 
        "1e2YEmKGZIuSkcw1", 
        "JxgpsYXrh1Jy4iPr", 
        "PLea7ibqpwKPiqYj", 
        "jUDh9O3AE05w6XKl",
        "ppfaturQjedBXCk3",
      ]),
    };
  },
  "animal-city": async () => {
    return {
      id: 3,
      title: "Animal()City",
      slug: "animal-city",
      imgUrl:
        "https://baserow.panke.gallery/media/user_files/EvoXClGpi1pvLnUZetcaDRlPSdtOfOfL_5e2e167834bb0c9302fa0df477b42e16e2228c8fad4975b473d5621d4215490d.jpg",
      imgPosition: "center center",
      type: "groupshow",
      // A group show curated by ABC and BBB
      subtitlePrefix: "A group show curated by",
      curators: [
        {
          orderNumber: 1,
          user: await getExhibitionUserById(
            18
          ),
        }
      ],
      dateBegin: new Date("2023-10-12 12:00"),
      dateEnd: new Date("2023-10-28 23:00"),
      description:
        `Animal()City is inspired by the ghostly presence of foxes roaming the city at night – a common sight in Berlin today – evoking echoes of a pre-industrial era while drawing attention to a layer of the city that is completely invisible in everyday life. In these moments we witness animals and plants forming their own realm, and the city having a life of its own, acting like an entity, a ghost at times. Encounters with wild animals in the city make this parallel identity momentarily tangible, making us part of these ‘non-human’ networks while projecting ideas of dystopian, dehumanised cities of the future. The city can also be read as analogous to the Internet. Just as we are divided into threads and channels by platforms online, we also live in multi-layered structures that are haunted by sinister bots and AI agents.`,
      status: ExhibitionStatusEnum.PUBLISHED,
      artworks: await getExhibitionArtworks([
        "I3MUhwLxici21RF5",
        "AI1A7yQdHQlTuNp0",
        "fFllpSvUuvXL7zIo",
        "kUIayNJbpHl5Sa7C",
        "GSpeSfy655rVWERY",
        "Athl28wGaJZRva25",
        "wAjMr9jSxgoZ2QCM",
      ]),
    };
  },
  "outside-in": async () => {
    return {
      id: 2,
      title: "Outside In",
      slug: "outside-in",
      imgUrl:
        "https://baserow.panke.gallery/media/user_files/p4Pyi5XD5DbUv6fBLE5td7sNesLd6VAL_e3689dfa15db995316664f7e80620857cc4dcbef8a57f3b9cafb9b35ab99985a.png",
      imgPosition: "center top",
      type: "groupshow",
      // A group show curated by ABC and BBB
      subtitlePrefix: "A group show by",
      curators: [
        {
          orderNumber: 1,
          user: await getExhibitionUser(
            "0xda61e47e66f5f208594fda6a0c2ef6994a93cf59"
          ),
        },
        {
          orderNumber: 2,
          user: await getExhibitionUser(
            "0xef8d44e54d8be26a55a2b13e1e055019182b3824"
          ),
        },
      ],
      dateBegin: new Date("2022-06-22 12:00"),
      dateEnd: new Date("2022-08-20 12:00"),
      description:
        '"Outside In" explores the augmented possibilities of reality. Spatial software introduced new materialities and perspectives to people’s perceptions. Humans are spatial creatures. We experience most of our lives in relation to space. Manuel Rossner’s work "Spatial Painting (Rosa-Luxemburg-Platz)" no longer distinguishes between the real world and the alternative world, but experiences space simultaneously as a physical dimension, virtual image and hyperreal medium. His drawings, created in VR, interfere with the location. Damjanski’s piece "Inside: Spatial Painting (Rosa-Luxemburg-Platz)" stands in dialogue to Manuel’s piece and gives visitors access to experience the work from the inside. A perspective that wouldn’t have been possible with AR technology. Both pieces complement each other by giving visitors a new spatial experience.',
      status: ExhibitionStatusEnum.PUBLISHED,
      artworks: await getExhibitionArtworks([
        "xKDVchzeldH8PXnE",
        "yD9OC0VzNcOA12jW",
      ]),
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
      subtitlePrefix: "A group show curated by",
      curators: [
        {
          orderNumber: 1,
          user: await getExhibitionUser(
            "0xa358ba0c9777fa51340005c90511db0f193122e6"
          ),
        },
        {
          orderNumber: 2,
          user: await getExhibitionUser(
            "0xa64b8a46236e7e14d0f33031ad21a88d0b93850c"
          ),
        },
      ],
      dateBegin: new Date("2021-08-29 12:00"),
      dateEnd: new Date("2021-10-04 12:00"),
      description:
        "On the occasion of the launch of the new platform “openar.art”, panke.gallery presents a hybrid group exhibition with experimental Augmented Reality works. The exhibition and platform have been developed in collaboration between workshop participants and digital artists Jeremy Bailey, Sarah Buser and Tamás Páll. The works examine the possibilities of AR technology in artistic applications. Visual, acoustic and performative Augmented Reality formats can be experienced in the exhibition.",
      status: ExhibitionStatusEnum.PUBLISHED,
      // TODO: Arworks should also be listed by an order number ...
      artworks: await getExhibitionArtworks([
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
      ]),
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
    t.string("subtitlePrefix");
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