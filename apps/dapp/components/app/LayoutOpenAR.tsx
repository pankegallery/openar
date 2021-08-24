import React, { ReactNode, useContext } from "react";
import { Grid, Box } from "@chakra-ui/react";
import { ThemeProvider } from "styled-components";

import { useSSRSaveMediaQuery } from "~/hooks";
import { Footer, Sidebar, AuthenticationSessionActiveGate } from "./openar";
import { styledComponentsTheme } from "~/theme";
import { WalletConnectGate } from "./shared";
import {LoadingBar} from "~/components/app/shared";
import "@fontsource/source-code-pro"

export const LayoutOpenAR = ({ children }: { children: ReactNode }) => {
  const isMobile = useSSRSaveMediaQuery("(max-width: 55em)");

  return (
    <WalletConnectGate>
      <AuthenticationSessionActiveGate>
        <ThemeProvider theme={styledComponentsTheme}>
          <LoadingBar color="#fff"/>
          <Grid
            templateColumns={isMobile ? "100%" : "1fr max(250px, 20vw) "}
            alignItems="start"
            className="openar content"
            minH="100%"
          >
            
            <Grid 
              className="main" 
              templateRows={isMobile ? "100%" : "1fr 4rem"}
              minH="100vh"
              >
              <Box>{children}</Box>
              <Footer />
            </Grid>
            <Sidebar />
          </Grid>
          <style jsx global>{`
            body {
              background-color: var(--chakra-colors-openar-muddygreen);
              color: #fff;
            }
          `}</style>
        </ThemeProvider>
      </AuthenticationSessionActiveGate>
    </WalletConnectGate>
  );
};
export default LayoutOpenAR; 
