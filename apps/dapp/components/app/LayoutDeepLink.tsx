import { ReactNode } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/react";
import {LoadingBar} from "~/components/app/shared";

export const LayoutDeepLink = ({mode = "dark", children} : {mode?: any, children: ReactNode}) => {

  return (<>

      <Head>
        <title>openAR · An open platform for augmented reality (AR) artworks</title>
        <meta property="og:title" content="openAR · An open platform for augmented reality (AR) artworks" key="title" />
      </Head>
      <Box className={`site content corner-${mode}`} h="100%">
        {children}
      </Box>
    </>  
  );
};
export default LayoutDeepLink;
