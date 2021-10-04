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
import { getStatic } from "@ethersproject/properties";

const userProfileQuery = gql`
  query ($ethAddress: String!) {
    userProfileRead(ethAddress: $ethAddress) {
      ethAddress
      bio
      url
      pseudonym
      roles
      emailVerified
      acceptedTerms
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
          status
          heroImage {
            id
            meta
            status
          }
        }
      }
    }
    collection(ethAddress: $ethAddress) {
      totalCount
      arObjects {
        id
        key
        title
        editionOf
        subgraphInfo
        createdAt
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
          key
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

export const User = () => {
  // ___________________ Query user data __________________

  const [appUser] = useAuthentication();

  const { data, loading, error } = useQuery(userProfileQuery, {
    skip: !appUser, // if user is not logged in skip the query
    variables: {
      ethAddress: (appUser?.ethAddress ?? "").toLowerCase(),
    },
  });

  const { userProfileRead, collection } = data ?? {};
  
  const name = userProfileRead?.pseudonym ?? userProfileRead?.ethAddress;

  // ___________________ Set MediaQuery const __________________

  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");
  const isTablet = useSSRSaveMediaQuery(
    "(min-width: 45.00001rem) and (max-width: 74.9999rem)"
  );
  const isMobile = useSSRSaveMediaQuery("(max-width: 45rem)");

  // ___________________ Build page module logic __________________

  const hasArtworks = Array.isArray(userProfileRead?.artworks) && userProfileRead?.artworks.length > 0;
  const hasCollection = collection && collection.totalCount > 0;

  const showCollectionColumn = hasCollection;
  const showCollectionPlaceholder = !hasCollection && isDesktop;

  // TODO: this code here should probably take the sidebar into account
  // TODO: this also needs to take a tablet solution into account
  let collectionColumnWidth = "100%";
  if (isDesktop) {
    collectionColumnWidth = "33.33vw";
  }

  let detailsColumnWidth = "100%";
  if (!isMobile) {
    detailsColumnWidth = "auto";
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
            flexWrap={{
              base: "nowrap",
              d: "wrap",
            }}
            className="user"
            top="0"
            left="0"
            w="100%"
            p=""
            h={{
              base: "auto",
              d: "100vh",
            }}
            minHeight={{
              base: "100vh",
            }}
            zIndex="200"
            color="white"
            overflow={{
              base: "show",
              d: "hidden",
            }}
            flexDirection={{
              base: "column-reverse",
              d: "row",
            }}
            layerStyle="backdropMud"
          >
            {/* --------- COL: Collection --------- */}
            {showCollectionColumn && (
              <CollectionList
                userName={name}
                isPublic={false}
                objects={collection.arObjects}
                width={collectionColumnWidth}
                col={1}
              />
            )}

            {showCollectionPlaceholder && (
              <CollectionList
                userName={name}
                isPublic={false}
                width={collectionColumnWidth}
                col={1}
              />
            )}

            {/* --------- COL: User details (+ artworks below)  */}

            <UserDetails
              isPublic={false}
              user={userProfileRead}
              showArtworks={true}
            />
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
