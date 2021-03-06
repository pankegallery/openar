import React, { useEffect } from "react";

import {
  Box,
  Text,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import Image from "next/image";
import Router from "next/router";

import { useOpenARDappWeb3InjectedContext } from "~/providers";
import { useTypedSelector, useWalletLogin } from "~/hooks";

export const WalletControl = ({
  color = "white",
  location = "menu",
  onCloseMenu,
}: {
  color?: string;
  location?: string;
  onCloseMenu?: () => void;
}) => {
  const stateUser = useTypedSelector(({ user }) => user);
  const stateCrypto = useTypedSelector(({ crypto }) => crypto);

  const web3Injected = useOpenARDappWeb3InjectedContext();
  const {
    awaitingUserInteraction,
    walletDisconnect,
    walletLoginError,
    connectInjected,
    connectWalletConnect,
    account,
    isLoggingIn,
    library,
  } = useWalletLogin();

  const walletDisclosure = useDisclosure();

  useEffect(() => {
    if (
      (stateUser.authenticated || stateCrypto.signatureRequired) &&
      walletDisclosure.isOpen &&
      library
    ) {
      walletDisclosure.onClose();
      if (typeof onCloseMenu === "function")
        onCloseMenu.call(null);

      if (Router.asPath.indexOf("/sign") !== 0)
        Router.push("/sign")
    }
  }, [
    stateUser.authenticated,
    stateCrypto.signatureRequired,
    walletDisclosure,
    library,
    onCloseMenu,
  ]);

  return (
    <Box>
      {/* ------- Buttons ------- */}
      <Box>
        {(!account || !stateUser.authenticated) && (
          <Button
            variant={location === "page" ? "outlineBlack" : "menuLink"}
            onClick={() => {
              walletDisclosure.onOpen()              
            }}
            color={color}
          >
            Login
          </Button>
        )}

        {account && stateUser.authenticated && (
          <Button
            variant="menuLink"
            onClick={async () => {
              await walletDisconnect();
            }}
            color={color}
          >
            Logout
          </Button>
        )}
      </Box>

      <Modal
        isOpen={walletDisclosure.isOpen}
        onClose={walletDisclosure.onClose}
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent
          color="white"
          pt="0"
          bg="openar.muddygreen"
          borderRadius="0"
        >
          <ModalHeader pb="0">Connect your wallet</ModalHeader>
          <ModalCloseButton fontSize="lg" />
          <ModalBody pb="6">
            <Text color="white" mb="4">
              Instead of a username and password we use your crypto wallet to authorize access to openAR.
              <br />
              <br />
              If you???re new, recently cleared your cookies or haven???t connected for a while, you???ll need to sign a (free) transaction in your wallet to give our server permission to authorize your account.
            </Text>
            {walletLoginError && (
              <Text color="openar.error">{walletLoginError}</Text>
            )}
            <Button
              colorScheme="openarWhite"
              justifyContent="space-between"
              width="100%"
              mt="4"
              mb="4"
              size="lg"
              variant="outline"
              isDisabled={!web3Injected}
              isLoading={
                isLoggingIn &&
                awaitingUserInteraction &&
                awaitingUserInteraction === "injected"
              }
              rightIcon={
                <Image
                  width="30px"
                  height="30px"
                  src="/images/logo-metamask.svg"
                  alt="MetaMask"
                />
              }
              onClick={async () => {

                try {
                  await connectInjected();

                } catch (err) {
                  console.log("connectInjected Error");
                }
                
              }}
            >
              MetaMask
            </Button>
            <Button
              colorScheme="openarWhite"
              justifyContent="space-between"
              width="100%"
              mb="4"
              size="lg"
              variant="outline"
              isLoading={
                isLoggingIn &&
                awaitingUserInteraction &&
                awaitingUserInteraction === "walletconnect"
              }
              rightIcon={
                <Image
                  width="30px"
                  height="30px"
                  src="/images/logo-walletconnect.svg"
                  alt="WalletConnect"
                />
              }
              onClick={async () => {
                await connectWalletConnect();
              }}
            >
              WalletConnect
            </Button>
            <Text color="white" my="4" textStyle="small">Having trouble? <a href="mailto:contact@openar.art" >Contact support</a></Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
