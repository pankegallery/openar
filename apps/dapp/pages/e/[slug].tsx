import type { ReactElement } from "react";
import Head from "next/head";

import { LayoutBlank } from "~/components/app";
import {
  useDisclosure,
  Portal,
  Button,
  Box,
  Grid,
  Flex,
  Fade,
  chakra
} from "@chakra-ui/react";
import Link from "next/link";
import { WalletControl } from "~/components/app/shared"
import Image from 'next/image'

import openingBg from "~/assets/img/opening-bg.png";
import Arrow from "~/assets/img/arrow.svg";


export const Home = () => {
  return (
    <>
      {/* --------- Background image --------- */}
      <Box
        position="fixed"
        zIndex="100"
        h="100vh"
        w="100%"
        overflow="hidden"

      >
        <Image src={openingBg} layout="fill" objectFit="cover" objectPosition="50% 100%" />
      </Box>

      {/* --------- Grid --------- */}
      <Grid
        position="fixed"
        backgroundImage="url(/image/opening-bg.png)"
        className="exhibition"
        top="0"
        left="0"
        w="100%"
        p=""
        h="100vh"
        zIndex="200"
        templateRows={{
          base: "66.66vw 66.66vw auto",
          t: "var(--openar-header-height-desktop) 50vw auto",
          d: "var(--openar-header-height-desktop) 33.33vw auto",
        }}
        color="white"
        overflow="hidden"
      >
        {/* --------- Header row --------- */}
        <Flex
          w="100%"
          direction="row"
          p={{
              base: "6",
              t: "10"
            }}
        >
          <Arrow
            class="arrow"
          />
        </Flex>
        {/* --------- Exhibition title and arrows --------- */}
        <Flex
          className="main"
          w="100%"
          ml={{
            base: "0",
            t: "0",
            d: "0",
          }}
          borderBottom="1px solid #fff"
          flexWrap="wrap"
          direction="row"
          zIndex="302"
        >
          {/* --------- Exhibition title  --------- */}
          <Flex
            borderTop="1px solid #fff"
            borderRight="1px solid #fff"
            borderLeft={{
              base: "none",
              d: "1px solid #fff",
            }}
            p={{
              base: "6",
              t: "10"
            }}
            pb={{
              base: "6",
              t: "20"
            }}
            w={{
              base: "66.66vw",
              t: "50vw",
              d: "calc(33.33vw + 1px)",
            }}
            h={{
              base: "calc(66.66vw - 1px)",
              t: "calc(50vw - 1px)",
              d: "calc(33.33vw - 1px)",
            }}
            layerStyle="backdropDark"
            flexDirection="column"
            alignContent="flex-end"
          >
            <Link href="/e/openar-art" passHref>
              <chakra.a display="block" mt="auto">
                <chakra.h1 textStyle="worktitle" mt="auto" mb="2rem">OpenAR.art</chakra.h1>
                <chakra.p textStyle="subtitle" mb="1rem">Platform launch and groupshow
    curated by Sakrowski and Jeremy Bailey </chakra.p>
                <chakra.p textStyle="workmeta">29 August 2021 – 4 October 2021 </chakra.p>
              </chakra.a>
            </Link>
          </Flex>
          {/* --------- Description  --------- */}
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
            <chakra.p my="auto">But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. </chakra.p>
          </Flex>
        </Flex>
        {/* --------- Footer  --------- */}
        <Flex
          className="footer"
          p="6"
          pr="10"
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
          textAlign="right"
        >
          <chakra.p textStyle="bigLabel" ml="auto">
            Artworks</chakra.p>
          <Arrow
            class="arrow down"
          />
        </Flex>
      </Grid>
      <Flex
        className="artworks"
        layerStyle="backdropLight"
        position="absolute"
        zIndex="210"
        top="var(--openar-header-height-desktop)"
        left={{
          base: "0",
          d: "66.66vw"
        }}
        w={{
          base: "calc(33.33vw - 2px)",
          t: "calc(50vw - 2px)",
          d: "calc(33.33vw - 2px)",
        }}
        h={{
          base: "auto",
          d: "calc(100vh - var(--openar-header-height-desktop)",
        }}
        p="6"
        flexDirection="column"

      >
        <Box>ARTWORKS HERE</Box>
      </Flex>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Home;
