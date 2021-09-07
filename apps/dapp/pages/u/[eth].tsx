import type { ReactElement } from "react";
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

export const User = ({
  user,
}: {
  user: any;
}) => {

  user = {
    ethAdress: "0x61e323d9Ad70d40474Cb3e0FE1Cf132Dd5049584",
    psydonym: "crosssenses",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }

  const isArtworks = true
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
      {/* --------- COL: Exhibition (desktop only) --------- */}
        {isCollection&&
          <Flex
            direction="column"
            className="collectionColumn light"
            color="black"
            w={{
              base: "100vw",
              t: "50vw",
              d: "33.3vw"
            }}
          >

            {/* --------- ROW: Arrow --------- */}
            <Box
              className="header"
              p="6"
              pb="20"
              pt={{
                base: "10",
                t: "6",
              }}
              w="100%"
              textAlign="left"
              flexDirection="column"
            >
              <chakra.p textStyle="bigLabel">
                Collection
              </chakra.p>
              <Box ml="-6"><Arrow className="arrow down light"/></Box>
            </Box>


            {/* --------- ROW: Artworks --------- */}
            <Box height="100%"
              width="100%" overflow="scroll">
              ARTWORKS
              {/*artworks.length > 0 && (
                <Flex
                  width="100%"
                  flexWrap="wrap"
                >
                  {artworks.map((artwork) => (
                    <ArtworkListItem
                      isAdmin={false}
                      urlKey={artwork.key}
                      col={3}
                      {...pick(artwork, [
                        "id",
                        "key",
                        "heroImage",
                        "title",
                        "creator",
                      ])}
                    />
                  ))}
                </Flex>
              )*/}
            </Box>

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
          p="6"
          pt="10"
          overflow="auto"
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

          ARTWORKS

        </Flex>

        {/* --------- COL: Artwork details) --------- */}
        USER DETAILS
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
      userByEthAddress(ethAddress: $eth) {
        pseudonym
        ethAddress
        bio
        url
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

  // TODO: access protect artwork here
//  if (!data?.user) {
//    return {
//      notFound: true,
//    };
//  }

//  return {
//    props: {
//      user: data?.user,
//    },
//  };

  return {
    props: {
      user: {},
    },
  };

};

User.getLayout = function getLayout(page: ReactElement) {

  return <LayoutBlank>{page}</LayoutBlank>;
};

export default User;
