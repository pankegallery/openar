import React, { useState, useEffect, ReactElement } from "react";

import { LayoutBlank } from "~/components/app";
import {
  Button,
  Box,
  Heading,
  Text,
  Flex,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { LoadingIcon } from "~/components/ui";

import { decode } from "jsonwebtoken";

import {
  useAuthVerifyEmailMutation,
  useAuthRequestEmailVerificationEmail,
} from "~/hooks/mutations";
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
  const [hasRequestedEmail, setHasRequestedEmail] = useState(false);
  const [isRequestingError, setIsRequestingError] = useState(false);

  const confirmingToken = verificationMutationResults.loading;
  const confirmationError = verificationMutationResults.error;
  const router = useRouter();

  useEffect(() => {
    const token = (router.query.token ?? "") as string;

    const confirmToken = async () => {
      try {
        const payload = decode(token, { json: true });

        if (
          !payload ||
          (payload.exp && payload.exp * 1000 < Date.now()) ||
          !payload?.user?.id
        )
          throw Error("Incorrect token provided");

        if (decode(token)) {
          const { errors } = await verificationMutation(token);
          if (!errors) {
            setIsTokenConfirmed(true);
          } else {
            setIsTokenError(true);
          }
        } else {
          setIsTokenError(true);
        }
      } catch (err) {
        setIsTokenError(true);
      }
    };

    if (token) confirmToken();
  }, [router.query.token]); // eslint-disable-line react-hooks/exhaustive-deps

  const requestAnotherEmail = async () => {
    setIsRequestingError(false);

    try {
      if (appUser?.id) {
        await requestMutation(appUser.id);
        setHasRequestedEmail(true);
      } else {
        setHasRequestedEmail(true);
        setIsRequestingError(true);
      }
    } catch (err) {
      setHasRequestedEmail(true);
      setIsRequestingError(true);
    }
  };

  let content = (
    <Flex height="220" alignItems="center" justify="center" position="relative">
      <LoadingIcon position="fixed" type="inline" size={90} />
    </Flex>
  );

  let buttonDashboardLogin = (
    <Text>
      <Link
        href={isLoggedIn() ? "/x/" : appConfig.reauthenticateRedirectUrl}
        passHref
      >
        <Button as={ChakraLink} variant="outlineBlack">
          {isLoggedIn() ? "Goto dashboard" : "Goto login"}
        </Button>
      </Link>
    </Text>
  );

  if (hasRequestedEmail)
    content = (
      <>
        <Box mb="6">
          <Heading as="h2" mb="2">
            {(isRequestingError || requestMutationResults.error) &&
              "We are sorry"}
            {!isRequestingError && !requestMutationResults.error && "Thank you"}
          </Heading>
          <Text>
            {(isRequestingError || requestMutationResults.error) &&
              "We could not process your request. Please try again later"}
            {!isRequestingError &&
              !requestMutationResults.error &&
              "We've sent you another email. Please check your inbox!"}
          </Text>
        </Box>

        <>{buttonDashboardLogin}</>
      </>
    );

  if (
    !confirmingToken &&
    (isTokenError || confirmationError) &&
    !hasRequestedEmail
  )
    content = (
      <>
        <Box mb="6">
          <Heading as="h2" mb="2">
            We are sorry
          </Heading>
        </Box>
        <Text>
          We could not verify your email address based on the information
          provided.{" "}
          {!isLoggedIn() &&
            "Please login to request another verification email."}
        </Text>

        {isLoggedIn() && (
          <>
            <Text>
              <Button
                onClick={requestAnotherEmail}
                isLoading={requestMutationResults.loading}
                variant="outlineBlack"
              >
                Request a new verification email.
              </Button>
            </Text>
          </>
        )}
        {!isLoggedIn() && <>{buttonDashboardLogin}</>}
      </>
    );

  if (!confirmingToken && isTokenConfirmed)
    content = (
      <>
        <Box mb="6">
          <Heading as="h2" mb="2">
            Thank you!
          </Heading>
        </Box>
        <Text>Your email has been confirmed.</Text>

        <>{buttonDashboardLogin}</>
      </>
    );

  return (
    <Box p="6" minH="100%">
      {content}
    </Box>
  );
};

EmailConfirmation.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBlank>{page}</LayoutBlank>;
};

export default EmailConfirmation;
