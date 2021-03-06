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
  isIncomplete = false,
}: {
  artworks: any;
  width?: string;
  col: number;
  isPublic: boolean;
  isIncomplete?: boolean;
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
        borderBottom="1px solid #fff"
      >
        <chakra.p textStyle="bigLabel">Own artworks</chakra.p>
        <Box ml="-6">
          <Arrow className="arrow down" />
        </Box>
        {Array.isArray(artworks) && artworks.length == 0 && !isPublic && (
          <Box mx="14" mt="20">
            <chakra.p pb="6">
              Looks like you haven’t added an artwork yet.{" "}
              {!isIncomplete
                ? "Add one of your works to earn the artist badge."
                : "Complete registration to be able to create your first artwork and claim the artist badge"}
            </chakra.p>
            {!isIncomplete && (
              <Link href="/x/a/create" passHref>
                <Button>Add artwork</Button>
              </Link>
            )}
          </Box>
        )}
      </Box>

      {/* --------- ROW: Artworks --------- */}
      <Box height="100%" width="100%" overflow="auto">
        {Array.isArray(artworks) && artworks.length > 0 && (
          <Flex width="100%" flexWrap="wrap">
            {artworks.map((artwork) => {


              if (isPublic && !isArtworkAccessible(artwork, appUser)) return;

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

              return (
                <ArtworkListItem
                  isAdmin={!isPublic}
                  urlKey={artwork.key}
                  col={col}
                  key={artwork.key}
                  heroImage={image}
                  {...pick(artwork, [
                    "id",
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
