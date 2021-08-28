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
import { ArtworkListItem } from "~/components/frontend";
import pick from "lodash/pick";
import { useSSRSaveMediaQuery } from "~/hooks";


export const Artwork = ({ artwork }: { artwork: any }) => {

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
          src={exhibition.openingBg}
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
<<<<<<< HEAD
          d: "fixed",
=======
          t: "fixed"
>>>>>>> 1db5b7df67ec8bfa1823085cf3e1be78fb4e3bd7
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
        >
        </Flex>

        {/* --------- COL: Artwork details) --------- */}
        <Flex
<<<<<<< HEAD
          className="main"
          w={{
            base: "100%",
            d: "66.66vw",
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
            borderTop="1px solid #fff"
            borderBottom="1px solid #fff"
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
              base: "66.66vw",
              t: "50vw",
              d: "33.33vw",
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
                  {new Date(exhibition.dateBegin).toLocaleDateString("de")}
                  {" - "}
                  {new Date(exhibition.dateEnd).toLocaleDateString("de")}
                </chakra.p>
              </chakra.a>
            </Link>
          </Flex>
          {/* --------- Description  --------- */}
          <Flex
            w={{
              base: "100%",
              t: "calc(50vw - 2px)",
              d: "calc(33.33vw - 2px)",
            }}
            p="6"
            h={{
              base: "calc(66.66vw + 2px)",
              t: "50vw",
              d: "33.33vw",
            }}
            borderTop="1px solid #fff"
            borderBottom="1px solid #fff"
            layerStyle="backdropBlurred"
            order={{
              base: "3",
              t: "inherit",
            }}
            overflow="scroll"
          >
            <chakra.p my="auto !important" fontWeight="normal">
              {exhibition.description}
            </chakra.p>
          </Flex>
          {/* --------- Footer  --------- */}
          <Flex
            className="footer"
            p="6"
            pr="10"
            layerStyle="backdropGradient"
            w={{
              base: "33.33vw",
              t: "50vw",
              d: "33.33vw",
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
              base: "66.66vw",
              t: "100%",
            }}
            ml={{
              base: "0",
              d: "auto",
            }}
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
        className="artworks"
        layerStyle="backdropLight"
        position={{
          base: "relative",
          d: "fixed",
        }}
        overflow={{
          base: "show",
          d: "scroll",
        }}
        zIndex="210"
        top={{
          base: "auto",
          d: "var(--openar-header-height-desktop)",
        }}
        left={{
          base: "0",
          d: "66.66vw",
        }}
        w={{
          base: "100%",
          d: "calc(33.33vw - 2px)",
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
                  key={`aw-${artwork.id}`}
                  isAdmin={false}
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
=======
          direction="column"
        >
      </Flex>

      </Flex> {/* Column Layout close*/}

>>>>>>> 1db5b7df67ec8bfa1823085cf3e1be78fb4e3bd7
    </>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" }; // TODO: probably we need somehow configure the refresh timeout.
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const client = getApolloClient();

<<<<<<< HEAD
  const exhibitionQuery = gql`
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
            metagit 
            status
          }
        }
      }
      exhibition(slug:  $slug) {
=======
  const artworkQuery = gql`
    query ($slug: String!) {
      artwork(key: $slug) {
>>>>>>> 1db5b7df67ec8bfa1823085cf3e1be78fb4e3bd7
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
      key: params.key,
      slug: params.slug,
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
    },
  };
};

Artwork.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Artwork;
