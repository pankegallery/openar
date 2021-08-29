import { ReactNode } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/react";

import { WalletConnectGate } from "./shared";
import {LoadingBar} from "~/components/app/shared";
import { OverlayMenu} from "../frontend";

export const LayoutBlank = ({mode = "dark", beta = false, children} : {mode?: any, beta?: boolean, children: ReactNode}) => {

  console.log(beta)

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
        <OverlayMenu mode={mode} />
      }
    </WalletConnectGate>
  );
};
export default LayoutBlank;
