import { ReactNode } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/react";

import { Footer, Header } from "./site";
import { WalletConnectGate } from "./shared";
import {LoadingBar} from "~/components/app/shared";

export const LayoutSite = ({ children }: { children: ReactNode }) => {
  return (
    <WalletConnectGate>
      
      <LoadingBar color="#000"/>
      <Box className="site content">
        <main>
          <Header />
          {children}
          <Footer />
        </main>
      </Box>
    </WalletConnectGate>
  );
};
export default LayoutSite;
