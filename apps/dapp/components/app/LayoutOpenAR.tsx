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
  const isMobile = useSSRSaveMediaQuery("(max-width: 45em)");

  return (
    <>
      <LoadingBar color="#fff" />
      <style jsx global>{`
        html,body {
          background-color: var(--chakra-colors-openar-muddygreen);
          color: #fff;
        }
      `}</style>
      <ThemeProvider theme={styledComponentsTheme}>
        <WalletConnectGate>
          <AuthenticationSessionActiveGate>
            <Grid
              templateColumns={
                isMobile
                  ? "100%"
                  : "calc(100% - max(230px, 17vw)) max(230px, 17vw) "
              }
              templateRows="1fr"
              alignItems="start"
              className="openar content"
              minH="100%"
              h="100%"
              bg="var(--chakra-colors-openar-muddygreen)"
              overflow="visible"
            >
              <Box h="100%" bg="var(--chakra-colors-openar-muddygreen)">
                {children}
              </Box>

              <Sidebar />
            </Grid>
            <OverlayMenu />
          </AuthenticationSessionActiveGate>
        </WalletConnectGate>
      </ThemeProvider>
    </>
  );
};
export default LayoutOpenAR;
