import { ReactElement } from "react";

import { useQuery, gql } from "@apollo/client";
import { Box, Flex, Text } from "@chakra-ui/react";
import pick from "lodash/pick";

import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

import { RestrictPageAccess } from "~/components/utils";

import { moduleArtworksConfig } from "~/components/modules/config";
import { useAuthentication } from "~/hooks";
import { ApiImage } from "~/components/ui";
import { LayoutOpenAR } from "~/components/app";
import { ArtworkListItem } from "~/components/frontend";

const GET_OWN_ARTWORKS_LIST = gql`
  query artworksReadOwn {
    artworksReadOwn {
      totalCount
      artworks {
        id
        title
        key
        status
        creator {
          id
          ethAddress
          pseudonym
        }
        heroImage {
          id
          status
          meta
        }
        arObjects {
          id
          key
          title
          heroImage {
            id
            status
            meta
          }
        }
      }
    }
  }
`;

const Index = () => {
  const [appUser] = useAuthentication();

  const { data, loading, error } = useQuery(GET_OWN_ARTWORKS_LIST, {
    variables: {
      id: appUser?.id ?? 0,
    },
  });

  const breadcrumb = [
    {
      path: moduleArtworksConfig.rootPath,
      title: "Artworks",
    },
  ];

  const buttonList: ButtonListElement[] = [
    {
      type: "navigation",
      to: "/openar/artworks/create",
      label: "Create artwork",
      userCan: "artworkCreate",
    },
  ];

  const { totalCount, artworks } = data?.artworksReadOwn ?? {};
  
  return (
    <>
      <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
      <ModulePage isLoading={loading} isError={!!error}>
        <Box>
          {!loading && !error && (
            <>
              {artworks.length === 0 && (
                <Text p="4">You haven&#39;t created any artworks yet</Text>
              )}
              {artworks.length > 0 && (
                <Flex width="100%" flexWrap="wrap" className="adminArtworksListing">
                  {" "}
                  {artworks.map((artwork) => (
                    <ArtworkListItem key={`aw-${artwork.id}`}
                      isAdmin={true}
                      urlKey={artwork.key}
                      {...pick(artwork, [
                        "id",
                        "status",
                        "heroImage",
                        "title",
                        "creator",
                      ])}
                    />
                  ))}
                </Flex>
              )}
            </>
          )}
        </Box>
      </ModulePage>
    </>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default RestrictPageAccess(Index, "artworkReadOwn");
