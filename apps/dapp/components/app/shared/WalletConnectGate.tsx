import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Router from "next/router";

import { appConfig } from "~/config";

import {
  useTypedSelector,
  useAuthTabWideLogInOutReload,
  useWalletLogin,
} from "~/hooks";

export const WalletConnectGate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoggingIn, account, setIsLoggingIn, walletLoginPreLogin } =
    useWalletLogin();

  const [loginStatus] = useAuthTabWideLogInOutReload();

  const stateUser = useTypedSelector(({ user }) => user);
  const stateCrypto = useTypedSelector(({ crypto }) => crypto);

  useEffect(() => {
    console.log("WalletConnectGate account", account);
    const preLogin = async () => {
      await walletLoginPreLogin(account);
    };

    if (!account) return;

    if (
      stateUser.justConnected &&
      !stateUser.authenticated &&
      !isLoggingIn &&
      !stateCrypto.signatureRequired
    ) {
      setIsLoggingIn(true);
      preLogin();
    }
  }, [
    walletLoginPreLogin,
    account,
    stateUser.justConnected,
    stateUser.authenticated,
    isLoggingIn,
    setIsLoggingIn,
    stateCrypto.signatureRequired,
  ]);

  // TODO: check if tab wide logout is working as it should get tab wide logout running
  useEffect(() => {
    if (
      loginStatus === "logged-out" &&
      !["/", "/openar/connect", "/openar/login"].includes(Router.asPath) &&
      !isLoggingIn
    ) {
      console.log("trigger redirect to /");
      Router.replace("/");
    }
  }, [loginStatus, isLoggingIn]);

  useEffect(() => {
    const needToReconnectToWalletConnect = async () => {
      try {
        // Get from local storage by key
        let stored = window.localStorage.getItem("connected");
        // Parse stored json or if none return initialValue
        const connected = stored ? JSON.parse(stored) : false;

        stored = window.localStorage.getItem("walletconnect");
        const walletConnect = stored ? JSON.parse(stored) : false;

        if (connected && walletConnect.connected) {
          console.log("Wallet Connect might be connected");
          if (Router.pathname !== appConfig.reauthenticateRedirectUrl) {
            console.log("So go through the login flow to establish a new connection");
            Router.replace(appConfig.reauthenticateRedirectUrl);        
          }
            
        }
      } catch (error) {}
    };

    needToReconnectToWalletConnect();

  }, []);

  return <>{children}</>;
};
