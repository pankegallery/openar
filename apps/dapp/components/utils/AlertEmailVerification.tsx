import { useEffect, useCallback, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { useTypedDispatch, useAuthentication, useTypedSelector } from "~/hooks";
import Arrow from "~/assets/img/arrow.svg";

import { userEmailVerificationState } from "~/redux/slices/user";
import {
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import { useAuthRequestEmailVerificationEmail } from "~/hooks/mutations";

const GET_EMAIL_VERIFICATION_STATUS = gql`
  query userProfileRead($ethAddress: String!) {
    userProfileRead(ethAddress: $ethAddress) {
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
    };
  }, []);

  const [appUser, { isLoggedIn }] = useAuthentication();

  const { data, error } = useQuery(GET_EMAIL_VERIFICATION_STATUS, {
    skip: !isLoggedIn() || emailVerified === "yes" || !showPopup,
    variables: {
      ethAddress: (appUser?.ethAddress ?? "").toLowerCase(),
    },
  });

  let localEmailVerified =
    typeof data?.userProfileRead?.emailVerified === "boolean"
      ? data?.userProfileRead?.emailVerified &&
        data?.userProfileRead?.email &&
        `${data?.userProfileRead?.email}`.trim() !== ""
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
      {data &&
        showPopup &&
        data?.userProfileRead?.email &&
        !error &&
        localEmailVerified === "no" &&
        !requestMutationResults.loading && (
          <Box
            className="header"
            p="6"
            w="100%"
            textAlign="left"
            flexDirection="column"
            layerStyle="backdropGradient"
            borderBottom="1px solid #fff"
          >
            <Box m="6">
              <Text pb="6">
                <b>{title}</b><br/>{desc}
              </Text>
              {!requestMutationResults.error &&
                !isRequestingError &&
                !requestMutationResults.called && (
                  <Button
                    borderColor="white"
                    color="white"
                    isLoading={!!requestMutationResults.loading}
                    variant="outline"
                    onClick={requestAnotherEmail}
                  >
                    Request verification email
                  </Button>
                )}
            </Box>
          </Box>
        )}
    </>
  );
};
