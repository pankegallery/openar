import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { LayoutBlank } from "~/components/app";
import { Box, Text, Button } from "@chakra-ui/react";
import { useAuthentication, useTypedSelector, useWalletLogin } from "~/hooks";
import { WalletControl } from "~/components/app/shared";

const OpenARLogin = () => {
  const { account, walletDisconnect, library } = useWalletLogin();
  const [appUser] = useAuthentication();
  const stateUser = useTypedSelector(({ user }) => user);
  const stateCrypto = useTypedSelector(({ crypto }) => crypto);
  const router = useRouter();

  let navigating = false;

  if (
    library &&
    library?.provider &&
    account &&
    appUser &&
    stateUser.authenticated
  ) {
    router.push("/x/");
    navigating = true;
  }

  useEffect(() => {
    if (!library || !library?.provider) {
      if (stateCrypto.signatureRequired) {
        walletDisconnect();
      }
    }
  }, [
    library,
    walletDisconnect,
    stateUser.justConnected,
    stateCrypto.signatureRequired,
  ]);

  useEffect(() => {
    if (library || library?.provider) {
      if (stateUser.justConnected && account) {
        router.push("/sign");
      }
    }
  }, [
    library,
    walletDisconnect,
    stateUser.justConnected,
    router,
    account,
  ]);

  return (
    <Box p="6">
      <Head>
        <title>OpenAR</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Text mb="4">Hello, please click to connect your wallet to openAR.</Text>

      {((
        (!appUser || !stateUser.authenticated) &&
        !navigating) ||
        !account) && (
        <Box mt="6">
          <WalletControl location="page" color="black" />
        </Box>
      )}
    </Box>
  );
};

OpenARLogin.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default OpenARLogin;
