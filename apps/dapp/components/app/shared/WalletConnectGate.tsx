import React, { useEffect, useState, useCallback } from "react";

import Router from "next/router";

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
    setIsLoggingIn,
    walletLoginPreLogin,
  } = useWalletLogin();

  const [loginStatus] = useAuthTabWideLogInOutReload();

  const stateUser = useTypedSelector(({ user }) => user);
  const stateCrypto = useTypedSelector(({ crypto }) => crypto);

  useEffect(() => {
    const preLogin = async () => {
      await walletLoginPreLogin(account)
    }

    if (!account) return;

    if (stateUser.justConnected && !stateUser.authenticated && !isLoggingIn && !stateCrypto.signatureRequired) {
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
    stateCrypto.signatureRequired
  ]);
  
  // TODO: get tab wid logout running 
  useEffect(() => {
    console.log(loginStatus, isLoggingIn);
    if (loginStatus === "logged-out" && Router.asPath !== "/" && !isLoggingIn) {
      console.log("trigger redirect to /");
      Router.push("/");
    }
  }, [loginStatus, isLoggingIn]);

  return <>{children}</>;
};
