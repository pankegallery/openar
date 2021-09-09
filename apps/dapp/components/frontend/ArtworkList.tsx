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
  col,
}: {
  artworks: any;
  col?: any;
}) => {
  const [appUser] = useAuthentication();

  let colW = col === 2 ? "66.6vw" : "33.3vw";
  return (
    <Flex
      direction="column"
      className="artworkColumn"
      color="white"
      layerStyle="backdropMud"
      w={{
        base: "100vw",
        t: "50vw",
        d: `${colW}`,
      }}
      h={{
        base: "auto",
        t: "100%",
      }}
      sx={{
        ".userDetails &": {
          h: "auto",
        },
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
        <chakra.p textStyle="bigLabel">Own artworks</chakra.p>
        <Box ml="-6">
          <Arrow className="arrow down" />
        </Box>
      </Box>

      {/* --------- ROW: Artworks --------- */}
      <Box height="100%" width="100%" overflow="auto">
        {artworks.length > 0 && (
          <Flex width="100%" flexWrap="wrap">
            {artworks.map((artwork) => {
              // TODO: check if one object is at least published ... 

              if (!isArtworkAccessible(artwork, appUser)) return <></>;

              return (
                <ArtworkListItem
                  isAdmin={false}
                  urlKey={artwork.key}
                  col={col}
                  key={artwork.key}
                  {...pick(artwork, [
                    "id",
                    "heroImage",
                    "title",
                    "creator",
                    "status",
                  ])}
                />
              );
            })}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
