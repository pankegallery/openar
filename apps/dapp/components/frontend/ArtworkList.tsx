import React from "react";
import Link from "next/link";

import { Box, Flex, chakra, Button } from "@chakra-ui/react";

import Arrow from "~/assets/img/arrow.svg";
import { ArtworkListItem } from "~/components/frontend";
import pick from "lodash/pick";
import { useAuthentication } from "~/hooks";
import { isArtworkAccessible } from "~/utils";

export const ArtworkList = ({
  isPublic = true,
  artworks,
  width,
  col,
}: {
  artworks: any;
  width?: string;
  col: number;
  isPublic: boolean;
}) => {
  const [appUser] = useAuthentication();

//  if (!isPublic) { width={base: "66vw", d: "33vw"}}

  return (
    <Flex
      direction="column"
      className="artworkColumn"
      color="white"
      layerStyle="backdropMud"
      w={width}
      flex="auto 1 0"
      h={{
        base: "auto",
        t: isPublic ? "100%" : "auto",
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
        layerStyle="backdropGradient"
      >
        <chakra.p textStyle="bigLabel">Own artworks</chakra.p>
        <Box ml="-6">
          <Arrow className="arrow down" />
        </Box>
        {artworks.length == 0 && !isPublic && (
          <Box mx="14" mt="20">
            <chakra.p pb="6">
              Looks like you haven’t added an artwork yet. Add one of your works to earn the artist badge.
            </chakra.p>
            <Link href="/x/a/create" passHref><Button>Add artwork</Button></Link>
          </Box>
        )}
      </Box>

      {/* --------- ROW: Artworks --------- */}
      <Box height="100%" width="100%" overflow="auto">
        {artworks.length > 0 && (
          <Flex width="100%" flexWrap="wrap">
            {artworks.map((artwork) => {
              if (isPublic && !isArtworkAccessible(artwork, appUser)) return;

              return (
                <ArtworkListItem
                  isAdmin={!isPublic}
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
