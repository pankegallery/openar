import type { ReactElement } from "react";
import Head from "next/head";
import { gql } from "@apollo/client";

import { LayoutBlank } from "~/components/app";
import { Box,
        Grid,
        Flex,
        LinkBox,
        LinkOverlay,
        chakra } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { useSSRSaveMediaQuery } from "~/hooks";

import { getApolloClient } from "~/services/apolloClient";

import openingBg from "~/assets/img/opening-bg.png";
import Arrow from "~/assets/img/arrow.svg";
import { ArtworkListItem } from "~/components/frontend";
import { ExhibitionTitleTile } from "~/components/frontend";
import pick from "lodash/pick";

export const Exhibition = ({ exhibition }: { exhibition: any }) => {
  //TODO: was passiert beim live rendern und nicht bekannten slugs?
  // {
  //   {
  //     "id": 1,
  //     "slug": null,
  //     "title": "OpenAR.art",
  //     "description": "Lorem ipsim",
  //     "subtitle": "Platform launch and groupshow curated by Sakrowski and Jeremy Bailey",
  //     "dateBegin": "2021-08-29T10:00:00.000Z",
  //     "dateEnd": "2021-10-04T10:00:00.000Z",
  //     "status": 2,
  //     "curators": null,
  //     "artworks": [
  //       {
  //         "id": 22,
  //         "key": "RWEOzHzMPehrpgyn",
  //         "title": "TEWS",
  //         "description": "<p>TEST</p>",
  //         "heroImage": {
  //           "id": 42,
  //           "meta": {
  //             "size": 93976,
  //             "mimeType": "image/jpeg",
  //             "imageType": "square",
  //             "uploadFolder": "/img/2021/8",
  //             "availableSizes": {
  //               "original": {
  //                 "url": "http://localhost:4401/img/2021/8/kmsFu-TgGVy6Kp1Lkrug3.jpg",
  //                 "isJpg": true,
  //                 "width": 1280,
  //                 "height": 1279,
  //                 "isWebP": false
  //               },
  //               "720-720-jpg": {
  //                 "url": "http://localhost:4401//img/2021/8/kmsFu-TgGVy6Kp1Lkrug3-720-720.jpg",
  //                 "isJpg": true,
  //                 "width": 720,
  //                 "height": 720,
  //                 "isWebP": false
  //               },
  //               "480-480-webp": {
  //                 "url": "http://localhost:4401//img/2021/8/kmsFu-TgGVy6Kp1Lkrug3-480-480.webp",
  //                 "isJpg": false,
  //                 "width": 480,
  //                 "height": 480,
  //                 "isWebP": true
  //               },
  //               "720-720-webp": {
  //                 "url": "http://localhost:4401//img/2021/8/kmsFu-TgGVy6Kp1Lkrug3-720-720.webp",
  //                 "isJpg": false,
  //                 "width": 720,
  //                 "height": 720,
  //                 "isWebP": true
  //               },
  //               "1080-1080-webp": {
  //                 "url": "http://localhost:4401//img/2021/8/kmsFu-TgGVy6Kp1Lkrug3-1080-1080.webp",
  //                 "isJpg": false,
  //                 "width": 1080,
  //                 "height": 1080,
  //                 "isWebP": true
  //               }
  //             },
  //             "originalFileUrl": "http://localhost:4401/img/2021/8/kmsFu-TgGVy6Kp1Lkrug3.jpg",
  //             "originalFileName": "fa-pnk-195.jpg",
  //             "originalFilePath": "/Users/fluxed/Dropbox/www/fluxed/openar/openar-monorepo/public/img/2021/8/kmsFu-TgGVy6Kp1Lkrug3.jpg"
  //           },
  //           "status": 4
  //         }
  //       }
  //     ]
  //   }
  // }

  const isDesktop = useSSRSaveMediaQuery(
    "(min-width: 75rem)"
  );

  const scrollToArtworks = () => {
    console.log("I'm here")

    const artworksWrapper = document.querySelector("#artworks");
    const thirdArtwork = document.querySelector("#artworks article:nth-of-type(3)");

    if (isDesktop && thirdArtwork && artworksWrapper) {
      const topPos = thirdArtwork.offsetTop;
      artworksWrapper.scrollTop = {
        top: topPos,
        behavior: 'smooth'
      };
    }
    else if(artworksWrapper) {
      // Smooth scroll to that elment
      artworksWrapper.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
  return (
    <>
      <Head>
        <title>{exhibition.title} · OpenAR</title>
        <meta
          property="og:title"
          content={`${exhibition.title} · OpenAR`}
          key="title"
        />
      </Head>
      {/* --------- Background image --------- */}
      <Box
        position="relative"
        zIndex="100"
        h="100vh"
        w="100%"
        overflow="hidden"
        mb="-100vh"
      >
        <Image
          src={openingBg}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 100%"
          alt=""
          role="presentation"
        />
      </Box>

      {/* --------- Grid --------- */}
      <Grid
        position={{
          base: "relative",
          d: "fixed",
        }}
        className="exhibition"
        top="0"
        left="0"
        w="100%"
        h="100vh"
        zIndex="200"
        templateRows={{
          base: "33.33vw auto",
          t: "var(--openar-header-height-desktop) auto",
          d: "var(--openar-header-height-desktop) auto",
        }}
        color="white"
        overflow="hidden"
      >
        {/* --------- ROW: Header row --------- */}
        <Flex
          w="100%"
          direction="row"
          p={{
            base: "6",
            t: "10",
          }}
        >
          <Link href="/" passHref>
            <a>
              <Arrow className="arrow" />
            </a>
          </Link>
        </Flex>
        {/* --------- GRID: Exhibition title, description, and artwork arrow --------- */}
        <Flex
          className="main"
          w={{
            base: "100%",
            d: "calc(66.66vw - var(--sbw))",
          }}
          ml={{
            base: "0",
            t: "0",
            d: "0",
          }}
          borderBottom="1px solid #fff"
          flexWrap="wrap"
          direction="row"
          zIndex="302"
        >
          {/* --------- Exhibition title  --------- */}
          <Flex
            w={{
              base: "calc(66.66vw - var(--sbw))",
              t: "calc(50vw - var(--sbw))",
              d: "calc(33.33vw)",
            }}
            h={{
              base: "calc(66.66vw - var(--sbw))",
              t: "calc(50vw - var(--sbw))",
              d: "calc(33.33vw - var(--sbw))",
            }}
            layerStyle="backdropDark"
            flexDirection="column"
            alignContent="flex-end"
          >
            <Flex
              w="100%"
              h="100%"
              borderTop="1px solid #fff"
              borderBottom="1px solid #fff"
              borderRight="1px solid #fff"
              p={{
                base: "6",
                t: "10",
              }}
              pb={{
                base: "6",
                t: "20",
              }}
              alignContent="flex-end"
            >
              <ExhibitionTitleTile
                title={exhibition.title}
                subtitle={exhibition.subtitle}
                exSlug="openar-art"
                dateBegin={exhibition.dateBegin}
                dateEnd={exhibition.dateEnd}
                link={false}
              />

            </Flex>
            
          </Flex>
          {/* --------- Description  --------- */}
          <Flex
            w={{
              base: "100%",
              t: "calc(50vw - var(--sbw))",
              d: "calc(33.33vw - var(--sbw))",
            }}
            h={{
              base: "auto",
              t: "calc(50vw - var(--sbw))",
              d: "calc(33.33vw - var(--sbw))",
            }}
            layerStyle="backdropBlurred"
            order={{
              base: 3,
              t: "inherit",
            }}
          >
            <Flex
              p="6"
              overflowX="hidden"
              overflowY={{
                base:"visible",
                t: "auto"
              }}
              minH="100%"
              borderTop={{
                base:"none",
                t: "1px solid #fff"
              }}
              borderBottom="1px solid #fff"

              borderRight={{
                base:"none",
                d:"1px solid #fff"
              }}
            >
              <chakra.p my="auto !important" fontWeight="normal">
                {exhibition.description}
              </chakra.p>
            </Flex>
          </Flex>
          {/* --------- Artworks arrow  --------- */}
          <Flex
            className="artworksArrow"
            p="6"
            pr="10"
            pl={{
              base: "2",
              t: "6",
            }}
            pt={{
              base: "10",
              t: "6",
            }}
            layerStyle="backdropGradient"
            w={{
              base: "calc(33.33vw - var(--sbw))",
              t: "calc(50vw - var(--sbw))",
              d: "calc(33.33vw + 1px - var(--sbw))",
            }}
            borderX={{
              base: "0",
              t: "1px solid #fff",
            }}
            borderY={{
              base: "1px solid #fff",
              t: "none",
            }}
            justifySelf={{
              base: "start",
              t: "end",
              d: "end",
            }}
            textAlign="right"
            h={{
              base: "calc(66.66vw - var(--sbw))",
              t: "100%",
            }}
            ml={{
              base: "0",
              d: "auto",
            }}
            flexDirection={{
              base: "column",
              t: "row",
            }}
            onClick={() => scrollToArtworks()}
          >
            <chakra.p textStyle="bigLabel" ml="auto">
              Artworks
            </chakra.p>
            <Arrow className="arrow down" />
          </Flex>
        </Flex>
      </Grid>
      {/* --------- Artworks  --------- */}
      <Flex
        id="artworks"
        className="artworks"
        layerStyle="backdropLight"
        position={{
          base: "relative",
          d: "fixed",
        }}
        overflowY={{
          base: "visible",
          d: "auto",
        }}
        zIndex="210"
        top={{
          base: "auto",
          d: "var(--openar-header-height-desktop)",
        }}
        left={{
          base: "0",
          d: "calc(66.66vw - var(--sbw))",
        }}
        w={{
          base: "100%",
          d: "calc(33.33vw - var(--sbw))",
        }}
        h={{
          base: "auto",
          d: "calc(100vh - var(--openar-header-height-desktop))",
        }}
        flexDirection="column"
      >
        <Box>
          {exhibition.artworks.length > 0 && (
            <Flex width="100%" flexWrap="wrap">
              {" "}
              {exhibition.artworks.map((artwork) => (
                <ArtworkListItem
                  isAdmin={false}
                  exSlug={exhibition.slug}
                  urlKey={artwork.key}
                  key={artwork.key}
                  {...pick(artwork, [
                    "id",
                    "status",
                    "heroImage",
                    "title",
                    "creator",
                  ])}
                />
              ))}
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" }; // TODO: probably we need somehow configure the refresh timeout.
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const client = getApolloClient();

  const exhibitionQuery = gql`
    query ($slug: String!) {
      exhibition(slug: $slug) {
        id
        slug
        title
        subtitle
        description
        dateBegin
        dateEnd
        status
        curators {
          pseudonym
          id
          ethAddress
          bio
        }
        artworks {
          id
          key
          title
          description
          creator {
            pseudonym
            ethAddress
          }
          heroImage {
            id
            meta
            status
          }
        }
      }
    }
  `;

  const { data } = await client.query({
    query: exhibitionQuery,
    variables: {
      slug: params.slug,
    },
  });

  if (!data?.exhibition) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      exhibition: data?.exhibition,
    },
  };
};

Exhibition.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Exhibition;
