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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

import Image from "next/image";
import Router from "next/router";

import { useOpenARDappWeb3InjectedContext } from "~/providers";
import { useTypedSelector, useWalletLogin } from "~/hooks";
import { delay } from "lodash";
import { useEmailRegistration, useEmailLogin, useResetPasswordRequest } from "~/hooks/useEmailAuthentication";

const validateEmail = (email) => {
  return email.includes("@") && email.length > 4
};

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

  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userPasswordConfirm, setUserPasswordConfirm] = useState("")
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false)

  const {
    registerByEmail,
    registrationError,    
  } = useEmailRegistration();

  const { 
    loginByEmail,
    loginError,
    setLoginError,
    loginByEmailLoading,
    loginByEmailSuccess
  } = useEmailLogin()

  const { 
    resetPasswordRequest,
    resetPasswordError,
    resetPasswordLoading,
    resetPasswordSuccess,
    setResetPasswordSuccess
  } = useResetPasswordRequest()

  const walletDisclosure = useDisclosure({defaultIsOpen: false});
  const emailRegisterDisclosure = useDisclosure();
  const forgotPasswordDisclosure = useDisclosure();

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

    if (stateUser.authenticated && loginByEmailSuccess && walletDisclosure.isOpen) {
      Router.push("/x")
    }

    if (emailRegisterDisclosure.isOpen) {
      let registerButtonStateEnabled = (userPassword.length > 0) && (userPassword == userPasswordConfirm) && validateEmail(userEmail)
      if (registerButtonStateEnabled != registerButtonEnabled) {
        setRegisterButtonEnabled(registerButtonStateEnabled)
      }
    }
    
  }, [
    stateUser.authenticated,
    stateCrypto.signatureRequired,
    loginByEmailSuccess,
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
          <Box>
            <Button
              variant={location === "page" ? "outlineBlack" : "menuLink"}
              onClick={() => {
                emailRegisterDisclosure.onClose()                            
                walletDisclosure.onOpen()                            
              }}
              color={color}
            >
              Login
            </Button>
          </Box>
        )}
        

        {!isAuthenticated && (
          <Box>
            <Button
              variant={location === "page" ? "outlineBlack" : "menuLink"}
              onClick={() => {
                walletDisclosure.onClose()                            
                emailRegisterDisclosure.onOpen()                            
              }}
              color={color}
            >
              Register
            </Button>
          </Box>
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
        onClose={() => {
          walletDisclosure.onClose()
          setUserEmail("")
          setUserPassword("")
          setLoginError(null)
        }}
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent
          color="white"
          pt="0"
          bg="openar.muddygreen"
          borderRadius="0"
        >
          <ModalHeader pb="0">Authenticate via email</ModalHeader>
          <ModalCloseButton fontSize="lg" />
          <ModalBody pb="6">          

            <Stack spacing={1}>
            <Input 
                placeholder='Email' 
                size='md' 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)} 
              />

              <Input 
                placeholder='Password' 
                type="password" 
                size='md' 
                value={userPassword} 
                onChange={(e) => setUserPassword(e.target.value)} 
              />
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
                  loginByEmailLoading
                }
                onClick={async () => {
                  const result = await loginByEmail(userEmail, userPassword)
                  // console.log("Finalized loginByEmail")
                  // console.log(result)
                  // console.log(loginError)
                  // Router.push("/x/");                                    
                }}
              >
                Sign In
            </Button>         

            {loginError && (
              <Text mt="2" color="openar.error">{loginError}</Text>
            )}


            <Text color="white" my="4" mb="4" textStyle="small">Don't have an account? <a href="#" onClick={async () => {
              walletDisclosure.onClose()              
              emailRegisterDisclosure.onOpen()
            }}>Register here</a></Text>

            <Text color="white" my="4" mb="4" textStyle="small">Forgot your password? <a href="#" onClick={async () => {
              emailRegisterDisclosure.onClose()
              walletDisclosure.onClose()
              forgotPasswordDisclosure.onOpen()
              // await delay(500)              
            }}>Reset it here</a></Text>

            <Accordion defaultIndex={[-1]} allowMultiple>
              <AccordionItem>
            
                <AccordionButton ml="0" pl="0" mb="2" _hover={{ background: 'none' }}>
                  <Box as="span" flex='1' textAlign='left'>
                    <ModalHeader pb="0" pt="2" ml="0" mr="0" pl="0" pr="0">Or connect your wallet (legacy)</ModalHeader>
                  </Box>
                  <AccordionIcon mt="3"/>
                </AccordionButton>

                <AccordionPanel ml="0" pl="0" mr="0" pr="0">
                  <Text color="white" mb="4" textStyle="small">
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
                </AccordionPanel>

              </AccordionItem>
            </Accordion>


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
            <Stack spacing={1}>
              <Input 
                placeholder='Email' 
                size='md' 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)} 
              />

              <Input 
                placeholder='Password' 
                type="password" 
                size='md' 
                value={userPassword} 
                onChange={(e) => setUserPassword(e.target.value)} 
              />

              <Input 
                placeholder='Re-type your password' 
                type="password" 
                size='md' 
                value={userPasswordConfirm} 
                onChange={(e) => setUserPasswordConfirm(e.target.value)} 
              />
              
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
                disabled={!registerButtonEnabled}
                onClick={async () => {
                  await registerByEmail(userEmail, userPassword)
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

      <Modal
        isOpen={forgotPasswordDisclosure.isOpen}
        onClose={forgotPasswordDisclosure.onClose}
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent
          color="white"
          pt="0"
          bg="openar.muddygreen"
          borderRadius="0"
        >
          <ModalHeader pb="0">Reset your password</ModalHeader>
          <ModalCloseButton fontSize="lg" />
          <ModalBody pb="6">
            <Text color="white" mb="4">
              Type your email address below in order to request a new password.
            </Text>
            <Stack spacing={1}>
              <Input 
                placeholder='Email' 
                size='md' 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)} 
              />              
            </Stack>            

            <Button
                colorScheme="openarWhite"
                justifyContent="space-between"
                width="100%"
                mb="0"
                mt="4"
                size="lg"
                variant="outline"
                isLoading={resetPasswordLoading}
                disabled={userEmail.length == 0}
                onClick={async () => {
                  await resetPasswordRequest(userEmail)                                   
                }}
              >
                Request new password
            </Button>            
            {resetPasswordError && (
              <Text mt="2" color="openar.error">{resetPasswordError}</Text>
            )}
            {resetPasswordSuccess && (
              <Text mt="2" color="openar.white">Request complete, please follow the link in your email in order to reset your password.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>      

    </Box>
  );
};
