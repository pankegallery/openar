import React, { ReactNode, useContext } from "react";
import { Grid, Box } from "@chakra-ui/react";
import { ThemeProvider } from "styled-components";

import { useSSRSaveMediaQuery } from "~/hooks";
import { Footer, Sidebar, AuthenticationSessionActiveGate } from "./openar";
import { styledComponentsTheme } from "~/theme";
import { WalletConnectGate } from "./shared";
import { LoadingBar } from "~/components/app/shared";
import "@fontsource/source-code-pro";
import { OverlayMenu } from "../frontend";

export const LayoutOpenAR = ({ children }: { children: ReactNode }) => {
  const isMobile = useSSRSaveMediaQuery("(max-width: 55em)");

  return (
    <ThemeProvider theme={styledComponentsTheme}>
      <WalletConnectGate>
        <AuthenticationSessionActiveGate>
          <LoadingBar color="#fff" />
          <Grid
            templateColumns={
              isMobile
                ? "100%"
                : "calc(100% - max(350px, 20vw)) max(350px, 20vw) "
            }
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
          <OverlayMenu />
        </AuthenticationSessionActiveGate>
      </WalletConnectGate>
      <style jsx global>{`
        body {
          background-color: var(--chakra-colors-openar-muddygreen);
          color: #fff;
        }
      `}</style>
    </ThemeProvider>
  );
};
export default LayoutOpenAR;
