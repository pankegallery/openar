import React, { ReactNode, useContext } from "react";
import { Grid } from "@chakra-ui/react";
import { ThemeProvider } from "styled-components";

import { useSSRSaveMediaQuery } from "~/hooks";
import { Footer, Sidebar, AuthenticationSessionActiveGate } from "./openar";
import { styledComponentsTheme } from "~/theme";

export const LayoutOpenAR = ({ children }: { children: ReactNode }) => {
  const isMobile = useSSRSaveMediaQuery("(max-width: 55em)");

  return (
    <AuthenticationSessionActiveGate>
      <ThemeProvider theme={styledComponentsTheme}>
        <Grid
          w={isMobile ? "100%" : "max(350px, 20vw)"}
          templateColumns={isMobile ? "1" : "2"}
          gap="4"
          alignItems="start"
          pt={{ base: "3.8rem", tw: "4rem" }}
          pb={{ base: "1.5rem", tw: "1.5rem" }}
          className="openar content"
        >
          <Sidebar />
          <main>
            {children}
            <Footer />
          </main>
        </Grid>
        <style jsx global>{`
          body {
            background-color: #a0a387;
            color: #fff;
          }
        `}</style>
      </ThemeProvider>
    </AuthenticationSessionActiveGate>
  );
};
export default LayoutOpenAR;
