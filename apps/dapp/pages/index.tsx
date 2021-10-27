import type { ReactElement } from "react";
import Head from "next/head";

import { LayoutBlank } from "~/components/app";
import { Box, Grid, Flex, chakra, AspectRatio } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

import openingBg from "~/assets/img/opening-bg.png";

import { useAuthentication } from "~/hooks";

export const Home = (props) => {
  const [appUser] = useAuthentication();
  const beta = process && process.env.NODE_ENV !== "development" && !appUser;

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={`${props.pageTitle} · ${props.pageSlogan}`}
          key="title"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content={props.pageDescription} />
      </Head>
      {/* --------- Background image --------- */}
      <Box position="fixed" zIndex="100" h="100vh" w="100%" overflow="hidden">
        <Image
          src={openingBg}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 100%"
          alt=""
          role="presentation"
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
            flexDirection="column"
            alignContent="flex-end"
          >
            {!beta && (
              <Link href="/e/openar-art" passHref>
                <chakra.a display="block" mt="auto">
                  <chakra.h1 textStyle="worktitle" mt="auto" mb="2rem">
                    OpenAR.art
                  </chakra.h1>
                  <chakra.p textStyle="subtitle" mb="1rem">
                    Platform launch and groupshow curated by Sakrowski and
                    Jeremy Bailey{" "}
                  </chakra.p>
                  <chakra.p textStyle="workmeta">
                    29 August 2021 – 4 October 2021{" "}
                  </chakra.p>
                </chakra.a>
              </Link>
            )}
            {beta && (
              <Link href="/beta" passHref>
                <chakra.a display="block" mt="auto">
                  <chakra.h1 textStyle="worktitle" mt="auto" mb="2rem">
                    OpenAR.art
                  </chakra.h1>
                  <chakra.p textStyle="subtitle" mb="1rem">
                    Groupshow curated by Sakrowski and Jeremy Bailey{" "}
                  </chakra.p>
                  <chakra.p textStyle="workmeta">
                    29 August 2021 – 4 October 2021{" "}
                  </chakra.p>
                </chakra.a>
              </Link>
            )}
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
      <Box
        className="betaVersion"
        position="fixed"
        left={{
          base: "auto",
          d: 0,
        }}
        right={{
          base: 0,
          d: "auto",
        }}
        transform={{
          base: "rotate(-90deg)",
          d: "none",
        }}
        bottom="0"
        zIndex="220"
        width={{
          base: "50vw",
          t: "25vw",
        }}
        height={{
          base: "50vw",
          t: "25vw",
        }}
      >
        {!beta && (
          <AspectRatio ratio={1}>
            <chakra.img
              src="images/corner.svg"
              width="100%"
              height="100%"
              alt="We are in beta"
            />
          </AspectRatio>
        )}
        {beta && (
          <chakra.span cursor="pointer">
            <Link href="/beta" passHref>
              <AspectRatio ratio={1}>
                <chakra.img
                  src="images/corner.svg"
                  width="100%"
                  height="100%"
                  alt="We are in beta"
                />
              </AspectRatio>
            </Link>
          </chakra.span>
        )}
      </Box>
    </>
  );
};

export const getStaticProps = () => {
  return {
    props: {
      pageTitle: "OpenAR",
      pageSlogan: "The cooperative and crypto platform for AR artworks",
      pageDescription:
        "OpenAR makes it easy to exhibit, collect and discuss Augmented Reality (AR) works and allows artists to sell their works as NFTs. The open platform is organised as a cooperative, profits will be shared among the artists.",
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Home;
