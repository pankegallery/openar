import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import Head from "next/head";
import Router from "next/router";

import { LayoutBlank } from "~/components/app";
import { WalletActionRequired } from "~/components/frontend";
import { Box, Text, Button } from "@chakra-ui/react";
import {
  useAuthentication,
  useTypedSelector,
  useWalletLogin,
  useLocalStorage,
} from "~/hooks";

import { appConfig } from "~/config";

const OpenARLogin = () => {
  const {
    account,
    walletLoginRequestSignature,
    walletLoginError,
    walletDisconnect,
    library,
  } = useWalletLogin();
  const [connectedVia] = useLocalStorage("connected", undefined);
  const [appUser, {hasCookies}] = useAuthentication();
  const stateUser = useTypedSelector(({ user }) => user);
  const stateCrypto = useTypedSelector(({ crypto }) => crypto);
  const [isAwaitingSignature, setIsAwaitingSignature] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false)
  
  useEffect(() => {
    if (
      library &&
      library?.provider &&
      account &&
      appUser &&
      stateUser.authenticated && 
      hasCookies()
    ) {
      Router.push("/x/");
      setIsNavigating(true);
    } else {
      if (!stateCrypto.signatureRequired) {
        Router.push(appConfig.reauthenticateRedirectUrl);
        setIsNavigating(true);
      }
    }
  }, [library, library?.provider, account, appUser, stateUser.authenticated, stateCrypto.signatureRequired, hasCookies, setIsNavigating]);

  useEffect(() => {
    if (!library || !library?.provider) {
      if (stateCrypto.signatureRequired && connectedVia === "walletconnect") {
        walletDisconnect();
      }
    }
  }, [library, walletDisconnect, stateCrypto.signatureRequired, connectedVia]);

  return (
    <Box
      p="6"
      bg="var(--chakra-colors-openar-muddygreen)"
      h="100vh"
      w="100vw"
      d="flex"
      flexDirection="column"
    >
      <Head>
        <title>Signature required · OpenAR</title>        
      </Head>

      {!appUser &&
        stateUser.justConnected &&
        !stateUser.authenticated &&
        stateCrypto.loginMessage && (
          <Box
            w="40vw"
            minWidth="600px"
            m="auto"
            >
            <Text mb="4" color="white" mb="4">
              Hello, you&#39;re now connected with your wallet, to fully login
              please sign the login request using the button below.
            </Text>

            {walletLoginError && (
              <Text color="openar.error">{walletLoginError}</Text>
            )}
            <Button
              mt="4"
              onClick={async () => {
                setIsAwaitingSignature(true);
                try {
                  await walletLoginRequestSignature(
                    stateCrypto.loginMessage,
                    account
                  );
                } catch (err) {}
              }}
              variant="outline"
            >
              Sign login request
            </Button>

            <WalletActionRequired
              title="Signature required"
              showClose={false}
              isOpen={isAwaitingSignature && !walletLoginError}
            >
              Please sign the login signature in your connected wallet
            </WalletActionRequired>
          </Box>
        )}
      {!stateUser.justConnected &&
        (appUser || stateUser.authenticated) &&
        !isNavigating && (
          <Box>
            <Text>
              We are logging you in.
            </Text>
          </Box>
        )}
    </Box>
  );
};

OpenARLogin.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default OpenARLogin;
