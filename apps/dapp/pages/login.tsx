import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import Head from "next/head";
import Router from "next/router";

import { LayoutBlank } from "~/components/app";
import { Box, Text, Button } from "@chakra-ui/react";
import { useAuthentication, useTypedSelector, useWalletLogin } from "~/hooks";
import { WalletControl } from "~/components/app/shared";

const OpenARLogin = () => {
  const { account, walletDisconnect, library } = useWalletLogin();
  const [appUser, { hasCookies }] = useAuthentication();
  const stateUser = useTypedSelector(({ user }) => user);
  const stateCrypto = useTypedSelector(({ crypto }) => crypto);
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    console.log(library, appUser, stateUser, hasCookies())
    if (
      // library &&
      // library?.provider &&
      // account &&
      appUser &&
      stateUser.authenticated && 
      hasCookies()
    ) {
      Router.push("/x/");
      setIsNavigating(true);
    }
  }, [library, library?.provider, account, appUser, stateUser.authenticated, hasCookies]);

  useEffect(() => {
    if (library || library?.provider) {
      if (stateUser.justConnected && account && stateCrypto.signatureRequired) {
        Router.push("/sign");
      }
    }
  }, [
    library,
    walletDisconnect,
    stateUser.justConnected,
    stateCrypto.signatureRequired,
    account,
  ]);

  return (
    <Box p="6">
      {/* <Text mb="4">Please use your email or crypto wallet (deprecated) to login to openAR.</Text> */}

      {(((!appUser || !stateUser.authenticated) && !isNavigating) ||
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
