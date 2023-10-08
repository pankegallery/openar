import React, { useState, useEffect, ReactElement } from "react";

import { LayoutBlank } from "~/components/app";
import {
  Button,
  Box,
  Heading,
  Text,
  Flex,
  Link as ChakraLink,
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
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";

import { LoadingIcon } from "~/components/ui";

import { decode } from "jsonwebtoken";

import {
  useAuthVerifyEmailMutation,
  useAuthRequestEmailVerificationEmail,
} from "~/hooks/mutations";
import { useResetPassword } from "~/hooks/useEmailAuthentication";
import { useAuthentication } from "~/hooks";
import { appConfig } from "~/config";
const EmailConfirmation = () => {
  const [appUser, { isLoggedIn }] = useAuthentication();

  const [verificationMutation, verificationMutationResults] =
    useAuthVerifyEmailMutation();
  const [requestMutation, requestMutationResults] =
    useAuthRequestEmailVerificationEmail();

  const [isTokenConfirmed, setIsTokenConfirmed] = useState(false);
  const [isTokenError, setIsTokenError] = useState(false);

  const router = useRouter();

  const [userPassword, setUserPassword] = useState("")
  const [userPasswordConfirm, setUserPasswordConfirm] = useState("")
  const [resetButtonEnabled, setResetButtonEnabled] = useState(false)

  const { 
    resetPassword,
    resetPasswordError,
    resetPasswordLoading,
    resetPasswordSuccess,
    setResetPasswordSuccess
  } = useResetPassword()

  useEffect(() => {
    const token = (router.query.token ?? "") as string;
  
    const confirmToken = () => {
      try {
        const payload = decode(token, { json: true });

        if (
          !payload ||
          (payload.exp && payload.exp * 1000 < Date.now()) ||
          !payload?.user?.id
        )
          throw Error("Incorrect token provided");
        
        setIsTokenConfirmed(true)
      } catch (err) {
        console.error("Error decoding token")
        setIsTokenError(true);
      }
    };
    
    if (token && !isTokenConfirmed) confirmToken();
    // else setIsTokenError(true)

    console.log(userPassword, userPasswordConfirm)
    let resetButtonStateEnabled = (userPassword.length > 0) && (userPassword == userPasswordConfirm) && isTokenConfirmed
    if (resetButtonStateEnabled != resetButtonEnabled) {
      setResetButtonEnabled(resetButtonStateEnabled)
    }

  }, [router.query.token, userPassword, userPasswordConfirm, resetButtonEnabled, setResetButtonEnabled, isTokenConfirmed, setIsTokenConfirmed]);
  
  return (
    <Modal
      isOpen={true}
      onClose={() => {{}}}
    >
    <ModalOverlay bg="blackAlpha.800" />
    <ModalContent
      color="white"
      pt="0"
      bg="openar.muddygreen"
      borderRadius="0"
    >
      <ModalHeader pb="0">Reset Password</ModalHeader>
      { isTokenError && 
            <ModalBody pb="6">
              <Text color="white" mb="4">
                Invalid token.
              </Text>
            </ModalBody>
    
      }
      { !isTokenError && 
        <ModalBody pb="6">
          <Text color="white" mb="4">
            Please type your new password below:
          </Text>
          <Stack spacing={1}>
            <Input 
              placeholder='New password' 
              type="password" 
              size='md' 
              value={userPassword} 
              onChange={(e) => setUserPassword(e.target.value)} 
            />

            <Input 
              placeholder='Re-type your new password' 
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
              isLoading={false}
              disabled={!resetButtonEnabled}
              onClick={async () => {
                await resetPassword(userPassword, (router.query.token ?? "") as string)
              }}
            >
              Reset Password
            </Button>
            {resetPasswordError && (
              <Text mt="2" color="openar.error">{resetPasswordError}</Text>
            )}
            {resetPasswordSuccess && (
              <Text mt="2" color="openar.white">Password reset complete, you can go back to <a href="#" onClick={async () => {
                Router.push('/login')
              }}>login</a>.</Text>
            )}
        </ModalBody>
      }
    </ModalContent>
  </Modal>      

  );
};

EmailConfirmation.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default EmailConfirmation;
