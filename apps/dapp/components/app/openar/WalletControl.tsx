import React, { useState } from "react";
// TODO: https://github.com/NoahZinsmeister/web3-react/blob/v6/example/pages/index.tsx
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
import { useEthers, useConfig } from "@usedapp/core";
import { useRouter } from "next/router";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'

import { InjectedConnector } from '@web3-react/injected-connector'

import {UnsupportedChainIdError } from '@web3-react/core'
import { walletConntectConnector } from "~/services/crypto";
import { useTypedSelector, useTypedDispatch } from "~/hooks";
import user from "~/services/user";
import { authSetJustConnected } from "~/redux/slices/user";



export const WalletControl = () => {
  const { supportedChains } = useConfig()
  const dispatch = useTypedDispatch();

  const { connected } = useTypedSelector(({ crypto }) => crypto);
  const walletDisclosure = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWC, setIsLoadingWC] = useState(false);
  const [isError, setIsError] = useState({
    state: false,
    msg: ""
  });

  const { activate, activateBrowserWallet, deactivate } = useEthers();
  const router = useRouter();

  const setError = (error: any) => {
    console.log(error);
    let msg;
    if (error instanceof NoEthereumProviderError) {
      msg = 'No Ethereum browser extension detected, install MetaMask for your browser, or use Wallet connect to use a wallet on your phone.'
    } else if (error instanceof UnsupportedChainIdError) {
      msg = "You're connected to an unsupported network."
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect
    ) {
      msg = 'Please authorize our website to access your Ethereum account.'
    } else {
      console.error(error)
      msg = 'Oops, an error occured. Please reload the page and try again.'
    }
    
    setIsError({
      state: true,
      msg
    });
    setIsLoading(false);
  }

  const connectToWallet = async (useWalletConnect: boolean) => {

    try {
      setIsLoading(true);
      if (useWalletConnect) {
        await activate(walletConntectConnector, undefined, true);
      } else {
        const injectedConnector = new InjectedConnector({ supportedChainIds: supportedChains })
        await activate(injectedConnector, undefined, true);
      }
      
      setIsLoading(false);
      walletDisclosure.onClose();
      dispatch(authSetJustConnected());
      router.push("/openar/");
    } catch (error) { 
      // TODO: remove
      console.log(error);
      setError(error);
    }
  };

  return (
    <Box>
      <Box
        order={[-1, null, null, 2]}
        textAlign={["left", null, null, "right"]}
      >
        {!connected && (
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={() => {
              setIsLoading(false);
              setIsLoadingWC(false);
              setIsError({
                state: false,
                msg: ""
              });
              walletDisclosure.onOpen();
            }}
          >
            Connect to a wallet
          </Button>
        )}

        {connected && (
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={async () => {
              deactivate();
              await user.logout();
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
        <ModalOverlay />
        <ModalContent color="black" pt="0">
          <ModalHeader pb="0">Connect to a wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="black" mb="4">
              Instead of a login we use your wallet to give you access to
              OpenAR. This is a two step process:
              <br />
              <br />
              (1) You connect to the wallet, then
              <br />
              (2) If you&#39;re new or haven&#39;t been around for a while we
              ask you sign a transaction (which is free) to give out server a
              chance to check if you are who you claim you are.
            </Text>
            {isError.state && (
              <Text color="openar.error">
                {isError.msg}
              </Text>
            )}
            <Button
              justifyContent="space-between"
              width="100%"
              mt="4"
              mb="4"
              size="lg"
              variant="outline"
              isLoading={isLoading}
              rightIcon={
                <Image
                  width="30px"
                  height="30px"
                  src="/images/logo-metamask.png"
                  alt="MetaMask"
                />
              }
              onClick={async () => {
                await connectToWallet(false);
              }}
            >
              MetaMask
            </Button>
            <Button
              justifyContent="space-between"
              width="100%"
              mb="4"
              size="lg"
              variant="outline"
              isLoading={isLoadingWC}
              rightIcon={
                <Image
                  width="30px"
                  height="30px"
                  src="/images/logo-walletconnect.svg"
                  alt="WalletConnect"
                />
              }
              onClick={async () => {
                await connectToWallet(true);
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
