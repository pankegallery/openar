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
import {ArrowLink} from "~/components/ui";
import pick from "lodash/pick";
import { useSSRSaveMediaQuery } from "~/hooks";


export const Artwork = ({ artwork, exhibition }: { artwork: any, exhibition: any }) => {

  const isDesktop = useSSRSaveMediaQuery(
    "(min-width: 75rem)"
  );

  let hasMultipleObjects = artwork.arObjects.legth  > 1

  let artist = artwork.creator?.pseudonym ? artwork.creator?.pseudonym : artwork.creator?.ethAddress;

  console.log("Artwork:", artwork)
  console.log("Exhibition:", exhibition)

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
          HIER KOMMEN BILDER

          UND MODEL VIWER

        </Flex>

        {/* --------- COL: Artwork details) --------- */}
        <Flex
          direction="column"
          className="artworkDetails"
          w={{
            base: "100vw",
            t: "50vw",
            d: "33.3vw"
          }}
          minHeight="100vh"
          bg="var(--chakra-colors-openar-muddygreen)"
          overflowY="auto"
        >
          {/* ======== BOX: Artwork title  ======== */}
          <Box
            className="artworkTitle"
            borderBottom="1px solid white"
            p="6"
          >
            <chakra.h1 textStyle="subtitle">{artwork.title}</chakra.h1>
            <chakra.p textStyle="meta">{artist}</chakra.p>

            {artwork.arObjects[0].askPrice&&
              <chakra.p textStyle="subtitle">{artwork.arObjects[0].askPrice}</chakra.p>
            }

          </Box>

              {/* _____________________________

                  TODO: BUY Button Corner
              _______________________________*/}



          {/* ======== BOX: Artwork objects  ======== */}
          {hasMultipleObjects&&
            <Box
              className="artworkObjects"
              borderBottom="1px solid white"
              p="6"
            >
              ALLE OBJEKTE
              {artwork.arObjects.map((obj)=>{
                <p>obj.key</p>
              })}


            </Box>
          }

          {/* ======== BOX: Artwork description  ======== */}
          <Box
            className="artworkDescription"
            borderBottom="1px solid white"
            p="6"
          >
            <chakra.p textStyle="label" className="label">Artwork description</chakra.p>
            <div dangerouslySetInnerHTML={{__html: artwork.description}} />
          </Box>


          {/* ======== BOX: Artist further link  ======== */}
          {artwork.creator.bio&&
            <Box
              className="artistInfo"
              borderBottom="1px solid white"
              p="6"
            >
              <chakra.p textStyle="label" className="label">About the artist</chakra.p>
              <div dangerouslySetInnerHTML={{__html: artwork.creator.bio}} />
            </Box>
          }


            {/* _____________________________

                  TODO: Artist Info Button Corner
              _______________________________*/}


          {/* ======== BOX: Artwork further link  ======== */}
          {artwork.url&&
            <Box
              className="artworkURL"
              borderBottom="1px solid white"
              p="6"
            >
              <chakra.p textStyle="label" className="label">More information</chakra.p>
              <ArrowLink href={artwork.url}>{artwork.url}</ArrowLink>
            </Box>
          }

          {/* ======== BOX: Artwork video  ======== */}
          {artwork.invalidIteratorState&&
            <Box
              className="artworkVideo"
              borderBottom="1px solid white"
              p="6"
            >
              VIDEO PLAYER HERE
            </Box>
          }

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
          arModels {
            id
            status
            meta
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
      key: params.key,
    },
  });

  if (!data?.artwork) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      artwork: data?.artwork,
      exhibition: data?.exhibition,
    },
  };
};

Artwork.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank mode="light">{page}</LayoutBlank>;
};

export default Artwork;
