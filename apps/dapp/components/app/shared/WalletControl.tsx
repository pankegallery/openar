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
import { useRouter } from "next/router";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";

import { UnsupportedChainIdError } from "@web3-react/core";

import { walletConntectConnector, injectedConnector } from "~/services/crypto";

import { useTypedDispatch, useLocalStorage, useAuthentication } from "~/hooks";
import user from "~/services/user";
import { authSetJustConnected } from "~/redux/slices/user";
import { useOpenARDappWeb3InjectedContext } from "~/providers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import { useAuthLogoutMutation } from "~/hooks/mutations";

export const WalletControl = () => {
  const [appUser, {logoutAndRedirect}] = useAuthentication();
  const router = useRouter();
  const [, setIsConnected] = useLocalStorage("connected", false);

  const web3Injected = useOpenARDappWeb3InjectedContext();
  const [logoutMutation] = useAuthLogoutMutation();
  const dispatch = useTypedDispatch();

  const walletDisclosure = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWC, setIsLoadingWC] = useState(false);

  const [isError, setIsError] = useState({
    state: false,
    msg: "",
  });
  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React<Web3Provider>()

  console.log("WC", activate, deactivate, account, library, active);
  
  const setError = (error: any) => {
    let msg: string;
    if (error instanceof NoEthereumProviderError) {
      msg =
        "No Ethereum browser extension detected, install MetaMask for your browser, or use Wallet connect to use a wallet on your phone.";
    } else if (error instanceof UnsupportedChainIdError) {
      msg = "You're connected to an unsupported network.";
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect
    ) {
      msg = "Please authorize our website to access your Ethereum account.";
    } else {
      if (error?.message && error.message.indexOf("eth_requestAccounts") > -1) {
        msg =
          "Please check if your MetaMask extension. You will be able to go on with the process from there.";
      } else {
        msg = "Oops, an error occured. Please reload the page and try again.";
      }

      // TODO: remove this should not be there.
      console.error(error);
    }

    setIsError({
      state: true,
      msg,
    });
    setIsLoading(false);
    setIsLoadingWC(false);
  };

  const connectToWallet = async (useWalletConnect: boolean) => {
    try {
      if (useWalletConnect) {
        setIsLoadingWC(true);
        await activate(walletConntectConnector, undefined, true);
      } else {
        setIsLoading(true);
        await activate(injectedConnector, undefined, true);
      }
      setIsConnected(true);
      setIsLoading(false);
      setIsLoadingWC(false);
      walletDisclosure.onClose();

      dispatch(authSetJustConnected());
    } catch (error) {
      setIsConnected(false);
      // TODO: remove
      console.log(error);
      setError(error);
    }
  };

  return (
    <Box>
      <Box>
        {!account && (
          <Button
            colorScheme="openarWhite"
            variant="outline"
            onClick={() => {
              setIsLoading(false);
              setIsLoadingWC(false);
              setIsError({
                state: false,
                msg: "",
              });
              walletDisclosure.onOpen();
            }}
          >
            Connect to a wallet
          </Button>
        )}

        {account && (
          <Button
            colorScheme="openarWhite"
            variant="outline"
            onClick={async () => {
              setIsConnected(false);
              deactivate();
              
              if (appUser)
                try {
                  await logoutMutation(appUser.id);
                } catch (err) {}

              await user.logout();
              router.push("/");
            }}
          >
            Disconnect
          </Button>
        )}

        <Button
          colorScheme="openarWhite"
          variant="outline"
          onClick={async () => {
            console.log(1);
            try {
              console.log(2, account);
              console.log(library, library.getSigner, library.getSigner());
              const signer = library.getSigner();
              console.log(3);
              const signedMessage = await signer.signMessage("xxx");
              console.log(4);
              console.log(signedMessage);
              alert(signedMessage);
            } catch (err) {
              console.log(5);
              console.log("sign", err);
            }
          }}
        >
          Sign
        </Button>
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
            {isError.state && <Text color="openar.error">{isError.msg}</Text>}
            <Button
              colorScheme="openarWhite"
              justifyContent="space-between"
              width="100%"
              mt="4"
              mb="4"
              size="lg"
              variant="outline"
              isDisabled={!web3Injected}
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
              colorScheme="openarWhite"
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
