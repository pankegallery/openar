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
import {ArtworkListItem, ArtworkDetails, ArtworkImageViewer} from "~/components/frontend";
import {ArrowLink} from "~/components/ui";
import pick from "lodash/pick";
import { useSSRSaveMediaQuery } from "~/hooks";


export const Artwork = ({ artwork, exhibition, okey }: { artwork: any, exhibition: any, okey?: String }) => {

  const isDesktop = useSSRSaveMediaQuery(
    "(min-width: 75rem)"
  );

  const hasMultipleObjects = artwork.arObjects.legth  > 1

  let selectedObject = {}
  if (okey === "initial"){
    selectedObject = artwork.arObjects[0]
  } else {
    selectedObject = artwork.arObjects.find(o => o.key === okey)
  }

  console.log("[... key] sel obj: ", selectedObject)

  let artist = artwork.creator?.pseudonym ? artwork.creator?.pseudonym : artwork.creator?.ethAddress;

//  console.log("Artwork:", artwork)
//  console.log("Exhibition:", exhibition)

  return (
    <>
      <Head>
        <title>{artwork.title} · OpenAR</title>
        <meta
          property="og:title"
          content={`${artwork.title} · OpenAR`}
          key="title"
        />
      </Head>
      {/* --------- Background image (desktop only) --------- */}
      {isDesktop&&
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
      }

      {/* --------- Column Layout --------- */}
      <Flex
        flexWrap="wrap"
        position={{
          base: "relative",
          t: "fixed"
        }}
        className="artwork"
        top="0"
        left="0"
        w="100%"
        p=""
        h={{
          base: "auto",
          t: "100vh"
        }}
        zIndex="200"
        color="white"
        overflow={{
          base: "show",
          t: "hidden",
        }}
      >
        {/* --------- COL: Exhibition (desktop only) --------- */}
        {isDesktop&&
          <Flex
            direction="column"
            className="exhibitionColumn"
          >
            {/* --------- ROW: Header row --------- */}
            <Flex
              w="33.33vw"
              h="var(--openar-header-height-desktop)"
              p="10"
            >
              <Link href={`/e/openar-art`}>
                <a>
                  <Arrow className="arrow" />
                </a>
              </Link>
            </Flex>

            {/* --------- Exhibition title  --------- */}
            <Flex
              borderY="1px solid #fff"
              p="10"
              pb="20"
              w="33.33vw"
              h="33.33vw"
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
          </Flex>
        }
        {/* --------- COL: Artwork images --------- */}
        <Flex
          className="imageViewer light"
          direction="column"
          w={{
            base: "100vw",
            t: "50vw",
            d: "33.3vw"
          }}
          minHeight="70vh"
          bg="white"
          color="var(--chakra-colors-openar-dark)"
          p="6"
          pt="10"
        >
          <Flex
            w="auto"
            mb="10"
          >
            <Link href="/prev">
              <a>
                <Arrow className="arrow" />
              </a>
            </Link>
            <Link href="/next" passHref>
              <chakra.a ml="6">
                <Arrow className="arrow right" />
              </chakra.a>
            </Link>
          </Flex>

          <ArtworkImageViewer artwork={artwork} object={selectedObject}/>

        </Flex>

        {/* --------- COL: Artwork details) --------- */}
        <ArtworkDetails artwork={artwork} object={selectedObject} />

      </Flex> {/* Column Layout close*/}

    </>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" }; // TODO: probably we need somehow configure the refresh timeout.
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const client = getApolloClient();

  const artworkQuery = gql`
    query ($key: String!, $slug: String!) {
      artwork(key: $key) {
        id
        key
        title
        description
        status
        creator {
          pseudonym
          ethAddress
          bio
          url
        }
        url
        video
        heroImage {
          id
          meta
          status
        }
        arObjects {
          id
          key
          createdAt
          title
          orderNumber
          status
          askPrice
          editionOf
          heroImage {
            id
            meta
            status
          }
          arModels {
            id
            meta
            type
          }
        }
      }
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
        }
      }
    }`;

    console.log({
      slug: params.slug,
      key: params.key,
    }
    );

  const { data } = await client.query({
    query: artworkQuery,
    variables: {
      slug: params.slug,
      key: params.key[0],
    },
  });

  if (!data?.artwork) {
    return {
      notFound: true,
    };
  }

  const okey = params.key[1] ? params.key[1] : "initial";

  return {
    props: {
      artwork: data?.artwork,
      exhibition: data?.exhibition,
      okey: okey,
    },
  };
};

Artwork.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Artwork;
