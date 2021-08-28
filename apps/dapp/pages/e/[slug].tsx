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

export const Exhibition = (props) => {
  return (
    <>
      <Head>
        <title>{props.title} · OpenAR</title>
        <meta property="og:title" content={`${props.title} · OpenAR`} key="title" />
      </Head>
      {/* --------- Background image --------- */}
      <Box
        position="fixed"
        zIndex="100"
        h="100vh"
        w="100%"
        overflow="hidden"

      >
        <Image src={openingBg} layout="fill" objectFit="cover" objectPosition="50% 100%" alt="" role="presentation" />
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
          <Link href="/">
            <a>
              <Arrow class="arrow" />
            </a>
          </Link>
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
                <chakra.h1 textStyle="worktitle" mt="auto" mb="2rem">{props.title}</chakra.h1>
                <chakra.p textStyle="subtitle" mb="1rem">{props.subtitle}</chakra.p>
                <chakra.p textStyle="workmeta">{props.meta}</chakra.p>
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
            <chakra.p
              my="auto !important"
              fontWeight="normal"
            >{props.description}</chakra.p>
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

Exhibition.getInitialProps = () => {
  return {
    title: "OpenAR.art",
    subtitle: "Platform launch and groupshow curated by Sakrowski and Jeremy Bailey",
    meta: "29 August 2021 – 4 October 2021",
    description: "On the occasion of the launch of the new platform “openar.art”, panke.gallery presents a hybrid group exhibition with experimental Augmented Reality works. The open platform makes it easy to exhibit, collect and discuss Augmented Reality works and allows artists to sell their works as NFTs. Since the platform is organized as a cooperative, profits will be shared among the artists. As part of the project openAR, the exhibition and platform have been developed in collaboration between workshop participants and digital artists Jeremy Bailey, Sarah Buser and Tamás Páll. The works examine the possibilities of AR technology in artistic applications. Visual, acoustic and performative Augmented Reality formats can be experienced in the exhibition.",
    image: {openingBg}
  }
}

Exhibition.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Exhibition;
