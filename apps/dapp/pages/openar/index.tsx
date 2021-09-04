import type { ReactElement } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { LayoutOpenAR } from "~/components/app";
import { Box } from "@chakra-ui/layout";
import { RestrictPageAccess, AlertEmailVerification } from "~/components/utils";
import { Heading, Text } from "@chakra-ui/react";
import { useSSRSaveMediaQuery } from "~/hooks";

// import { useEthers, useEtherBalance } from "@usedapp/core";
// import { formatUnits } from "@ethersproject/units";

const OpenARDashboard = () => {
  // const { activateBrowserWallet, deactivate, account } = useEthers();
  // const userBalance = useEtherBalance(account);
  // const stakingBalance = useEtherBalance(STAKING_CONTRACT);

  const isTablet= useSSRSaveMediaQuery("(min-width: 55em)");

  return (
    <>
      <AlertEmailVerification />
      <Box p="3">
        <Heading as="h1">Welcome</Heading>
        {!isTablet && (
          <Text>
            <Link href="/openar/artworks/">Dashboard</Link>
            <br />
            <Link href="/openar/artworks/">Artworks</Link>
            <br />
            <Link href="/openar/artworks/">Artworks</Link>
            <br />
          </Text>
        )}

        {isTablet && (
          <Text>
            Please update your profile and upload artworks and objects via the
            navigation at the right.
          </Text>
        )}
      </Box>
    </>
  );
};

OpenARDashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default RestrictPageAccess(OpenARDashboard, "profileRead");
