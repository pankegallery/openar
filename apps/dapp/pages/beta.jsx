import React, { ReactElement } from "react";
import Head from "next/head";

import { LayoutBlank } from "~/components/app";
import {
  Box,
  Grid,
  Flex,
  chakra
} from "@chakra-ui/react";
import Link from "next/link";


const beta = true;

export const Beta = (props) => {

  return (
    <>
      <Head>
        <meta property="og:title" content="OpenAR · Coming soon"key="title" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <Flex
        position="fixed"
        zIndex="100"
        h="100vh"
        w="100%"
        overflow="hidden"
        bg="#EEEF01"
        p="10"
      >
        {/* --------- Text box --------- */}
        <Box m="auto" maxWidth="800px">
          <chakra.h1
            fontSize={{
              base: "3rem",
              t: "4rem"
            }}
            fontWeight="900"
            lineHeight="1.0em"
            mb="2rem"
          >
            The Future is in Beta!
          </chakra.h1>
          <chakra.p
            fontSize={{
              base: "1.3rem",
              t: "1.7rem"
            }}
            fontWeight="semibold"
            lineHeight="1.3em"
          >
            Thanks for checking out OpenAR. We are a small volunteer team working to create something special. During this initial beta period please be patient while we work through some initial bugs and growing pains. Building the world’s first and only cooperative platform for Augmented Reality art takes time. Email <a href="mailto:contact@openar.art">contact@openar.art</a> with your questions and feedback.<br /> <br /> Meanwhile, visit our exhibition in Berlin-Wedding and explore unique and brandnew AR artworks.<br />.<br />
            – The OpenAR team
          </chakra.p>
        </Box>
      </Flex>
    </>
  );
};


export default Beta;
