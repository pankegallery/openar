import type { ReactElement } from "react";
import { useState } from "react";
import Head from "next/head";
import { gql } from "@apollo/client";

import { LayoutDeepLink } from "~/components/app";
import { Box, Text, Flex, chakra } from "@chakra-ui/react";
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
import MenuCornerDark from "~/assets/img/menu-corner-dark.svg";

export const ArObject = ({ arObject }: { arObject: any }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  let content = (
    <Flex
      w="100vw"
      h="100%"
      justifyContent="center"
      alignItems="center"
      color="#000"
    >
      <Text>No published object found</Text>
    </Flex>
  );

  let urlPoster = "";
  let urlUsdz = "";
  let urlGlb = "";
  if (arObject?.arModels && arObject?.arModels?.length > 0) {
    
    const [urlGlb, urlUsdz] = arObject?.arModels.reduce(
      (acc: string[], model: any) => {
        if (model.type === "glb") return [model?.meta?.originalFileUrl, acc[1]];

        if (model.type === "usdz")
          return [acc[0], model?.meta?.originalFileUrl];
      },
      [undefined, undefined]
    );

    if (urlGlb || urlUsdz) {
      content = <ApiArModel
        urlGlb={urlGlb}
        urlUsdz={urlUsdz}
        alt={arObject?.title}
        loading="auto"
        reveal="auto"
      />;
    }
  }
   
  return (
    <>
      <Head>
        <title>{arObject.title} · OpenAR</title>
        <meta
          property="og:title"
          content={`${arObject.title} · OpenAR`}
          key="title"
        />
      </Head>

      <Box w="100%" h="100%" bg="#ccc">
        <Box
          className="openOverlayMenu"
          w="100px"
          h="100"
          position="fixed"
          top="0"
          right="0"
          zIndex="300"
          p="0"
          border="0"
          variant="functional"
        >
          {" "}
          <MenuCornerDark
            viewBox="0 0 120 120"
            width="120px"
            height="120px"
            className="menuCorner"
          />
        </Box>

        {content}
      </Box>
    </>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const client = getApolloClient();

  // TODO: enable read protection of non published artworks
  const query = gql`
    query ($key: String!) {
      arObject(key: $key) {
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
        arModels {
          id
          meta
          type
        }
      }
    }
  `;
  
  const { data } = await client.query({
    query: query,
    variables: {
      key: params.okey,
    },
  });

  // TODO: access protect artwork here
  if (!data?.arObject) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      arObject: data?.arObject,
    },
    revalidate: 240, 
  };
};

ArObject.getLayout = function getLayout(page: ReactElement) {
  return <LayoutDeepLink>{page}</LayoutDeepLink>;
};

export default ArObject;
