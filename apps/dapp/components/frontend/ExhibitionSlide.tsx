import type { ReactElement } from "react";
import Head from "next/head";

import { LayoutBlank } from "~/components/app";
import { ExhibitionTitleTile } from "~/components/frontend";
import Arrow from "~/assets/img/arrow.svg";

import { useSSRSaveMediaQuery } from "~/hooks";

import { Box, Grid, Flex, chakra, AspectRatio } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

//import openingBg from "~/assets/img/opening-bg.png";

export const ExhibitionSlide = ({exhibition, beta}: {exhibition: any; beta?: any}) => {
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  const scrollToSlide = (direction) => {

    console.log("to", direction)
    if (typeof window === "undefined") return;

    let topValue;

    switch(direction){
      case "prev":
        topValue = 0 - Math.min(window.innerHeight);
        break;
      case "next":
        topValue = Math.min(window.innerHeight);
        break;
    }

//    if (isDesktop) {
//
//    } else {
//      // smooth scoll the page to artwork listing
//      window.scrollIntoView({
//        behavior: "smooth",
//        block: "start",
//        inline: "nearest",
//      });
//    }

    // smooth scoll the arwork listing
      window.scrollTo({
        top: topValue,
        behavior: "smooth",
      });
  };

//  console.log(exhibition);
  let imgUrl = exhibition.imgUrl
  imgUrl = "https://openar.art/images/exhibitions/opening-bg.png"

  return(
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
        backgroundImage={`url(${imgUrl})`}
        backgroundPosition={exhibition.imgPosition}
        backgroundSize="cover"
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
        scrollSnapAlign="center"
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
            py="20"
            px="10"
            h={{
              base: "66.66vw",
              t: "50vw",
              d: "33.33vw",
            }}
            borderTop="1px solid #fff"
            borderBottom="1px solid #fff"
            layerStyle="backdropBlurred"
            flexDirection="column"
          >
            <Box
              onClick={() => scrollToSlide("prev")}
              width="min-content"
              ml="auto"

            >
              <Arrow className="arrow up" />
            </Box>
            <Box
              onClick={() => scrollToSlide("next")}
              width="min-content"
              ml="auto"
              mt="auto"
            >
              <Arrow className="arrow down" />
            </Box>
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
