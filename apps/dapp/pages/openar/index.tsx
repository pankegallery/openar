import type { ReactElement } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { LayoutOpenAR } from "~/components/app";
import { Box } from "@chakra-ui/layout";
import { useConfigContext } from "~/providers";
import { RestrictPageAccess, AlertEmailVerification} from "~/components/utils";
import { Heading } from "@chakra-ui/react";

// import { useEthers, useEtherBalance } from "@usedapp/core";
// import { formatUnits } from "@ethersproject/units";

const OpenARDashboard = () => {
  // const { activateBrowserWallet, deactivate, account } = useEthers();
  // const userBalance = useEtherBalance(account);
  // const stakingBalance = useEtherBalance(STAKING_CONTRACT);
  const appConfig = useConfigContext();
  
  return (
    <>
    <AlertEmailVerification />
    <Box p="3">
      <Heading as="h1">Welcome</Heading>
      Please update your profile and upload artworks and objects via the navigation at the right.
      
    </Box>
    </>
  );
};

OpenARDashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default RestrictPageAccess(OpenARDashboard, "profileRead");
