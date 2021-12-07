import type { ReactElement } from "react";
import Head from "next/head";

import { LayoutBlank } from "~/components/app";
import { Box, Text, Heading } from "@chakra-ui/react";

const Custom404 = () => {
  return (
    <Box p="6">
      <Head>
        <title>Page not found - openAR</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      
      <Box>
        <Heading as="h1">Not found</Heading>
        <Text mb="4">
          The requested url could not be found.
        </Text>
      </Box>
      
    </Box>
  );
};

Custom404.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Custom404;
