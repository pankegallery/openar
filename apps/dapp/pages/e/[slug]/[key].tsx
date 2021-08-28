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
import {ArtworkListItem} from "~/components/frontend";
import pick from "lodash/pick";
import { useSSRSaveMediaQuery } from "~/hooks";


export const Artwork = ({ artwork, exhibition }: { artwork: any, exhibition: any }) => {

  const isDesktop = useSSRSaveMediaQuery(
    "(min-width: 75rem)"
  );

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

      {/* --------- Column Layout --------- */}
      <Flex
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
              <Link href="/">
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
          direction="column"
          bg="white"

        >
        </Flex>

        {/* --------- COL: Artwork details) --------- */}
        <Flex
          direction="column"
        >
      </Flex>

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
        }
      }
      exhibition(slug:  $slug) {
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
        artworks {
          id
          key
          title
          description
          creator {
            id
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
    }`;

  const { data } = await client.query({
    query: artworkQuery,
    variables: {
      slug: params.slug,
      key: params.key,
    },
  });

  if (!data?.artwork) {
    return {
      notFound: true,
    };
  }

  console.log(data)

  return {
    props: {
      artwork: data?.artwork,
      exhibition: data?.exhibition,
    },
  };
};

Artwork.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Artwork;
