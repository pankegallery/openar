import { ReactNode } from "react";
import Head from "next/head";
import { Box, Flex, chakra } from "@chakra-ui/react";
import { ActiveLink } from "~/components/ui";

import { Footer, Header } from "./site";
import { WalletConnectGate } from "./shared";
import { LoadingBar } from "~/components/app/shared";
import { OverlayMenu } from "../frontend";

export const LayoutSite = ({ children }: { children?: ReactNode }) => {
  return (
    <WalletConnectGate>
      <LoadingBar color="#000" />
      <Box
        className="site content text light"
        w="100vw"
        h="100%"
        layerStyle="backdropLight"
        overflow={{
          d: "hidden"
        }}>
        <Header />
        {children}
        <Footer />
      </Box>
      <OverlayMenu mode="light" />
    </WalletConnectGate>
  );
};
export default LayoutSite;
