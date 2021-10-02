import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useWhyDidYouUpdate } from "@chakra-ui/react";

import { walletConntectConnector, injectedConnector } from "~/services/crypto";
import { useLocalStorage, useWalletLogin } from ".";

export function useWeb3EagerConnect() {
  const { activate, active, account } = useWeb3React();

  const [connected] = useLocalStorage("connected", undefined);
  const [walletConnect] = useLocalStorage("walletconnect", {});

  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (connected !== "injected") return;

    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injectedConnector, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useWeb3InactiveListener(suppress: boolean = false) {
  const { active, error, activate, deactivate, account } = useWeb3React();

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        activate(injectedConnector);
      };
      const handleChainChanged = (chainId: string | number) => {
        activate(injectedConnector);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        activate(injectedConnector);
      };
      const handleDisconnect = () => {
        deactivate();
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("disconnect", handleConnect);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);

          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [active, error, suppress, activate, deactivate, account]);
}

export function useWeb3ActiveListener(suppress: boolean = false) {
  const { active, error, activate, deactivate, account } = useWeb3React();
  const { walletDisconnect, walletReconnect } = useWalletLogin();
  useWhyDidYouUpdate("w3AL", {
    active,
    error,
    suppress,
    activate,
    deactivate,
    account,
    walletDisconnect,
    walletReconnect,
  });
  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && active && !error && !suppress) {
      const handleConnect = () => {
        activate(injectedConnector);
        walletReconnect("injected");
      };
      const handleChainChanged = (chainId: string | number) => {
        activate(injectedConnector);
        walletReconnect("injected");
      };
      const handleAccountsChanged = (accounts: string[]) => {
        activate(injectedConnector);
        walletReconnect("injected");
      };
      const handleDisconnect = async () => {
        await walletDisconnect();
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("disconnect", handleConnect);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);

          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [
    active,
    error,
    suppress,
    activate,
    deactivate,
    account,
    walletDisconnect,
    walletReconnect,
  ]);
}

export function useWeb3ReactListener() {
  const { walletDisconnect } = useWalletLogin();
  const { connector } = useWeb3React();

  useEffect((): any => {
    if (connector && connector.addListener) {
      const handleEvent = async (a, b, c) => {
        await walletDisconnect();
      };

      connector.addListener("Web3ReactDeactivate", handleEvent);
      connector.addListener("Web3ReactUpdate", handleEvent);

      return () => {
        if (connector && connector.removeListener) {
          connector.removeListener("Web3ReactDeactivate", handleEvent);
          connector.removeListener("Web3ReactUpdate", handleEvent);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector]);
}
