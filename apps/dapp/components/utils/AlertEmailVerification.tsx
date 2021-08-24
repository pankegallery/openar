import { useEffect, useCallback, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { AlertBox } from "~/components/ui";
import { useTypedDispatch, useAuthentication, useTypedSelector } from "~/hooks";

import { userEmailVerificationState } from "~/redux/slices/user";
import {
  AlertDescription,
  AlertTitle,
  Box,
  Grid,
  Button,
} from "@chakra-ui/react";
import { useAuthRequestEmailVerificationEmail } from "~/hooks/mutations";

const GET_EMAIL_VERIFICATION_STATUS = gql`
  query userProfileRead($id: Int!) {
    userProfileRead(id: $id) {
      emailVerified
      email
    }
  }
`;

export const AlertEmailVerification = () => {
  const { emailVerified } = useTypedSelector(({ user }) => user);
  const [isRequestingError, setIsRequestingError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [requestMutation, requestMutationResults] =
    useAuthRequestEmailVerificationEmail();

  const dispatch = useTypedDispatch();
  const wrappedDispatch = useCallback(
    (state) => {
      dispatch(userEmailVerificationState(state));
    },
    [dispatch]
  );

  useEffect(() => {
    setShowPopup(true);
    return () => {
      setShowPopup(false);
    }
  }, [])
  
  const [appUser, { isLoggedIn }] = useAuthentication();

  const { data, error } = useQuery(GET_EMAIL_VERIFICATION_STATUS, {
    skip: !isLoggedIn() || emailVerified === "yes" || !showPopup,
    variables: {
      id: appUser?.id ?? 0,
    },
  });

  let localEmailVerified =
    typeof data?.userProfileRead?.emailVerified === "boolean"
      ? data?.userProfileRead?.emailVerified && data?.userProfileRead?.email && `${data?.userProfileRead?.email}`.trim() !== ""
        ? "yes"
        : "no"
      : emailVerified;

  useEffect(() => {
    let mounted = true;

    if (localEmailVerified !== emailVerified) {
      if (mounted) wrappedDispatch(localEmailVerified);
    }

    return () => {
      mounted = false;
    };
  }, [wrappedDispatch, emailVerified, localEmailVerified]);

  const requestAnotherEmail = async () => {
    setIsRequestingError(false);

    try {
      if (appUser?.id) {
        await requestMutation(appUser.id);
      } else {
        setIsRequestingError(true);
      }
    } catch (err) {
      setIsRequestingError(true);
    }
  };

  let title = "You have not confirmed your email address, yet.";
  let desc =
    "Please check your inbox and follow the link provided in the email. In case the email didn't come through you can request another email by clicking the button.";

  if (requestMutationResults.error) {
    title = "We are sorry";
    desc = "Something went wrong. Please try again in a little bit.";
  }

  if (requestMutationResults.called && requestMutationResults.data) {
    title = "Thank you!";
    desc = "We've sent you another email. Please check your inbox.";
  }

  return (
    <>
      {showPopup && !error &&
        localEmailVerified === "no" &&
        !requestMutationResults.loading && (
          <AlertBox status="warning" hasClose>
            <Grid
              w="100%"
              templateColumns={{ base: "1fr", tw: "66% 34%" }}
              gap="4"
              alignItems={{ base: "start", tw: "center" }}
            >
              <Box>
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{desc}</AlertDescription>
              </Box>
              <Box textAlign="center">
                {!requestMutationResults.error &&
                  !isRequestingError &&
                  !requestMutationResults.called && (
                    <Button
                      borderColor="black"
                      color="black"
                      isLoading={!!requestMutationResults.loading}
                      variant="outline"
                      onClick={requestAnotherEmail}
                    >
                      Request verification email
                    </Button>
                  )}
              </Box>
            </Grid>
          </AlertBox>
        )}
    </>
  );
};
