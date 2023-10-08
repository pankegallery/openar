import type { ReactElement } from "react";
import Head from "next/head";
import Router from "next/router";
import { gql } from "@apollo/client";

import { LayoutBlank } from "~/components/app";
import { Box, Grid, Flex, chakra } from "@chakra-ui/react";

import { getApolloClient } from "~/services/apolloClient";

import {
  CollectionList,
  ArtworkList,
  UserDetails,
} from "~/components/frontend";
import { useAuthentication, useSSRSaveMediaQuery } from "~/hooks";
import { getArtistName } from "~/utils";

export const PublicUserProfile = ({
  user,
  artworks,
  collection,
}: {
  user: any;
  artworks: any;
  collection: any;
}) => {
  const [appUser] = useAuthentication();

  console.log("Public User Profile: ", user)

  if (appUser && appUser.id === user.id) {
    Router.replace("/x/");
  }

  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");
  const isTablet = useSSRSaveMediaQuery(
    "(min-width: 45.000001rem) and (max-width: 74.9999rem)"
  );
  const isMobile = useSSRSaveMediaQuery("(max-width: 45rem)");

  const hasArtworks = Array.isArray(artworks) && artworks.length > 0;

  const hasCollection = collection && collection.totalCount > 0;
  const name = getArtistName(user.pseudonym, user.ethAddress);

  const showArtworksUnderDetails =
    (hasArtworks && !isDesktop && hasCollection) || (hasArtworks && isMobile);

  const showArtworksColumn =
    (hasArtworks && isDesktop) || (hasArtworks && isTablet && !hasCollection);

  const showCollectionColumn = hasCollection;
  const showCollectionPlaceholder = !hasCollection && !hasArtworks && !isMobile;

  let collectionColumnWidth = "100%";
  if (isTablet && hasArtworks) {
    collectionColumnWidth = "50%";
  } else if (isDesktop) {
    if (hasArtworks) {
      collectionColumnWidth = "33.33%";
    } else {
      collectionColumnWidth = "66.66%";
    }
  }

  let artworksColumnWidth = "100%";
  if (isTablet && hasCollection) {
    artworksColumnWidth = "50%";
  } else if (isDesktop) {
    if (hasCollection) {
      artworksColumnWidth = "33.33%";
    } else {
      artworksColumnWidth = "66.66%";
    }
  }

  console.log("User is: ", user)

  return (
    <>
      <Head>
        <title>{name} · openAR</title>
        <meta property="og:title" content={`${name} · OpenAR`} key="title" />
      </Head>
      {/* --------- Column Layout --------- */}
      <Flex
        flexWrap="wrap"
        position={{
          base: "relative",
          t: "fixed",
        }}
        className="user"
        top="0"
        left="0"
        w="100%"
        p=""
        h={{
          base: "auto",
          t: "100vh",
        }}
        minHeight={{
          base: "100vh",
        }}
        zIndex="200"
        color="white"
        overflow={{
          base: "show",
          t: "hidden",
        }}
        flexDirection={{
          base: "column-reverse",
          t: "row",
        }}
        layerStyle="backdropMud"
      >
        {/* --------- COL: Collection --------- */}
        {showCollectionColumn && (
          <CollectionList
            userName={name}
            isPublic
            objects={collection.arObjects}
            width={collectionColumnWidth}
            col={!hasArtworks ? 2 : 1}
          />
        )}

        {showCollectionPlaceholder && (
          <CollectionList
            userName={name}
            isPublic
            width={collectionColumnWidth}
            col={!hasArtworks ? 2 : 1}
          />
        )}
        {/* --------- COL: Artworks --------- */}
        {showArtworksColumn && (
          <ArtworkList
            isPublic
            artworks={user.artworks}
            width={artworksColumnWidth}
            col={!hasCollection ? 2 : 1}
          />
        )}

        {/* --------- COL: Artwork details) --------- */}
        <UserDetails
          isPublic
          user={user}
          showArtworks={showArtworksUnderDetails}
        />
      </Flex>
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
  const userQuery = gql`
    query ($id: Int!) {
      userById(id: $id) {
        ethAddress
        bio
        url
        pseudonym
        roles
        id
        artworks {
          id
          title
          key
          isPublic
          creator {
            pseudonym
            id
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
      collectionById(id: $id) {
        totalCount
        arObjects {
          id
          key
          title
          editionOf
          subgraphInfo
          createdAt
          artwork {
            id
            key
          }
          creator {
            pseudonym
            id
            ethAddress
          }
          heroImage {
            id
            meta
            status
          }
          artwork {
            title
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
    query: userQuery,
    variables: {
      id: parseInt(params.id)
      // ethAddress: params.eth.toLowerCase(),
    },
  });

  if (!data?.userById) {
    return {
      notFound: true,
      revalidate: 240,
    };
  }

  // console.log(data);

  return {
    props: {
      user: data?.userById,
      artworks: data?.userById?.artworks,
      collection: data?.collectionById,
    },
    revalidate: 240,
  };
};

PublicUserProfile.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default PublicUserProfile;
