import React from "react";
import { useRouter } from "next/router";

import { Box, Grid, Flex, chakra, Button, Link } from "@chakra-ui/react";

import { ApiImage, ApiArModel } from "~/components/ui";

import { isMobile, isChrome, isMobileSafari } from "react-device-detect";

// TODO: is the url attribute actually used anywhere?
export const ArtworkImageViewer = ({
  artwork,
  object,
  url,
  userDistanceFromObject,
  viewInARDisabled
}: {
  artwork: any;
  object: any;  
  url?: String;
  userDistanceFromObject?: number;
  viewInARDisabled: boolean
}) => {
  const router = useRouter();

  const baseURL = router.asPath.split(artwork.key)[0];
  const artworkURL = baseURL + artwork.key;
  
  let modelViewer;

  const arObject = object ? object : artwork?.arObjects[0];

  const showARButton = isMobile && (isChrome || isMobileSafari);
  const isExhibition = baseURL.includes("/e/")

  let urlGlb, urlUsdz

  if (arObject) {
    const [urlGlbG, urlUsdzG] = arObject?.arModels.reduce(
      (acc: string[], model: any) => {
        if (model.type === "glb") return [model?.meta?.originalFileUrl, acc[1]];

        if (model.type === "usdz")
          return [acc[0], model?.meta?.originalFileUrl];
      },
      [undefined, undefined]
    );

    urlGlb = urlGlbG
    urlUsdz = urlUsdzG
  }



  if (artwork.arObjects.length > 1) {
    // multiple object view
    return (
      <Box w="100%" direction="column">
        <Flex
          w="100%"
          h={isExhibition? "75vh" : "85vh"}
          justifyContent="center"
          alignItems="center"
          direction="column"
          overflow="auto"
        >
          <Box position="relative" w="100%" h="100%">
            <Box w="100%" h="100%">
              <ApiArModel
                urlGlb={urlGlb}
                urlUsdz={urlUsdz}
                alt={artwork?.title}
                loading="auto"
                reveal="auto"
                viewInARDisabled={viewInARDisabled}
                userDistanceFromObject={userDistanceFromObject}
              />

            </Box>            
            <Box
              textStyle="copyDark"
              alignSelf="flex-start"
              position="absolute"
              bottom="6"
              left="6"
            >
              {arObject.title}
            </Box>
          </Box>
        </Flex>
        <Box w="100%" px="6" pb="6" bg="openar.light">
          <chakra.h2 textStyle="label" textAlign="center" p="3">
            All objects
          </chakra.h2>
          <Grid templateColumns="repeat(2, 1fr)" gap="6">
            {artwork.arObjects.map((obj) => {
              //                console.log("[ArtworkImageViewer] mapped obj: ", obj);

              return (
                <Link href={`${artworkURL}/${obj.key}`} key={obj.key}>
                  <ApiImage
                    id={obj?.heroImage?.id}
                    meta={obj?.heroImage?.meta}
                    status={obj?.heroImage?.status}
                    title={obj?.title}
                    alt={obj?.title}
                    sizes="(min-width: 75rem) 10vw, (min-width: 45rem) 18vw, 28vw"
                    forceAspectRatioPB={100}
                  />
                </Link>
              );
            })}
          </Grid>
        </Box>
      </Box>
    );
  } else {
    // single object view
    return (
      <Flex
        w="100%"
        h={{
          base: "72vh",
          t: "100%"
        }}
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Box position="relative" w="100%" h="100%">
          <Box w="100%" h="100%">
            <ApiArModel
              urlGlb={urlGlb}
              urlUsdz={urlUsdz}
              alt={artwork?.title}
              loading="auto"
              reveal="auto"
              viewInARDisabled={viewInARDisabled}
              userDistanceFromObject={userDistanceFromObject}
            />
          </Box>          
        </Box>
      </Flex>
    );
  }
};

export default ArtworkImageViewer;
