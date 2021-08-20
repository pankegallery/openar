import React, { useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Grid } from "@chakra-ui/react";
import { ThemeProvider } from "styled-components";

import type { AppProps } from "next/app";
import { useSSRSaveMediaQuery } from "~/hooks";
import { Footer, Sidebar } from "./openar";
import { styledComponentsTheme } from "~/theme";

export const LayoutOpenAr = ({ children }: AppProps) => {
  const router = useRouter();
  const isMobile = useSSRSaveMediaQuery("(max-width: 55em)");

  return (
    <ThemeProvider theme={styledComponentsTheme}>
      <Grid
        w={isMobile ? "100%" : "max(350px, 20vw)"}
        templateColumns={isMobile ? "1" : "2"}
        gap="4"
        alignItems="start"
        pt={{ base: "3.8rem", tw: "4rem" }}
        pb={{ base: "1.5rem", tw: "1.5rem" }}
        className="content"
      >
        <Sidebar />
        <Box>
          {children}
          <Footer />
        </Box>
      </Grid>
    </ThemeProvider>
  );
};
export default LayoutOpenAr;
