import type { ReactElement } from "react";
import pick from "lodash/pick";

import { gql } from "@apollo/client";
import { getApolloClient } from "~/services/apolloClient";

import { LayoutBlank } from "~/components/app";
import { Box, Flex, chakra } from "@chakra-ui/react";

import { ArtworkListItem } from "~/components/frontend";

import Arrow from "~/assets/img/arrow.svg";

export const Artworks = ({ artworks }: { artworks: any }) => {
  return (
    <>
      {/* --------- LAYOUT: header + search + artworks --------- */}
      <Flex
        direction="column"
        height="100vh"
        width="100%"
        layerStyle="backdropLight"
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
          <chakra.p textStyle="bigLabel">Recent artworks</chakra.p>
          <Box ml="-6">
            <Arrow className="arrow down light" />
          </Box>
        </Box>

        {/* TODO: Add search */}

        {/* --------- ROW: Artworks --------- */}
        <Box height="100%" width="100%" overflow="scroll">
          {artworks.length > 0 && (
            <Flex width="100%" flexWrap="wrap">
              {artworks.map((artwork) => {
                let image = artwork?.heroImage;
                if (!image) {
                  if (
                    artwork?.arObjects &&
                    Array.isArray(artwork?.arObjects)
                  ) {
                    const firstWithHero = artwork?.arObjects.find(
                      (o) => !!o?.heroImage?.id
                    );

                    if (firstWithHero) image = firstWithHero.heroImage;
                  }
                }

                //console.log(image, artwork?.arObjects);

                return (
                  <ArtworkListItem
                    isAdmin={false}
                    key={artwork.key}
                    urlKey={artwork.key}
                    col={3}
                    heroImage={image}
                    {...pick(artwork, [
                      "id",
                      "key",
                      "status",
                      "title",
                      "creator",
                    ])}
                  />
                );
              })}
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};

export const getStaticProps = async ({ params }: { params: any }) => {
  const client = getApolloClient();

  const artworkStreamQuery = gql`
    query {
      artworks {
        totalCount
        artworks {
          id
          title
          key
          description
          heroImage {
            id
            meta
            status
          }
          creator {
            pseudonym
            id
            ethAddress
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
    }
  `;

  const { data } = await client.query({
    query: artworkStreamQuery,
  });

  if (!data?.artworks?.totalCount) {
    return {
      notFound: true,
      revalidate: 240,
    };
  }

  return {
    props: {
      artworks: data?.artworks.artworks,
    },
    revalidate: 240,
  };
};

Artworks.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank mode="light">{page}</LayoutBlank>;
};

export default Artworks;
