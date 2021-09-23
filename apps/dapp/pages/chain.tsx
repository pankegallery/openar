import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { LayoutBlank } from "~/components/app";
import { Box, Text, Button, HStack } from "@chakra-ui/react";
import { useAuthentication, useTypedSelector, useWalletLogin } from "~/hooks";
import { decimalToHex } from "~/utils";
import { appConfig, chainInfo } from "~/config";

const Chain = () => {
  const { account, walletDisconnect, library } = useWalletLogin();
  const [appUser] = useAuthentication();
  const stateUser = useTypedSelector(({ user }) => user);
  const stateCrypto = useTypedSelector(({ crypto }) => crypto);
  const router = useRouter();
  const [chainChangeError, setChainChangeError] = useState(undefined);

  if (
    library &&
    library?.provider &&
    account &&
    appUser &&
    stateUser.authenticated
  ) {
    router.push("/x/");
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
      if (stateUser.justConnected && !account) {
        router.push("/login");
      }
    }
  }, [library, walletDisconnect, stateUser.justConnected, router, account]);

  const switchChain = async () => {
    setChainChangeError(undefined);
    const chainIdHex = `0x${decimalToHex(appConfig.chainId)}`;
    try {
      await library.send("wallet_switchEthereumChain", [
        { chainId: chainIdHex },
      ]);
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (err.code === 4902) {
        setChainChangeError(
          `We could not switch the chain automatically. Try configuring the xDai chain in your wallet? `
        );
      } else if (err.message.indexOf("already pending") > -1) {
        setChainChangeError("You have already a pending request in your wallet. Please cancel that one in order to be able to proceed");
      } else {
        setChainChangeError(err.message);
      }
    }
  };

  const configureChain = async () => {
    setChainChangeError(undefined);

    if (!chainInfo[100]) setChainChangeError(`Chain configuration not found`);

    try {
      await library.send("wallet_addEthereumChain", [chainInfo[100]]);
    } catch (err) {
      if (err.message.indexOf("already pending") > -1) {
        setChainChangeError("You have already a pending request in your wallet. Please cancel that one in order to be able to proceed");
      } else {
        setChainChangeError(err.message);
      }
    }
  };
  return (
    <Box p="6">
      <Head>
        <title>OpenAR</title>
        <meta name="description" content="TODO:" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Text mb="4" maxW="950" pr="150px">
        Your wallet is currently not set to handle the xDai chain. Have you
        added the xDai chain to your wallet? Can you switch to see the xDai
        chain? Some browser wallets (like MetaMask) permit to configure or
        switch the chain to xDai using the buttons below. If this fails please
        configure and change the chain in your wallet as described here (TODO:
        link to how to){" "}
      </Text>
      {chainChangeError && <Text color="openar.error">{chainChangeError}</Text>}
      <HStack mt="6">
        <Button onClick={switchChain} variant="outlineBlack">
          Switch to xDai chain
        </Button>
        <Button onClick={configureChain} variant="outlineBlack">
          Add xDai chain to wallet
        </Button>
      </HStack>
    </Box>
  );
};

Chain.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default Chain;
