import type { ReactElement } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { LayoutOpenAR } from "~/components/app";
import { RestrictPageAccess, AlertEmailVerification } from "~/components/utils";
import { Box, Grid, Flex, chakra } from "@chakra-ui/react";
import { useSSRSaveMediaQuery } from "~/hooks";
import { useAuthentication } from "~/hooks";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

import { ArtworkListItem,
        CollectionList,
        ArtworkList,
        UserDetails
       } from "~/components/frontend";



// import { useEthers, useEtherBalance } from "@usedapp/core";
// import { formatUnits } from "@ethersproject/units";

const OpenARDashboard = () => {

    // const { activateBrowserWallet, deactivate, account } = useEthers();
  // const userBalance = useEtherBalance(account);
  // const stakingBalance = useEtherBalance(STAKING_CONTRACT);

  const [appUser] = useAuthentication();

  const isTablet= useSSRSaveMediaQuery("(min-width: 55em)");
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");
  const isMobile = useSSRSaveMediaQuery("(max-width: 45rem)");

  // ______________________  Query Data ______________________

  const userQuery = gql`
    query ($eth: String!) {
      userProfileRead(ethAddress: $eth) {
        ethAddress
        bio
        pseudonym
        roles
        artworks {
          id
          title
          description
          key
          video
          url
          createdAt
          heroImage {
            id
            meta
            status
          }
          arObjects {
            id
            status
            key
            orderNumber
            askPrice
            editionOf
            heroImage {
              id
              meta
              status
            }
          }
        }
      }
    }`

  const { data, loading, error } = useQuery(userQuery, {
    variables: {
      eth: appUser?.ethAddress ?? "",
    },
  });
    console.log("[Dashboard] data: ", data)

  const user = data?.userProfileRead
    console.log("[Dashboard] user: ", user)


  // ______________________  Render page ______________________


  if(user){

    const name = user.pseudonym ? user.pseudonym : user.ethAddress;

    const isCollection = false;
    const isArtworks = user.artworks.length > 0;

    const showArtworksUnderDetails = (isArtworks && !isDesktop && isCollection) || (isArtworks && isMobile)

    const showArtworksColumn = (isArtworks && isDesktop) || (isArtworks && isTablet && !isCollection)

    const showCollectionColumn = isCollection
    const showCollectionPlaceholder = !isCollection && !isArtworks && !isMobile



    return (
      <>
        <Head>
          <title>{name} · OpenAR</title>
          <meta
            property="og:title"
            content={`${name} · OpenAR`}
            key="title"
          />
        </Head>
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
          minHeight={{
            base: "100vh"
          }}
          zIndex="200"
          color="white"
          overflow={{
            base: "show",
            t: "hidden",
          }}
          flexDirection={{
            base: "column-reverse",
            t: "row"
          }}
          layerStyle="backdropMud"
        >
          {/* --------- COL: Collection --------- */}
          {showCollectionColumn&&
            <CollectionList artworks={user.artworks} col={isArtworks ? 1 : isDesktop? 2 : 1} />
          }

          {showCollectionPlaceholder &&
            <CollectionList userName={user?.pseudonym} col={isDesktop ? 2 : 1}/>
          }

        </Flex>

        {/*
        <AlertEmailVerification />
        <Box p="3">
          <Heading as="h1">Welcome</Heading>
          {!isTablet && (
            <Text>
              <Link href="/openar/artworks/">Dashboard</Link>
              <br />
              <Link href="/openar/artworks/">Artworks</Link>
              <br />
              <Link href="/openar/artworks/">Artworks</Link>
              <br />
            </Text>
          )}

          {isTablet && (
            <Text>
              Please update your profile and upload artworks and objects via the
              navigation at the right.
            </Text>
          )}
        </Box>*/}
      </>
    );
  }
  else return (<></>);
};

OpenARDashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default RestrictPageAccess(OpenARDashboard, "profileRead");
