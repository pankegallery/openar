import React, {useEffect} from "react";

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

import { useOpenARDappWeb3InjectedContext } from "~/providers";
import { useTypedSelector, useWalletLogin } from "~/hooks";

export const WalletControl = () => {
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
  } = useWalletLogin();

  const walletDisclosure = useDisclosure();

  useEffect(() => {
    if ((stateUser.authenticated || stateCrypto.signatureRequired) && walletDisclosure.isOpen)
      walletDisclosure.onClose();
    
  }, [stateUser.authenticated, stateCrypto.signatureRequired, walletDisclosure])
  
  return (
    <Box>
      <Box>
        {!account && (
          <Button
            variant="menuLink"
            onClick={walletDisclosure.onOpen}

          >
            Login
          </Button>
        )}

        {account && (
          <Button
            variant="menuLink"
            onClick={async () => {
              await walletDisconnect();
            }}
          >
            Disconnect
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
          <ModalHeader pb="0">Connect to your wallet</ModalHeader>
          <ModalCloseButton fontSize="lg" />
          <ModalBody>
            <Text color="white" mb="4">
              Instead of a login we use your wallet to give you access to
              OpenAR. This is a two step process:
              <br />
              <br />
              (1) You connect to the wallet, then
              <br />
              (2) If you&#39;re new, haven&#39;t been around for a while, or
              cleared your cookies we ask you sign a transaction (which is free)
              to give our server a chance to check if you are who you claim you
              are.
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
                isLoggingIn && awaitingUserInteraction &&
                awaitingUserInteraction === "injected"
              }
              rightIcon={
                <Image
                  width="30px"
                  height="30px"
                  src="/images/logo-metamask.png"
                  alt="MetaMask"
                />
              }
              onClick={async () => {
                await connectInjected();
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
                isLoggingIn && awaitingUserInteraction &&
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
