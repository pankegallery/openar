import React, { useEffect, useState } from "react";

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
  Stack,
  Input,
  useDisclosure,
} from "@chakra-ui/react";

import Image from "next/image";
import Router from "next/router";

import { useOpenARDappWeb3InjectedContext } from "~/providers";
import { useTypedSelector, useWalletLogin } from "~/hooks";
import { delay } from "lodash";
import { useEmailRegistration } from "~/hooks/useEmailRegistration";

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

  const [registrationEmail, setRegistrationEmail] = useState("")
  const [registrationPassword, setRegistrationPassword] = useState("")

  const {
    registerByEmail,
    registrationError
  } = useEmailRegistration();

  const walletDisclosure = useDisclosure();
  const emailRegisterDisclosure = useDisclosure();

  console.log("[WalletControl]: ", stateUser, account)

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

  const isAuthenticated = stateUser.authenticated
  const isEmailOnlyUser = isAuthenticated && (!account)

  return (
    <Box>
      {/* ------- Buttons ------- */}
      <Box>
        {!isAuthenticated && (
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

        {isAuthenticated && (
          <Button
            variant="menuLink"
            onClick={async () => {
              if (isEmailOnlyUser) {
                await walletDisconnect();
              } else {
                await walletDisconnect();
              }              
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
              If you’re new, recently cleared your cookies or haven’t connected for a while, you’ll need to sign a (free) transaction in your wallet to give our server permission to authorize your account.
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

            <ModalHeader pb="0" pt="2" ml="0" mr="0" pl="0" pr="0">Or authenticate using email</ModalHeader>

            <Stack spacing={1}>
              <Input placeholder='Email' size='md' />
              <Input placeholder='Password' type="password" size='md' />              
            </Stack>            

            <Button
                colorScheme="openarWhite"
                justifyContent="space-between"
                width="100%"
                mb="0"
                mt="4"
                size="lg"
                variant="outline"
                isLoading={
                  isLoggingIn &&
                  awaitingUserInteraction &&
                  awaitingUserInteraction === "walletconnect"
                }
                onClick={async () => {
                  // await walletDisclosure.onClose()
                  // await delay(500)
                  // await emailRegisterDisclosure.onOpen()
                }}
              >
                Sign In
              </Button>            

            <Text color="white" my="4" mb="4" textStyle="small">Don't have an account? <a href="#" onClick={async () => {
              walletDisclosure.onClose()              
              emailRegisterDisclosure.onOpen()
            }}>Register here</a></Text>

            <Text color="white" my="4" textStyle="small">Having trouble? <a href="mailto:contact@openar.art" >Contact support</a></Text>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={emailRegisterDisclosure.isOpen}
        onClose={emailRegisterDisclosure.onClose}
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent
          color="white"
          pt="0"
          bg="openar.muddygreen"
          borderRadius="0"
        >
          <ModalHeader pb="0">Register by email</ModalHeader>
          <ModalCloseButton fontSize="lg" />
          <ModalBody pb="6">
            <Text color="white" mb="4">
              Register below by typing your email address and password.
            </Text>
            {walletLoginError && (
              <Text color="openar.error">{walletLoginError}</Text>
            )}

            <Stack spacing={1}>
              <Input 
                placeholder='Email' 
                size='md' 
                value={registrationEmail} 
                onChange={(e) => setRegistrationEmail(e.target.value)} 
              />

              <Input 
                placeholder='Password' 
                type="password" 
                size='md' 
                value={registrationPassword} 
                onChange={(e) => setRegistrationPassword(e.target.value)} 
              />

              <Input placeholder='Re-type your password' type="password" size='md' />              
            </Stack>            

            <Button
                colorScheme="openarWhite"
                justifyContent="space-between"
                width="100%"
                mb="0"
                mt="4"
                size="lg"
                variant="outline"
                isLoading={
                  isLoggingIn &&
                  awaitingUserInteraction &&
                  awaitingUserInteraction === "walletconnect"
                }
                onClick={async () => {
                  await registerByEmail(registrationEmail, registrationPassword)
                  Router.push("/x/");                                    
                  // await walletDisclosure.onClose()
                  // await delay(500)
                  // await emailRegisterDisclosure.onOpen()
                }}
              >
                Register
              </Button>            

            <Text color="white" my="4" mb="4" textStyle="small">Already have an account? <a href="#" onClick={async () => {
              emailRegisterDisclosure.onClose()
              walletDisclosure.onOpen()
              // await delay(500)              
            }}>Sign in here</a></Text>

            <Text color="white" my="4" textStyle="small">Having trouble? <a href="mailto:contact@openar.art" >Contact support</a></Text>
          </ModalBody>
        </ModalContent>
      </Modal>      
    </Box>
  );
};
