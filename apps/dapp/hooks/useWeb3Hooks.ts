import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { injectedConnector } from "~/services/crypto";
import { useLocalStorage, useWalletLogin } from ".";

export function useWeb3EagerConnect() {
  const { activate, active } = useWeb3React();

  const [connected] = useLocalStorage("connected", undefined);
  
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (connected !== "injected") return;

    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        console.log("useWeb3EagerConnect() isAuthorized activate()");
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
        console.log("useWeb3InactiveListener() handleConnect()");
        activate(injectedConnector);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("useWeb3InactiveListener() handleChainChanged()");
        activate(injectedConnector);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("useWeb3InactiveListener() handleAccountsChanged()");
        activate(injectedConnector);
      };
      const handleDisconnect = () => {
        console.log("useWeb3InactiveListener() handleDisconnect()");
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

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && active && !error && !suppress) {
      const handleConnect = () => {
        activate(injectedConnector);
        console.log("useWeb3ActiveListener() handleConnect()");
        walletReconnect("injected");
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("useWeb3ActiveListener() handleChainChanged()");
        walletDisconnect();

        console.log("handle chain changed");

        
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("useWeb3ActiveListener() handleAccountsChanged()");
        activate(injectedConnector);
        walletReconnect("injected");
      };
      const handleDisconnect = async () => {
        console.log("useWeb3ActiveListener() walletDisconnect()");
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
