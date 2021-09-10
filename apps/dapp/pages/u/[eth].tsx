import type { ReactElement } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";

import { LayoutBlank } from "~/components/app";
import { Box, Grid, Flex, chakra } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

import { getApolloClient } from "~/services/apolloClient";

import Arrow from "~/assets/img/arrow.svg";
import {
  ArtworkListItem,
  CollectionList,
  ArtworkList,
  UserDetails,
} from "~/components/frontend";
import { ArrowLink } from "~/components/ui";
import { useAuthentication, useSSRSaveMediaQuery } from "~/hooks";

export const PublicUserProfile = ({ user }: { user: any }) => {

  const router = useRouter();
  const [appUser] = useAuthentication();

  console.log(appUser, user);

  if (appUser && appUser.ethAddress === user.ethAddress) {
    console.log("PublicUserProfile Redirect to /x/");
    router.replace("/x/");
  }

  console.log("[Profile] User", user);
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");
  const isTablet = useSSRSaveMediaQuery(
    "(min-width: 45.000001rem) and (max-width: 74.9999rem)"
  );
  const isMobile = useSSRSaveMediaQuery("(max-width: 45rem)");

  const hasArtworks = user.artworks.length > 0;

  const hasCollection = false;
  const name = user.pseudonym ?? user.ethAddress;

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

  return (
    <>
      <Head>
        <title>{name} · OpenAR</title>
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
            artworks={user.artworks}
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
  return { paths: [], fallback: "blocking" }; // TODO: probably we need somehow configure the refresh timeout.
}

export const getStaticProps = async ({ params }: { params: any }) => {
  const client = getApolloClient();

  // TODO: enable read protection of non published artworks
  const userQuery = gql`
    query ($ethAddress: String!) {
      user(ethAddress: $ethAddress) {
        ethAddress
        bio
        url
        pseudonym
        roles
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
        }
      }
    }
  `;

  console.log("params.eth: ", params.eth);

  const { data } = await client.query({
    query: userQuery,
    variables: {
      ethAddress: params.eth,
    },
  });

  console.log("user query: ", data?.user);

  //   TODO: access protect artwork here
  if (!data?.user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: data?.user,
    },
  };
};

PublicUserProfile.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default PublicUserProfile;
