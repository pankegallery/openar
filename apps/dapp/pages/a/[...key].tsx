import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react"
import Head from "next/head";
import { gql } from "@apollo/client";

import { LayoutBlank } from "~/components/app";
import { Box, Grid, Flex, chakra } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

import { getApolloClient } from "~/services/apolloClient";

import Arrow from "~/assets/img/arrow.svg";
import { ArtworkDetails,
         ArtworkImageViewer,
         ExhibitionTitleTile } from "~/components/frontend";
import pick from "lodash/pick";
import { ArrowLink } from "~/components/ui";
import { useSSRSaveMediaQuery } from "~/hooks";

function measureDistance(lat1, lon1, lat2, lon2){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

export const Artwork = ({
  artwork,
  okey,
}: {
  artwork: any;
  okey?: String;
}) => {
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  let selectedObject : any = {}
  if (okey === "initial"){
    selectedObject = artwork.arObjects[0]
  } else {
    selectedObject = artwork.arObjects.find(o => o.key === okey)
  }

  const [distanceFromObject, setDistanceFromObject] = useState(-1)
  const [viewInARDisabled, setViewInARDisabled] = useState(selectedObject.isGeolocationEnabled)

  const ARTWORK_RADIUS = 5
  const onUserLocationUpdate = useCallback((lat, lng, accuracy) => {
    if (!selectedObject.isGeolocationEnabled) return
    const distance = measureDistance(selectedObject.lat, selectedObject.lng, lat, lng)
    console.log("Distance is: ", distance)
    setDistanceFromObject(distance)
    if (distance > ARTWORK_RADIUS + accuracy) {
      setViewInARDisabled(true)
    } else {
      setViewInARDisabled(false)
    }    
  }, [setDistanceFromObject, setViewInARDisabled, selectedObject.lat, selectedObject.lng, selectedObject.isGeolocationEnabled])

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
        flexWrap="wrap"
      >
        {/* --------- COL: TODO: Left column (desktop only) --------- */}
        {isDesktop&&
          <Flex
            direction="column"
            className="exhibitionColumn"
          >

          </Flex>
        }
        {/* --------- COL: Artwork images --------- */}
        <Flex
          className="imageViewer light"
          direction="column"
          w={{
            base: "100vw",
            t: "50vw",
            d: "66.66vw"
          }}
          minHeight="70vh"
          h="100%"
          bg="white"
          color="var(--chakra-colors-openar-dark)"
          overflow="auto"
        >

          <ArtworkImageViewer artwork={artwork} object={selectedObject} userDistanceFromObject={distanceFromObject} viewInARDisabled={viewInARDisabled}/>

        </Flex>

        {/* --------- COL: Artwork details) --------- */}
        <ArtworkDetails artwork={artwork} object={selectedObject} onUserLocationUpdate={onUserLocationUpdate} />

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

  // TODO: enable read protection of non published artworks
  const artworkQuery = gql`
    query ($key: String!) {
      artwork(key: $key) {
        createdAt
        id
        key
        title
        description
        status
        creator {
          id
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
          description
          isGeolocationEnabled
          lat
          lng
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
      key: params.key[0],
    },
  });

  // TODO: access protect artwork here
  if (!data?.artwork) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }

  const okey = params.key[1] ? params.key[1] : "initial";

  return {
    props: {
      artwork: data?.artwork,
      okey: okey,
    },
    revalidate: 10,
  };
};

Artwork.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank mode="dark" modeSize="light" size="mobile">{page}</LayoutBlank>;
};

export default Artwork;
