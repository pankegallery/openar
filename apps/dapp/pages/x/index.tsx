import type { ReactElement } from "react";
import Head from "next/head";

import { gql, useQuery } from "@apollo/client";

import { LayoutOpenAR } from "~/components/app";
import { Box, Grid, Flex, chakra } from "@chakra-ui/react";

import { ModulePage } from "~/components/modules";

import {
  ArtworkListItem,
  CollectionList,
  ArtworkList,
  UserDetails,
} from "~/components/frontend";
import { ArrowLink } from "~/components/ui";
import { useSSRSaveMediaQuery, useAuthentication } from "~/hooks";

const userProfileQuery = gql`
  query ($ethAddress: String!) {
    userProfileRead(ethAddress: $ethAddress) {
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

export const User = () => {
  const [appUser] = useAuthentication();

  const { data, loading, error } = useQuery(userProfileQuery, {
    skip: !appUser, // if user is not logged in skip the query
    variables: {
      ethAddress: appUser?.ethAddress ?? "",
    },
  });

  //  user = {
  //    ethAdress: "0x61e323d9Ad70d40474Cb3e0FE1Cf132Dd5049584",
  //    psydonym: "crosssenses",
  //    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  //  }

  console.log("[Profile] User", data?.userProfileRead);
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");
  const isTablet = useSSRSaveMediaQuery(
    "(min-width: 45.00001rem) and (max-width: 74.9999rem)"
  );
  const isMobile = useSSRSaveMediaQuery("(max-width: 45rem)");

  const { userProfileRead } = data ?? {};

  const hasArtworks = userProfileRead?.artworks.length > 0;

  const hasCollection = false;
  const name = userProfileRead?.pseudonym ?? userProfileRead?.ethAddress;

  const showArtworksUnderDetails =
    (hasArtworks && !isDesktop && hasCollection) || (hasArtworks && isMobile);

  const showArtworksColumn =
    (hasArtworks && isDesktop) || (hasArtworks && isTablet && !hasCollection);

  const showCollectionColumn = hasCollection;
  const showCollectionPlaceholder = !hasCollection && !hasArtworks && !isMobile;

  // TODO: this code here should probably take the sidebar into account
  // TODO: this also needs to take a tablet solution into account
  let collectionColumnWidth = "100%";
  if (!isMobile) {
    collectionColumnWidth = "33.33%";
  }

  let artworksColumnWidth = "100%";
  if (!isMobile) {
    artworksColumnWidth = "66.66%";
  }

  return (
    <>
      <Head>
        <title>{name} · OpenAR</title>
        <meta property="og:title" content={`${name} · OpenAR`} key="title" />
      </Head>

      {/* --------- Module page is used for conviencent showing the loading icon and an error message in case the loading of data failed --------- */}
      <ModulePage
        isLoading={loading}
        isError={!!error}
        isAccessDenied={!appUser}
      >
        {userProfileRead && (
          <Flex
            flexWrap="wrap"
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
                artworks={userProfileRead.artworks}
                width={collectionColumnWidth}
                col={1}
              />
            )}

            {showCollectionPlaceholder && (
              <CollectionList
                userName={name}
                width={collectionColumnWidth}
                col={1}
              />
            )}

            {/* TODO: this box is a quick hack and probably should not be here I also had to flip UserDetails and AW List as UserDetails is 100% high*/}
            <Box>
               {/* --------- COL: Artworks --------- */}
               {showArtworksColumn && (
                <ArtworkList
                  isPublic={false}
                  artworks={userProfileRead.artworks}
                  width={artworksColumnWidth}
                  col={1}
                />
              )}

              <UserDetails
                isPublic={false}
                user={userProfileRead}
                showArtworks={showArtworksUnderDetails}
              />

             
            </Box>

            {/* --------- COL: Artwork details) --------- */}
          </Flex>
        )}
      </ModulePage>
    </>
  );
};

User.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default User;
