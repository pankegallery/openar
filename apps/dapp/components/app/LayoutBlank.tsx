import { ReactNode } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/react";

import { WalletConnectGate } from "./shared";
import {LoadingBar} from "~/components/app/shared";
import { Menu} from "../frontend";

export const LayoutBlank = ({ children }: { children: ReactNode }) => {
  return (
    <WalletConnectGate>

      <LoadingBar color="#000"/>
      <Box className="site content">
        {children}
      </Box>
      <Menu/>
    </WalletConnectGate>
  );
};
export default LayoutBlank;
