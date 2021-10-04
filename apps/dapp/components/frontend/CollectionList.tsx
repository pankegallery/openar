import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Box, Flex, chakra } from "@chakra-ui/react";

import Arrow from "~/assets/img/arrow.svg";
import { ArtworkListItem } from "~/components/frontend";
import pick from "lodash/pick";
import { useSSRSaveMediaQuery } from "~/hooks";

export const CollectionList = ({
  objects,
  width,
  userName,
  isPublic = false,
  isAdmin = false,
  col,
}: {
  objects?: any[];
  width: string;
  userName: string;
  isPublic?: boolean;
  isAdmin?: boolean;
  col: number;
}) => {
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  const hasCollectionItems = objects && objects.length > 0;

  return (
    <Flex
      direction="column"
      className="collectionColumn light"
      color="black"
      layerStyle="backdropLight"
      w={width}
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

      {hasCollectionItems && (
        <Box height="100%" width="100%" overflow="scroll">
          <Flex width="100%" flexWrap="wrap">
            {objects.map((object) => {
              
              let image = object?.heroImage ?? object?.artwork?.heroImage;
              
              return (
              <ArtworkListItem
                isAdmin={isAdmin}
                isPublic={isPublic}
                urlKey={`${object.artwork.key}/${object.key}`}
                col={col}
                key={object.key}
                isCollectedObject={true}
                subgraphInfo={object?.subgraphInfo}
                heroImage={image}
                {...pick(object, [
                  "id",
                  "key",
                  "artwork",
                  "title",
                  "creator",
                  "status",
                ])}
              />
            )})}
          </Flex>
        </Box>
      )}

      {!hasCollectionItems && (
        <Flex
          layerStyle="backdropBlurred"
          w={width}
          h="100vh"
          position="absolute"
          clipPath="polygon(10rem 0%, 100% 0, 100% 100%, 0 100%, 0 10rem)"
          z-index="10"
          display="flex"
          direction="column"
          _before={{
            bg: "#00000010",
          }}
          _after={{
            content: "''",
            bg: "white",
            clipPath:
              "polygon(10rem 0, calc(10rem + 2px) 0%, 0 calc(10rem + 2px), 0 10rem)",
            zIndex: "100",
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          {isPublic && (
            <Box m="auto" w="60%" pb="10">
              <chakra.p textStyle="subtitle">
                {userName ? userName : "The user"} hasn’t started collecting
                yet.
              </chakra.p>
              <chakra.p>
                It’s not too late. There is still a chance for{" "}
                {userName ? userName : "the user"} to receive this year’s
                collectors badge.
              </chakra.p>
            </Box>
          )}
          {!isPublic && (
            <>
              <Box mt="auto" w="60%" pb="10" mb="10" mx="auto">
                <chakra.p textStyle="subtitle">
                  Seems like you haven’t started collecting yet.
                </chakra.p>
                <chakra.p>
                  Purchase artworks to build up your collection and receive your
                  first collector badge.
                </chakra.p>
              </Box>
              <Box
                as="article"
                className="artwork item"
                w="100%"
                bg="openar.light"
                borderTop="1px solid white"
              >
                <Box className="info" p="4">
                  <chakra.h2 className="title" fontWeight="600">
                    Collector’s Badge 2021
                  </chakra.h2>
                  <chakra.span
                    width="2em"
                    overflow="hidden"
                    display="block"
                    text-overflow="ellipsis"
                    white-space="nowrap"
                    className="artist"
                    textStyle="meta"
                  >
                    Anna Luise Lorenz
                  </chakra.span>
                </Box>
                <Box className="img">
                  <Image
                    src="/images/collector-blurred.png"
                    width="66.66%"
                    height="66.66%"
                    layout="responsive"
                    alt="Colector badge image"
                  />
                </Box>
              </Box>
            </>
          )}
        </Flex>
      )}
    </Flex>
  );
};
