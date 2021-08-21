import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useEthers } from "@usedapp/core";
import { decode, JwtPayload } from "jsonwebtoken";

import {
  useTypedSelector,
  useAuthTabWideLogInOutReload,
  useTypedDispatch,
  useLocalStorage,
  useAppToast,
  useAuthentication,
} from "~/hooks";
import {
  useAuthPreLoginMutation,
  useAuthLoginMutation,
} from "~/hooks/mutations";
import { useWhyDidYouUpdate } from "@chakra-ui/react";

export const WalletConnectGate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [, { logout }] = useAuthentication();
  const triggerToast = useAppToast(
    "Welcome",
    "We hope you enjoy Open AR",
    "success"
  );

  const dispatch = useTypedDispatch();
  const [, setIsConnected] = useLocalStorage("connected", false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [loginStatus] = useAuthTabWideLogInOutReload();

  const stateUser = useTypedSelector(({ user }) => user);

  const router = useRouter();
  const { account, chainId, library, deactivate } = useEthers();

  console.log(stateUser, chainId, account);

  const [preloginMutation] = useAuthPreLoginMutation();
  const [loginMutation] = useAuthLoginMutation();

  useWhyDidYouUpdate("WCG", {
    justConnected: stateUser.justConnected,
    chainId,
    account,
    setIsLoggingIn,
    isLoggingIn,
    preloginMutation,
    library,
    triggerToast,
    deactivate,
    router,
    logout,
    setIsConnected,
  });

  const processError = useCallback(
    (err) => {
      if (err.code && err.code === 4001) {
        triggerToast(
          "Login cancelled",
          "As you've declined to sign the login request we could not log you in.",
          "error"
        );
      } else {
        triggerToast(
          "Ooops",
          "An error happened. We could unfortunately not process your login request right now.",
          "error"
        );
      }
      console.error("WCG Error: ", err);
      setIsConnected(false);
      deactivate();
      logout();
      setIsLoggingIn(false);
    },
    [triggerToast, setIsConnected, deactivate, logout, setIsLoggingIn]
  );

  const processLogin = useCallback(
    async (signedMessage) => {
      const { data, errors } = await loginMutation(account, signedMessage);

      try {
        if (!errors && data.authLogin?.tokens?.access) {
          console.log("toast 1");
          triggerToast();
          setIsLoggingIn(false);
          router.push("/openar/");
        } else if (errors) {
          throw errors[0];
        } else {
          throw Error("Unexpected response in authLoginMutation");
        }
      } catch (err) {
        processError(err);
      }
    },
    [triggerToast, router, account, loginMutation, processError]
  );

  const processPreLoginResult = useCallback(
    async (tokens) => {
      console.log(
        "Pre Login Okay, let's have a look if the return contains a sign requrest "
      );

      const signToken = tokens?.sign?.token;
      const accessToken = tokens?.access?.token;

      if (signToken) {
        if (typeof signToken === "string" && signToken.length > 10) {
          console.log(
            "yes a sign request is set we have thus to do something more ... "
          );

          if (new Date(tokens?.sign.expires).getTime() > Date.now()) {
            const payload = decode(signToken, { json: true });

            if (!payload || !payload?.message)
              throw Error("Signature could not be parsed");

            const signer = library.getSigner();
            const signedMessage = await signer.signMessage(payload.message);

            await processLogin(signedMessage);
          }
        } else {
          throw Error("Signature could not be parsed");
        }
      } else if (accessToken) {
        console.log("toast 2");
        triggerToast();
        setIsLoggingIn(false);
        router.push("/openar/");
      } else {
        throw Error("Required tokens have not been found");
      }
    },
    [library, triggerToast, router, processLogin]
  );

  useEffect(() => {
    const preLogin = async () => {
      console.log("prelogin 1");
      const { data, errors } = await preloginMutation(account);

      try {
        if (!errors && data.authPreLogin?.tokens) {
          await processPreLoginResult(data?.authPreLogin?.tokens);
        } else if (errors) {
          throw errors[0];
        } else {
          throw Error("Unexpected response in authPreLoginMutation");
        }
      } catch (err) {
        processError(err);
      }
    };

    if (!account) return;

    if (!stateUser.justConnected && !isLoggingIn) {
      setIsLoggingIn(true);
      preLogin();
    }
  }, [
    processPreLoginResult,
    processError,
    stateUser.justConnected,
    setIsLoggingIn,
    isLoggingIn,
    preloginMutation,
    account,
  ]);

  useEffect(() => {
    if (loginStatus === "logged-out" && router.asPath !== "/") router.push("/");
  }, [loginStatus, router]);

  return <>{children}</>;
};
