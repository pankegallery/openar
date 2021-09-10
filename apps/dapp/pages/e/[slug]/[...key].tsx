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
import { ArtworkDetails,
         ArtworkImageViewer,
         ExhibitionTitleTile } from "~/components/frontend";
import { ArrowLink } from "~/components/ui";
import pick from "lodash/pick";
import { useSSRSaveMediaQuery } from "~/hooks";


export const Artwork = ({ artwork, exhibition, okey }: { artwork: any, exhibition: any, okey?: String }) => {

  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  // _____________ Get prev/next artwork _____________


  const thisArtworkIndex = exhibition.artworks.findIndex((a) => a.key === artwork.key)
      console.log("[... key] index: ", thisArtworkIndex)

  let nextArtworkKey
  (thisArtworkIndex == exhibition.artworks.length - 1) ?
    nextArtworkKey =  exhibition.artworks[0].key :
    nextArtworkKey =  exhibition.artworks[thisArtworkIndex + 1].key
    console.log("[... key] next: ",  nextArtworkKey)

  let prevArtworkKey
  (thisArtworkIndex === 0) ?
    prevArtworkKey =  exhibition.artworks[exhibition.artworks.length].key :
    prevArtworkKey =  exhibition.artworks[thisArtworkIndex + -1].key
    console.log("[... key] prev: ", prevArtworkKey)


  // _____________ Get initial or selected object _____________

  let selectedObject = {}
  if (okey === "initial"){
    selectedObject = artwork.arObjects[0]
  } else {
    selectedObject = artwork.arObjects.find(o => o.key === okey)
  }

  // _____________ Debugging logs _____________

//  console.log("[... key] sel obj: ", selectedObject)
//  console.log("[... key] artwork: ", artwork)
  console.log("[... key] ex: ", exhibition)


  // _____________ RETURN _____________

  return (
    <>
      <Head>
        <title>{artwork.title} · Ope  nAR</title>
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
              justifyContent="flex-end"
            >
              <ExhibitionTitleTile exhibition={exhibition} />
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
          h="100%"
          bg="white"
          color="var(--chakra-colors-openar-dark)"
          pt="10"
          overflow="auto"
        >
          <Flex
            w="auto"
            mb="10"
            px="6"
          >
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
  return <LayoutBlank mode="dark" modeSize="light" size="mobile">{page}</LayoutBlank>;
};

export default Artwork;
