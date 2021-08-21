import { ReactNode } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/react";

import { Footer, Header } from "./site";
import { WalletConnectGate} from "./shared";

export const LayoutSite = ({ children }: { children: ReactNode }) => {
  return (
    <Box className="site content">
      <main>
        <Header />
        {children}
        <Footer />
      </main>
    </Box>
  );
};
export default LayoutSite;
