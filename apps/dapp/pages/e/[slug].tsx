import type { ReactElement } from "react";
import Head from "next/head";
import { gql } from "@apollo/client";

import { LayoutBlank } from "~/components/app";
import { Box, Grid, Flex, chakra } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

import { getApolloClient } from "~/services/apolloClient";

import openingBg from "~/assets/img/opening-bg.png";
import Arrow from "~/assets/img/arrow.svg";

export const Exhibition = ({ exhibition }: { exhibition: any }) => {
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
      <Box position="fixed" zIndex="100" h="100vh" w="100%" overflow="hidden">
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
        position="fixed"
        backgroundImage="url(/image/opening-bg.png)"
        className="exhibition"
        top="0"
        left="0"
        w="100%"
        p=""
        h="100vh"
        zIndex="200"
        templateRows={{
          base: "66.66vw 66.66vw auto",
          t: "var(--openar-header-height-desktop) 50vw auto",
          d: "var(--openar-header-height-desktop) 33.33vw auto",
        }}
        color="white"
        overflow="hidden"
      >
        {/* --------- Header row --------- */}
        <Flex
          w="100%"
          direction="row"
          p={{
            base: "6",
            t: "10",
          }}
        >
          <Link href="/">
            <a>
              <Arrow className="arrow" />
            </a>
          </Link>
        </Flex>
        {/* --------- Exhibition title and arrows --------- */}
        <Flex
          className="main"
          w="100%"
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
            borderTop="1px solid #fff"
            borderRight="1px solid #fff"
            borderLeft={{
              base: "none",
              d: "1px solid #fff",
            }}
            p={{
              base: "6",
              t: "10",
            }}
            pb={{
              base: "6",
              t: "20",
            }}
            w={{
              base: "66.66vw",
              t: "50vw",
              d: "calc(33.33vw + 1px)",
            }}
            h={{
              base: "calc(66.66vw - 1px)",
              t: "calc(50vw - 1px)",
              d: "calc(33.33vw - 1px)",
            }}
            layerStyle="backdropDark"
            flexDirection="column"
            alignContent="flex-end"
          >
            <Link href="/e/openar-art" passHref>
              <chakra.a display="block" mt="auto">
                <chakra.h1 textStyle="worktitle" mt="auto" mb="2rem">
                  {exhibition.title}
                </chakra.h1>
                <chakra.p textStyle="subtitle" mb="1rem">
                  {exhibition.subtitle}
                </chakra.p>
                <chakra.p textStyle="workmeta">
                  {new Date(exhibition.dateBegin).toLocaleDateString("de")}{" - "}
                  {new Date(exhibition.dateEnd).toLocaleDateString("de")}
                </chakra.p>
              </chakra.a>
            </Link>
          </Flex>
          {/* --------- Description  --------- */}
          <Flex
            w={{
              base: "calc(33.33vw - 2px)",
              t: "calc(50vw - 2px)",
              d: "calc(33.33vw - 2px)",
            }}
            p="6"
            h={{
              base: "66.66vw",
              t: "50vw",
              d: "33.33vw",
            }}
            borderTop="1px solid #fff"
            borderBottom="1px solid #fff"
            layerStyle="backdropBlurred"
          >
            <chakra.p my="auto !important" fontWeight="normal">
              {exhibition.description}
            </chakra.p>
          </Flex>
        </Flex>
        {/* --------- Footer  --------- */}
        <Flex
          className="footer"
          p="6"
          pr="10"
          layerStyle="backdropGradient"
          w={{
            base: "66.66vw",
            t: "50vw",
            d: "33.33vw",
          }}
          borderRight="1px solid #fff"
          borderLeft={{
            t: "1px solid #fff",
          }}
          justifySelf={{
            base: "start",
            t: "start",
            d: "center",
          }}
          textAlign="right"
        >
          <chakra.p textStyle="bigLabel" ml="auto">
            Artworks
          </chakra.p>
          <Arrow className="arrow down" />
        </Flex>
      </Grid>
      <Flex
        className="artworks"
        layerStyle="backdropLight"
        position="absolute"
        zIndex="210"
        top="var(--openar-header-height-desktop)"
        left={{
          base: "0",
          d: "66.66vw",
        }}
        w={{
          base: "calc(33.33vw - 2px)",
          t: "calc(50vw - 2px)",
          d: "calc(33.33vw - 2px)",
        }}
        h={{
          base: "auto",
          d: "calc(100vh - var(--openar-header-height-desktop)",
        }}
        p="6"
        flexDirection="column"
      >
        <Box>ARTWORKS HERE</Box>
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
