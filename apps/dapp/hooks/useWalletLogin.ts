import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useState, useCallback } from "react";
import Router from "next/router";
import { decode } from "jsonwebtoken";
import { utils as ethersUtils } from "ethers";

import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";

import { useLocalStorage, useAppToast, useStableCallback } from "~/hooks";

import { walletConntectConnector, injectedConnector } from "~/services/crypto";
import { authSetJustConnected } from "~/redux/slices/user";
import { useOpenARDappWeb3InjectedContext } from "~/providers";
import { cryptoStateUpdate } from "~/redux/slices/crypto";

import {
  useAuthPreLoginMutation,
  useAuthLoginMutation,
  useAuthLogoutMutation,
} from "~/hooks/mutations";

import user from "~/services/user";
import { getAppUser } from "~/services/authentication";
import { store } from "~/redux";
import { appConfig } from "~/config";

export function useWalletLogin() {
  const [connectedVia, setIsConnected] = useLocalStorage(
    "connected",
    undefined
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [awaitingUserInteraction, setAwaitingUserInteraction] = useState<
    string | null
  >(null);
  const [walletLoginError, setWalletLoginError] = useState<string | null>(null);

  const [preloginMutation] = useAuthPreLoginMutation();
  const [loginMutation] = useAuthLoginMutation();
  const [logoutMutation] = useAuthLogoutMutation();

  const triggerToast = useAppToast(
    "Welcome",
    "We hope you enjoy Open AR",
    "success"
  );

  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React<Web3Provider>();

  const handleError = useCallback((error: any) => {
    let msg: string;
    if (error instanceof NoEthereumProviderError) {
      msg =
        "No Ethereum browser extension detected, install MetaMask for your browser, or use Wallet connect to use a wallet on your phone.";
    } else if (error instanceof UnsupportedChainIdError) {
      msg = "You're connected to an unsupported network.";
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect
    ) {
      msg = "Please authorize our website to access your Ethereum account.";
    } else if (error?.message) {
      if (error?.message && error.message.indexOf("eth_requestAccounts") > -1) {
        msg =
          "Please check if your MetaMask extension. You will be able to go on with the process from there.";
      } else {
        if (error?.code && error?.code === 4001) {
          msg =
            "Please accept to sign the message otherwise we can't log you in";
        } else {
          msg = error?.message;
        }
      }
    } else {
      msg = "Oops, an error occured. Please reload the page and try again.";
    }

    setWalletLoginError(msg);
    setAwaitingUserInteraction(null);
  }, []);

  const connected = useCallback(async () => {
    store.dispatch(authSetJustConnected());
  }, []);

  const walletDisconnect = useStableCallback(async () => {
    try {
      setWalletLoginError(null);
      setIsLoggingIn(false);
      setIsConnected(undefined);
      setAwaitingUserInteraction(null);

      const appUser = getAppUser();
      if (appUser) {
        try {
          await logoutMutation(appUser.id);
        } catch (err) {
          // just fail silently
        }
      }
      await user.logout();
      console.log("walletDisconnect() user.logout();")
      deactivate();

      try {
        Router.replace(appConfig.reauthenticateRedirectUrl);
      } catch (err) {}
    } catch (error) {
      setIsConnected(undefined);
      handleError(error);
    }
  });

  const walletReconnect = useStableCallback(async (connector: string) => {
    try {
      setWalletLoginError(null);
      setIsLoggingIn(false);
      setIsConnected(connector);
      setAwaitingUserInteraction(connector);

      const appUser = getAppUser();
      if (appUser) {
        try {
          await logoutMutation(appUser.id);
        } catch (err) {
          // just fail silently
        }
      }
      await user.logout();
      Router.replace(appConfig.reauthenticateRedirectUrl);
    } catch (error) {
      setIsConnected(connector);
      handleError(error);
    }
  });


  const connectWalletConnect = useCallback(async () => {
    try {
      setIsLoggingIn(false);
      setWalletLoginError(null);
      setAwaitingUserInteraction("walletconnect");
      console.log("connectWalletConnect() activate()")
      await activate(walletConntectConnector, undefined, true);
      setIsConnected("walletconnect");
      connected();
    } catch (error) {
      setIsConnected(undefined);
      handleError(error);
    }
  }, [
    setIsLoggingIn,
    setWalletLoginError,
    setAwaitingUserInteraction,
    activate,
    connected,
    setIsConnected,
    handleError,
  ]);

  const connectInjected = useCallback(async () => {
    try {
      setIsLoggingIn(false);
      setWalletLoginError(null);
      setAwaitingUserInteraction("injected");
      console.log("connectInjected() activate()");
      await activate(injectedConnector, undefined, true);
      setIsConnected("injected");
      connected();
    } catch (error) {
      setIsConnected(undefined);
      handleError(error);
    }
  }, [
    setIsLoggingIn,
    setWalletLoginError,
    setAwaitingUserInteraction,
    activate,
    connected,
    setIsConnected,
    handleError,
  ]);

  const walletLoginFinalize = useCallback(async () => {
    store.dispatch(
      cryptoStateUpdate({
        signatureRequired: false,
        loginMessage: null,
        errors: null,
      })
    );
    setWalletLoginError(null);
    setIsLoggingIn(false);
    triggerToast();
    Router.replace("/x/");
  }, [triggerToast, setIsLoggingIn, setWalletLoginError]);

  const walletLoginLogin = useCallback(
    async (signedMessage) => {
      const { data, errors } = await loginMutation(account, signedMessage);

      try {
        if (!errors && data.authLogin?.tokens?.access) {
          walletLoginFinalize();
        } else if (errors) {
          throw errors[0];
        } else {
          throw Error("Unexpected response in authLoginMutation");
        }
      } catch (error) {
        handleError(error);
      }
    },
    [account, loginMutation, handleError, walletLoginFinalize]
  );

  const walletLoginRequestSignature = useCallback(
    async (toSign: string, account: string) => {
      setWalletLoginError(null);
      if (library?.provider?.send) {
        library.provider.send(
          {
            method: "personal_sign",
            params: [
              ethersUtils.hexlify(ethersUtils.toUtf8Bytes(toSign)),
              account.toLowerCase(),
            ],
          },
          async (error, result) => {
            if (!error && result?.result) {
              await walletLoginLogin(result?.result);
            } else {
              if (error?.code && error?.code === 4001) {
                setAwaitingUserInteraction(null);

                const msg =
                  "Please sign the requested signature to be able to logon to our plaform";

                if (connectedVia === "walletconnect") {
                  triggerToast(
                    "Signature required",
                    "Please sign the requested signature to be able to logon to our plaform",
                    "error"
                  );
                  await walletDisconnect();
                } else {
                  setWalletLoginError(msg);
                }
              } else {
                handleError(error);
              }
            }
          }
        );
      } else {
        handleError("Neccessary provider not found");
      }
    },
    [
      library,
      triggerToast,
      handleError,
      walletLoginLogin,
      walletDisconnect,
      setAwaitingUserInteraction,
      setWalletLoginError,
      connectedVia,
    ]
  );

  const walletLoginPreLogin = useCallback(
    async (account: string) => {
      setWalletLoginError(null);
      const { data, errors } = await preloginMutation(account);

      try {
        const { tokens } = data?.authPreLogin ?? {};

        if (!errors && tokens) {
          const signToken = tokens?.sign?.token;

          const accessToken = tokens?.access?.token;
          if (accessToken) {
            walletLoginFinalize();
            return;
          }

          if (
            !signToken ||
            !(typeof signToken === "string" && signToken.length > 10) ||
            new Date(tokens?.sign.expires).getTime() < Date.now()
          )
            throw Error("Sign token found");

          const payload = decode(signToken, { json: true });

          if (!payload || !payload?.message)
            throw Error("Sign token could not be parsed");

          // so we have a valid token let's update the state
          store.dispatch(
            cryptoStateUpdate({
              signatureRequired: true,
              loginMessage: payload?.message,
              errors: null,
            })
          );

          if (!library?.provider?.send)
            throw Error("Neccessary provider not found");

          Router.replace("/sign");
        } else if (errors) {
          throw errors[0];
        } else {
          throw Error("Unexpected response in authPreLoginMutation");
        }
      } catch (err) {
        handleError(err);
      }
    },
    [
      handleError,
      // connector,
      library,
      walletLoginFinalize,
      preloginMutation,
      // web3Injected,
      setWalletLoginError,
      // walletLoginRequestSignature,
    ]
  );

  return {
    awaitingUserInteraction,
    connectWalletConnect,
    connectInjected,
    walletLoginError,
    walletDisconnect,
    walletReconnect,
    account,
    walletLoginRequestSignature,
    chainId,
    library,
    active,
    isLoggingIn,
    setIsLoggingIn,
    walletLoginPreLogin,
  } as const;
}
