import { ReactNode } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/react";

import { WalletConnectGate } from "./shared";
import {LoadingBar} from "~/components/app/shared";
import { OverlayMenu} from "../frontend";
import { useSSRSaveMediaQuery} from "~/hooks";

export const LayoutBlank = ({
  mode = "dark",
  modeSize,
  size,
  beta = false,
  children,
} : {
  mode?: String;
  modeSize?: String;
  size?: String;
  beta?: boolean;
  children: ReactNode;
}) => {

  const isMobile = useSSRSaveMediaQuery("(max-width: 45rem)");
  const isDesktop = useSSRSaveMediaQuery("(min-width: 75rem)");

  let finalMode = mode
  if (modeSize && ((isMobile && size === "mobile") || (isDesktop && size === "desktop"))){
    finalMode == modeSize
  }

  console.log("mode", finalMode)

  return (
    <WalletConnectGate>
      <Head>
        <title>OpenAR · A cooperative and crypto platform for AR artworks</title>
        <meta property="og:title" content="OpenAR · A cooperative and crypto platform for AR artworks" key="title" />
      </Head>
      <LoadingBar color="#000"/>
      <Box className={`site content corner-${mode}`}>
        {children}
      </Box>
      {!beta&&
        <OverlayMenu mode={finalMode} />
      }
    </WalletConnectGate>
  );
};
export default LayoutBlank;
