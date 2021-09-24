import React, { useEffect } from "react";
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
  const {
    isLoggingIn,
    account,
    chainId,
    setIsLoggingIn,
    walletLoginPreLogin,
    walletDisconnect,
    library,
  } = useWalletLogin();

  const [loginStatus] = useAuthTabWideLogInOutReload();

  const stateUser = useTypedSelector(({ user }) => user);
  const stateCrypto = useTypedSelector(({ crypto }) => crypto);

  useEffect(() => {
    console.log("WalletConnectGate account", account);
    const preLogin = async () => {
      console.log("WalletConnectGate preLogin");
      await walletLoginPreLogin(account);
    };

    // no account no chain == not logged in 
    // bail early. 
    if (!account || !chainId) return;

    if (!library || !library?.provider) {
      // looks like that the library has not been initalized 
      // but a signature is required
      // better to logout and get the user to reauthenticate
      if (stateCrypto.signatureRequired) {
        console.log(
          "Wallet connect gate no library but signature required. Make sure to fully logout"
        );
        walletDisconnect();
        Router.push(appConfig.reauthenticateRedirectUrl);
        return;
      }
    }

    // wallet is not connected to the correct chain
    // let's get the user to rectify that
    if (
      chainId !== parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) &&
      Router.asPath.indexOf("/chain") === -1
    ) {
      Router.replace("/chain");
      return;
    }

    // all good? if just connecting then ask for the pre login. 
    if (
      stateUser.justConnected &&
      !stateUser.authenticated &&
      !isLoggingIn &&
      !stateCrypto.signatureRequired 
    ) {
      console.log("trigger pre login ...");
      setIsLoggingIn(true);
      preLogin();
    }
  }, [
    walletLoginPreLogin,
    account,
    library,
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
      Router.asPath.indexOf("/x/") > -1 &&
      !isLoggingIn
    ) {
      console.log("trigger redirect to / as loginStatus logged-out");
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

        if (
          connected === "walletconnect" &&
          walletConnect.connected &&
          !account
        ) {
          console.log("Wallet Connect might be connected", account);
          if (Router.pathname !== appConfig.reauthenticateRedirectUrl) {
            console.log(
              "So go through the login flow to establish a new connection",
              account
            );
            Router.push(appConfig.reauthenticateRedirectUrl);
          }
        }
      } catch (error) {}
    };

    needToReconnectToWalletConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(`Account ${account}`);
  return <>{children}</>;
};
