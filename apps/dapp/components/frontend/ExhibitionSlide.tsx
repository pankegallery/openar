import type { ReactElement } from "react";
import Head from "next/head";

import { LayoutBlank } from "~/components/app";
import { ExhibitionTitleTile } from "~/components/frontend";

import { Box, Grid, Flex, chakra, AspectRatio } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

//import openingBg from "~/assets/img/opening-bg.png";

export const ExhibitionSlide = ({exhibition, beta}: {exhibition: any; beta?: any}) => {
  return(
    <>
  {/* --------- Background image --------- */}
      <Box position="fixed" zIndex="100" h="100vh" w="100%" overflow="hidden">
        <chakra.img
          src="/images/exhibitions/opening-bg.png"
            objectFit="cover"
          objectPosition="50% 100%"
          w="100%"
          h="100%"
        />
      </Box>

      {/* --------- GRID --------- */}
      <Grid
        position="fixed"
        className="exhibition"
        top="0"
        left="0"
        w="100%"
        h="100%"
        zIndex="200"
        templateRows={{
          base: "calc(66.66vw * 2) auto",
          t: "calc(50vw + var(--openar-header-height-desktop)) auto",
          d: "calc(33.33vw + var(--openar-header-height-desktop)) auto",
        }}
        templateColumns="1fr"
        color="white"
        overflow="hidden"
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
              {!beta && (
                <ExhibitionTitleTile exhibition={exhibition} link={true} />
              )}
              {beta && (
                <ExhibitionTitleTile exhibition={exhibition} link={false} />
              )}
            </Flex>
          </Flex>
          {/* --------- TILE: Arrows  --------- */}
          <Flex
            w={{
              base: "calc(33.33vw - 2px)",
              t: "calc(50vw - 2px)",
              d: "calc(33.33vw - 2px)",
            }}
            p="6"
            h={{
              base: "66.66vw",
              t: "50vw",
              d: "33.33vw",
            }}
            borderTop="1px solid #fff"
            borderBottom="1px solid #fff"
            layerStyle="backdropBlurred"
          >
            {/* TODO: Arrows up and down*/}
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
  )
}
