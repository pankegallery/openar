// import type { ReactElement } from "react";
// import Head from "next/head";

// import { LayoutBlank } from "~/components/app";
import { ExhibitionTitleTile } from "~/components/frontend";
import Arrow from "~/assets/img/arrow.svg";

// import { useSSRSaveMediaQuery } from "~/hooks";

import { Box, Grid, Flex } from "@chakra-ui/react";
// import Link from "next/link";
// import Image from "next/image";

//import openingBg from "~/assets/img/opening-bg.png";

export const ExhibitionSlide = ({
  exhibition,
  beta,
  scrollUp,
  scrollDown,
  active,
  prev,
  next,
  single,
}: {
  exhibition: any;
  beta?: Boolean;
  scrollUp?: Function;
  scrollDown?: Function;
  active?: Boolean;
  prev?: Boolean;
  next?: Boolean;
  single?: Boolean;
}) => {
  // const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  return (
    <>
      {/* --------- Background image ---------
      <Box position="fixed" zIndex="100" h="100vh" w="100%" overflow="hidden">
        <chakra.img
          src={imgUrl}
          objectFit="cover"
          objectPosition={exhibition.imgPosition}
          w="100%"
          h="100%"
        />
      </Box>*/}

      {/* --------- GRID --------- */}
      <Grid
        backgroundImage={`url(${exhibition?.imgUrl})`}
        backgroundPosition={
          active
            ? exhibition?.imgPosition
            : prev
            ? "center -100vh"
            : "center 100vh"
        }
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        className="exhibition"
        top="0"
        left="0"
        w="100%"
        h="100%"
        zIndex="100"
        templateRows={{
          base: "calc(66.66vw * 2) auto",
          t: "calc(50vw + var(--openar-header-height-desktop)) auto",
          d: "calc(33.33vw + var(--openar-header-height-desktop)) auto",
        }}
        templateColumns="1fr"
        color="white"
        overflow="hidden"
        position="fixed"
        transition="background-position 0.5s ease-out"
      >
        {/* --------- ROW: Exhibition title and arrows --------- */}
        <Flex
          className="main"
          w="100%"
          mt={{
            base: "66.66vw",
            t: "var(--openar-header-height-desktop)",
            d: "var(--openar-header-height-desktop)",
          }}
          ml={{
            base: "0",
            t: "0",
            d: "33.33vw",
          }}
          borderBottom="1px solid #fff"
          flexWrap="wrap"
          direction="row"
          zIndex="302"
          opacity={active ? "1" : "0"}
          transition="opacity 1s ease-in-out"
        >
          {/* --------- TILE: Exhibition title  --------- */}
          <Flex
            className="exhibitionTile"
            w={{
              base: "66.66vw",
              t: "50vw",
              d: "33.33vw",
            }}
            h={{
              base: "calc(66.66vw - 1px)",
              t: "calc(50vw - 1px)",
              d: "calc(33.33vw - 1px)",
            }}
            layerStyle="backdropDark"
          >
            <Flex
              w="100%"
              h="100%"
              borderTop="1px solid #fff"
              borderRight="1px solid #fff"
              borderLeft={{
                base: "none",
                d: "1px solid #fff",
              }}
              p={{
                base: "6",
                t: "10",
              }}
              pb={{
                base: "6",
                t: "20",
              }}
            >
              <ExhibitionTitleTile exhibition={exhibition} link={true} />
            </Flex>
          </Flex>
          {/* --------- TILE: Arrows  --------- */}
          <Flex
            w={{
              base: "calc(33.33vw - 3px)",
              t: "calc(50vw - 3px)",
              d: "calc(33.33vw - 3px)",
            }}
            h={{
              base: "66.66vw",
              t: "50vw",
              d: "33.33vw",
            }}
            py="20"
            px="10"
            borderTop="1px solid #fff"
            borderBottom="1px solid #fff"
            layerStyle="backdropBlurred"
            flexDirection="column"
            justifyContent="space-between"
            position="relative"
          >
            {!single && (
              <>
                <Box
                  onClick={() => {
                    if (typeof scrollUp === "function") scrollUp.call(null);
                  }}
                  width="min-content"
                  ml="auto"
                >
                  <Arrow className="arrow up" />
                </Box>
                <Box
                  onClick={() => {
                    if (typeof scrollDown === "function") scrollDown.call(null);
                  }}
                  width="min-content"
                  ml="auto"
                  mt="auto"
                >
                  <Arrow className="arrow down" />
                </Box>
              </>
            )}
          </Flex>
        </Flex>
        {/* --------- TILE: Footer  --------- */}
        <Box
          className="footer"
          p="6"
          layerStyle="backdropGradient"
          w={{
            base: "66.66vw",
            t: "50vw",
            d: "33.33vw",
          }}
          ml={{
            d: "calc((100vw - 100%))",
          }}
          borderRight="1px solid #fff"
          borderLeft={{
            t: "1px solid #fff",
          }}
          justifySelf={{
            base: "start",
            t: "start",
            d: "center",
          }}
        ></Box>
      </Grid>
    </>
  );
};
