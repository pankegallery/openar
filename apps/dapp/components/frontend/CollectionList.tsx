import React from "react";
import Link from "next/link";

import { Box, Flex, chakra } from "@chakra-ui/react";

import Arrow from "~/assets/img/arrow.svg";
import { ArtworkListItem } from "~/components/frontend";
import pick from "lodash/pick";
import { useSSRSaveMediaQuery } from "~/hooks";



export const CollectionList = ({artworks, col, userName}: {artworks?: any; col: any; userName: any}) => {

  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  let colW = (col === 2) ? "66.6vw" : "33.3vw";

  const isCollectionItems = artworks;

  return (
    <Flex
      direction="column"
      className="collectionColumn light"
      color="black"
      layerStyle="backdropLight"
      w={{
        base: "100vw",
        t: "50vw",
        d: `${colW}`
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
        <chakra.p textStyle="bigLabel">Collection</chakra.p>
        <Box ml="-6">
          <Arrow className="arrow down light" />
        </Box>
      </Box>

      {/* --------- ROW: Artworks --------- */}

      {isCollectionItems&&
        <Box height="100%"
          width="100%" overflow="scroll">
          {artworks.length > 0 && (
            <Flex
              width="100%"
              flexWrap="wrap"
            >
              {artworks.map((artwork) => (
                <ArtworkListItem
                  isAdmin={false}
                  urlKey={artwork.key}
                  col={col}
                  key={artwork.key}
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
          )}
        </Box>
      }

      {!isCollectionItems&&
        <Flex
          layerStyle="backdropBlurred"
          w={{
            base: "100vw",
            t: "50vw",
            d: `${colW}`
          }}
          h="100vh"
          position="absolute"
          clipPath="polygon(10rem 0%, 100% 0, 100% 100%, 0 100%, 0 10rem)"
          z-index="10"
          _before={{
            bg: "#00000010"
          }}
          _after={{
            content: "''",
            bg: "white",
            clipPath: "polygon(10rem 0, calc(10rem + 2px) 0%, 0 calc(10rem + 2px), 0 10rem)",
            zIndex: "100",
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "block",
          }}

        >
          <Box m="auto" w="60%" pb="10">
              <chakra.p textStyle="subtitle">{userName? userName : "The user"} hasn’t started collecting yet.</chakra.p>
              <chakra.p >It’s not too late. There is still a chance for {userName? userName : "the user"} to receive this year’s collectors badge.</chakra.p>
          </Box>
        </Flex>
      }
    </Flex>
  );
};
