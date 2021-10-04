import type { ReactElement } from "react";
import { useRef } from "react";

import Head from "next/head";
import { gql } from "@apollo/client";

import { LayoutBlank } from "~/components/app";
import {
  Box,
  Grid,
  Flex,
  LinkBox,
  LinkOverlay,
  chakra,
} from "@chakra-ui/react";
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
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");
  const refArtworksWrapper = useRef(null);

  const scrollToArtworks = () => {
    if (typeof window === "undefined") return;

    if (isDesktop) {
      // smooth scoll the arwork listing
      refArtworksWrapper.current.scrollTo({
        top: Math.min(window.innerHeight * 66.66, 600),
        behavior: "smooth",
      });
    } else {
      // smooth scoll the page to artwork listing
      refArtworksWrapper.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

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
        zIndex="200"
        templateRows={{
          base: "33.33vw auto",
          t: "var(--openar-header-height-desktop) auto",
          d: "var(--openar-header-height-desktop) auto",
        }}
        templateColumns="1fr"
        minH="100%"
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
            d: "66.66%",
          }}
          ml={{
            base: "0",
            t: "0",
            d: "0",
          }}
          borderBottom={{
            base: "1px solid #fff",
            d: "none",
          }}
          flexWrap="wrap"
          direction="row"
          zIndex="302"
        >
          {/* --------- Exhibition title  --------- */}
          <Flex
            w={{
              base: "66.666%",
              t: "50%",
              d: "50%",
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
              <ExhibitionTitleTile exhibition={exhibition} link={false} />
            </Flex>
          </Flex>
          {/* --------- Description  --------- */}
          <Flex
            w={{
              base: "100%",
              t: "50%",
              d: "50%",
            }}
            h={{
              base: "100vw",
              t: "50vw",
              d: "33.33vw",
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
              overflowY="auto"
              h="100%"
              borderTop={{
                base: "none",
                t: "1px solid #fff",
              }}
              borderBottom="1px solid #fff"
              borderRight={{
                base: "none",
                d: "1px solid #fff",
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
              base: "33.333%",
              t: "50%",
              d: "calc(50% + 1px)",
            }}
            borderRight="1px solid #fff"
            borderLeft={{
              base: "0",
              d: "1px solid #fff",
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
            flexDirection={{
              base: "column",
              t: "row",
            }}
            onClick={() => scrollToArtworks()}
            cursor="pointer"
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
        ref={refArtworksWrapper}
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
          d: "66.66%",
        }}
        w={{
          base: "100%",
          d: "33.33%",
        }}
        h={{
          base: "auto",
          d: "calc(100vh - var(--openar-header-height-desktop))",
        }}
        borderTop={{
          d: "1px solid #fff",
        }}
        flexDirection="column"
      >
        <Box>
          {exhibition.artworks.length > 0 && (
            <Flex width="100%" flexWrap="wrap">
              {" "}
              {exhibition.artworks.map((artwork) => {
                let image = artwork?.heroImage;
                if (!image) {
                  if (
                    artwork?.arObjects &&
                    Array.isArray(artwork?.arObjects) &&
                    artwork?.arObjects.length > 0
                  ) {
                    image = artwork?.arObjects[0].heroImage;                    
                  }
                }
                return (
                  <ArtworkListItem
                    col="1-or-2"
                    isAdmin={false}
                    exSlug={exhibition.slug}
                    urlKey={artwork.key}
                    key={artwork.key}
                    heroImage={image}
                    {...pick(artwork, [
                      "id",
                      "status",
                      "title",
                      "creator",
                    ])}
                  />
                );
              })}
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
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
          arObjects {
            id
            status
            heroImage {
              id
              meta
              status
            }
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

  if (
    !data?.exhibition ||
    !data?.exhibition?.artworks ||
    data?.exhibition?.artworks.length === 0
  ) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      exhibition: data?.exhibition,
    },
    revalidate: 240,
  };
};

Exhibition.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Exhibition;
