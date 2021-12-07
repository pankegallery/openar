import { ReactNode } from "react";
import Head from "next/head";
import { Box, Flex, chakra } from "@chakra-ui/react";
import { ActiveLink } from "~/components/ui";

import { Header } from "./site";
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
        height={{
          base: "auto",
          d: "100vh",
        }}
        layerStyle="backdropLight"
        overflow={{
          d: "hidden"
        }}>
        <Header />
        {children}
      </Box>
      <OverlayMenu mode="light" />
    </WalletConnectGate>
  );
};
export default LayoutSite;
