import { ReactNode } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/react";

import { WalletConnectGate } from "./shared";
import {LoadingBar} from "~/components/app/shared";
import { OverlayMenu} from "../frontend";
import { useSSRSaveMediaQuery} from "~/hooks";
import { useAuthentication } from "~/hooks";

export const LayoutBlank = ({
  mode = "dark",
  modeSize,
  size,
  children,
} : {
  mode?: String;
  modeSize?: String;
  size?: String;
  children: ReactNode;
}) => {
  const [appUser] = useAuthentication();
  
  const isMobile = useSSRSaveMediaQuery("(max-width: 45rem)");
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  let finalMode = mode
  if (modeSize && ((isMobile && size === "mobile") || (isDesktop && size === "desktop"))){
    finalMode == modeSize
  }

  return (
    <WalletConnectGate>
      <Head>
        <title>openAR · A cooperative and crypto platform for AR artworks</title>
        <meta property="og:title" content="openAR · A cooperative and crypto platform for AR artworks" key="title" />
      </Head>
      <LoadingBar color="#000"/>
      <Box className={`site content corner-${mode}`} h="100%">
        {children}
      </Box>
      <OverlayMenu mode={finalMode} />
    </WalletConnectGate>
  );
};
export default LayoutBlank;
