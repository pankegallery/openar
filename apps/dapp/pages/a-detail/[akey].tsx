import type { ReactElement } from "react";
import { useState } from "react";
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
import { ApiImage, ApiArModel } from "~/components/ui";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const Artwork = ({
  artwork,
  exhibition,
}: {
  artwork: any;
  exhibition: any;
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  const startWith =
    artwork?.heroImage && artwork?.heroImage?.id ? "image" : "firstObject";

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
      {/* <Box
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
      </Box> */}
      {/* --------- Column Layout --------- */}
      <Flex
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
        {/* {isDesktop&&
          <Flex
            direction="column"
            className="exhibitionColumn"
          >
            {/* --------- ROW: Header row --------- * /}
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

            {/* --------- Exhibition title  --------- * /}
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
        } */}
        {/* --------- COL: Artwork images --------- */}
        <Flex
          direction="column"
          height="100vh"
          overflowY="auto"
          w={{
            base: "100vw",
            t: "50vw",
            d: "33.33vw",
          }}
        >
          <Box w="100%">
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              slidesPerView={1}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
              simulateTouch={false}
              thumbs={{ swiper: thumbsSwiper }}
            >
              {startWith === "image" && (
                <SwiperSlide key="heroImage">
                  <ApiImage
                    id={artwork?.heroImage?.id}
                    meta={artwork?.heroImage?.meta}
                    status={artwork?.heroImage?.status}
                    alt={artwork?.title}
                    sizes="(min-width: 75rem) 33.33vw, (min-width: 45rem) 50vw, 100vw"
                    forceAspectRatioPB={100}
                  />
                </SwiperSlide>
              )}
              {artwork?.arObjects.length > 0 &&
                artwork?.arObjects.map((arObject, i) => {
                  if (!arObject?.arModels?.length) return <></>;

                  const [urlGlb, urlUsdz] = arObject?.arModels.reduce(
                    (acc: string[], model: any) => {
                      if (model.type === "glb")
                        return [model?.meta?.originalFileUrl, acc[1]];

                      if (model.type === "usdz")
                        return [acc[0], model?.meta?.originalFileUrl];
                    },
                    [undefined, undefined]
                  );

                  return (
                    <SwiperSlide key={`arObjct${i}`}>
                      <ApiArModel
                        urlGlb={urlGlb}
                        urlUsdz={urlUsdz}
                        alt={arObject?.title}
                        loading="interaction"
                        reveal="auto"
                      />
                    </SwiperSlide>
                  );
                })}
            </Swiper>

            <Swiper
              modules={[Thumbs]}
              watchSlidesProgress
              onSwiper={setThumbsSwiper}
              slidesPerView={4}
              freeMode={true}
            >
              {startWith === "image" && (
                <SwiperSlide key="heroImage">
                  <ApiImage
                    id={artwork?.heroImage?.id}
                    meta={artwork?.heroImage?.meta}
                    status={artwork?.heroImage?.status}
                    alt={artwork?.title}
                    sizes="(min-width: 75rem) 10vw, (min-width: 45rem) 18vw, 28vw"
                    forceAspectRatioPB={100}
                  />
                </SwiperSlide>
              )}
              {artwork?.arObjects.length > 0 &&
                artwork?.arObjects.map((arObject, i) => {
                  console.log(arObject);
                  if (!arObject?.heroImage) return <></>;

                  return (
                    <SwiperSlide key={`arObjctT${i}`}>
                      <ApiImage
                        id={arObject?.heroImage?.id}
                        meta={arObject?.heroImage?.meta}
                        status={arObject?.heroImage?.status}
                        alt={arObject?.title}
                        sizes="(min-width: 75rem) 10vw, (min-width: 45rem) 18vw, 28vw"
                        forceAspectRatioPB={100}
                      />
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </Box>
        </Flex>

        {/* --------- COL: Artwork details) --------- */}
        <Flex direction="column"></Flex>
      </Flex>{" "}
      {/* Column Layout close*/}
    </>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" }; // TODO: probably we need somehow configure the refresh timeout.
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const client = getApolloClient();

  // TODO: enable read protection of non published artworks
  const artworkQuery = gql`
    query ($key: String!) {
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
          profileImage {
            id
            meta
            status
          }
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
            meta
            type
          }
        }
      }
    }
  `;

  const { data } = await client.query({
    query: artworkQuery,
    variables: {
      key: params.akey,
    },
  });

  // TODO: access protect artwork here
  if (!data?.artwork) {
    return {
      notFound: true,
    };
  }

  console.log(data?.artwork);
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
