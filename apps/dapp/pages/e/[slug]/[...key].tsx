import type { ReactElement } from "react";
import Head from "next/head";
import { gql } from "@apollo/client";

import { LayoutBlank } from "~/components/app";
import { Box, Flex, chakra } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

import { getApolloClient } from "~/services/apolloClient";

import openingBg from "~/assets/img/opening-bg.png";
import Arrow from "~/assets/img/arrow.svg";
import {
  ArtworkDetails,
  ArtworkImageViewer,
  ExhibitionTitleTile,
} from "~/components/frontend";

import { useSSRSaveMediaQuery } from "~/hooks";

export const Artwork = ({
  artwork,
  exhibition,
  okey,
}: {
  artwork: any;
  exhibition: any;
  okey?: String;
}) => {
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  // _____________ Get prev/next artwork _____________

  const thisArtworkIndex = exhibition.artworks.findIndex(
    (a: any) => a.key === artwork.key
  );

  const prevArtworkKey = exhibition?.artworks?.[
    thisArtworkIndex === 0 ? exhibition.artworks.length - 1 : thisArtworkIndex - 1
  ]?.key;

  const nextArtworkKey = exhibition?.artworks?.[
    thisArtworkIndex === exhibition.artworks.length - 1 ? 0 : thisArtworkIndex + 1
  ]?.key;
  
  // _____________ Get initial or selected object _____________

  let selectedObject = {};
  if (okey === "initial") {
    selectedObject = artwork.arObjects[0];
  } else {
    selectedObject = artwork.arObjects.find((o: any) => o.key === okey);
  }

  // _____________ RETURN _____________

  return (
    <>
      <Head>
        <title>{artwork.title} · Ope nAR</title>
        <meta
          property="og:title"
          content={`${artwork.title} · OpenAR`}
          key="title"
        />
      </Head>
      {/* --------- Background image (desktop only) --------- */}
      {isDesktop && (
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
      )}
      {/* --------- Column Layout --------- */}
      <Flex
        flexWrap="wrap"
        position={{
          base: "relative",
          t: "fixed",
        }}
        className="artwork"
        top="0"
        left="0"
        w="100%"
        p=""
        h={{
          base: "auto",
          t: "100vh",
        }}
        zIndex="200"
        color="white"
        overflow={{
          base: "show",
          t: "hidden",
        }}
      >
        {/* --------- COL: Exhibition (desktop only) --------- */}
        {isDesktop && (
          <Flex direction="column" className="exhibitionColumn">
            {/* --------- ROW: Header row --------- */}

            <Flex w="33.33vw" h="var(--openar-header-height-desktop)" p="10">
              <Link href={`/e/${exhibition.slug}`}>
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
              justifyContent="flex-end"
            >
              <ExhibitionTitleTile exhibition={exhibition} />
            </Flex>
          </Flex>
        )}
        {/* --------- COL: Artwork images --------- */}
        <Flex
          className="imageViewer light"
          direction="column"
          w={{
            base: "100vw",
            t: "50vw",
            d: "33.3vw",
          }}
          minHeight="70vh"
          h="100%"
          bg="white"
          color="var(--chakra-colors-openar-dark)"
          pt="10"
          overflow="auto"
        >
          {exhibition.artworks.length > 1 && (
            <Flex w="auto" mb="10" px="6">
              <Link href={`/e/${exhibition.slug}/${prevArtworkKey}`}>
                <a>
                  <Arrow className="arrow" />
                </a>
              </Link>
              <Link href={`/e/${exhibition.slug}/${nextArtworkKey}`} passHref>
                <chakra.a ml="6">
                  <Arrow className="arrow right" />
                </chakra.a>
              </Link>
            </Flex>
          )}

          <ArtworkImageViewer artwork={artwork} object={selectedObject} />
        </Flex>

        {/* --------- COL: Artwork details) --------- */}
        <ArtworkDetails artwork={artwork} object={selectedObject} />
      </Flex>{" "}
      {/* Column Layout close*/}
    </>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" }; 
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const client = getApolloClient();

  const artworkQuery = gql`
    query ($key: String!, $slug: String!) {
      artwork(key: $key) {
        createdAt
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
          description
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
        type
        subtitle
        description
        dateBegin
        dateEnd
        status
        artworks {
          id
          key
          title
        }
        curators {
          orderNumber
          user {
            pseudonym
            id
            ethAddress
            bio
            profileImage {
              id
              status
              meta
            }
          }          
        }
      }
    }
  `;

  const { data } = await client.query({
    query: artworkQuery,
    variables: {
      slug: params.slug,
      key: params.key[0],
    },
  });

  if (
    !data ||
    !data?.artwork ||
    !data?.exhibition ||
    !data?.exhibition?.artworks ||
    data?.exhibition?.artworks.length === 0
  ) {
    return {
      notFound: true,
      revalidate: 240,
    };
  }

  const okey = params.key[1] ? params.key[1] : "initial";

  return {
    props: {
      artwork: data?.artwork,
      exhibition: data?.exhibition,
      okey: okey,
    },
    revalidate: 240, 
  };
};

Artwork.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutBlank mode="dark" modeSize="light" size="mobile">
      {page}
    </LayoutBlank>
  );
};

export default Artwork;
