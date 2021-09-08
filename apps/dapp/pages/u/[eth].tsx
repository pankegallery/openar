import type { ReactElement } from "react";
import Head from "next/head";
import { gql } from "@apollo/client";

import { LayoutBlank } from "~/components/app";
import { Box, Grid, Flex, chakra } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

import { getApolloClient } from "~/services/apolloClient";

import Arrow from "~/assets/img/arrow.svg";
import { ArtworkListItem,
        CollectionList,
        ArtworkList,
        UserDetails
       } from "~/components/frontend";
import { ArrowLink } from "~/components/ui";
import { useSSRSaveMediaQuery } from "~/hooks";

export const User = ({
  user,
}: {
  user: any;
}) => {

//  user = {
//    ethAdress: "0x61e323d9Ad70d40474Cb3e0FE1Cf132Dd5049584",
//    psydonym: "crosssenses",
//    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//  }

  console.log("[Profile] User", user)


  const isArtworks = user.artworks.length > 0;
  const isCollection = true
  const name = user.psydonym ? user.psydonym : user.ethAdress

  return(
    <>
      <Head>
        <title>{name} · OpenAR</title>
        <meta
          property="og:title"
          content={`${name} · OpenAR`}
          key="title"
        />
      </Head>
      {/* --------- Column Layout --------- */}
      <Flex
        flexWrap="wrap"
        position={{
          base: "relative",
          t: "fixed"
        }}
        className="user"
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
      {/* --------- COL: Collection --------- */}
        {isCollection&&
          <CollectionList artworks={user.artworks} />
        }
        {/* --------- COL: Artworks --------- */}
        {isArtworks&&
          <ArtworkList artworks={user.artworks} />
        }

        {/* --------- COL: Artwork details) --------- */}
          <UserDetails user={user} />
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

  // TODO: enable read protection of non published artworks
  const userQuery = gql`
    query ($eth: String!) {
      user(ethAddress: $eth) {
    ethAddress
    bio
    pseudonym
    roles
    artworks {
      id
      title
      key
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
      eth: params.eth,
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

User.getLayout = function getLayout(page: ReactElement) {

  return <LayoutBlank>{page}</LayoutBlank>;
};

export default User;
