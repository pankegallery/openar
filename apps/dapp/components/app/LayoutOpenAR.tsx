import React, { ReactNode, useContext } from "react";
import { Grid, Box } from "@chakra-ui/react";
import { ThemeProvider } from "styled-components";

import { useSSRSaveMediaQuery } from "~/hooks";
import { Footer, Sidebar, AuthenticationSessionActiveGate } from "./openar";
import { styledComponentsTheme } from "~/theme";
import { WalletConnectGate } from "./shared";
import {LoadingBar} from "~/components/app/shared";

export const LayoutOpenAR = ({ children }: { children: ReactNode }) => {
  const isMobile = useSSRSaveMediaQuery("(max-width: 55em)");

  return (
    <WalletConnectGate>
      <AuthenticationSessionActiveGate>
        <ThemeProvider theme={styledComponentsTheme}>
          <LoadingBar color="#fff"/>
          <Grid
            templateColumns={isMobile ? "100%" : "max(250px, 20vw) 1fr"}
            alignItems="start"
            className="openar content"
            minH="100%"
          >
            <Sidebar />
            <Grid 
              className="main" 
              templateRows={isMobile ? "100%" : "1fr 4rem"}
              minH="100vh"
              >
              <Box>{children}</Box>
              <Footer />
            </Grid>
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
