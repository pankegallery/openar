import React from "react";
import Link from "next/link";

import { Box, Flex, chakra } from "@chakra-ui/react";

import Arrow from "~/assets/img/arrow.svg";
import { ArtworkListItem } from "~/components/frontend";
import pick from "lodash/pick";
import { useAuthentication } from "~/hooks";
import { isArtworkAccessible } from "~/utils";

export const ArtworkList = ({
  artworks,
  isOnMyProfile,
}: {
  artworks: any;
  isOnMyProfile: boolean;
}) => {
  const [appUser] = useAuthentication();

  return (
    <Flex
      direction="column"
      className="artworkColumn"
      color="white"
      layerStyle="backdropMud"
      minWidth={{
        base: "100vw",
        t: "50vw",
        d: "33.3vw",
      }}
      h="100%"
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
        <chakra.p textStyle="bigLabel">Own artworks</chakra.p>
        <Box ml="-6">
          <Arrow className="arrow down" />
        </Box>
      </Box>

      {/* --------- ROW: Artworks --------- */}
      <Box height="100%" width="100%" overflowY="auto">
        {artworks.length > 0 && (
          <Flex width="100%" flexWrap="wrap">
            {artworks.map((artwork) => {
              // make sure that unauthenticated users are not seeing drafts, deleted items, or artworks that are not public
             if (!isArtworkAccessible(artwork, appUser))
                return <></>;

              return (
                <>
                  <ArtworkListItem
                    col={1}
                    isAdmin={false}
                    key={artwork.key}
                    urlKey={artwork.key}
                    {...pick(artwork, [
                      "id",
                      "key",
                      "heroImage",
                      "title",
                      "creator",
                      "status",
                    ])}
                  />

                  {isOnMyProfile && <Box>Place admin buttons here</Box>}
                </>
              );
            })}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
