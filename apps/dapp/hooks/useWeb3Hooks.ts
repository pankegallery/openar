import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "~/services/crypto";
import { useLocalStorage, useWalletLogin } from ".";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const [connected] = useLocalStorage("connected", false);

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized && connected) {
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

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate, deactivate } = useWeb3React();

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injectedConnector);
        // TODO: this one should also ensure that the login flow is happeing
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injectedConnector);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload (logout)", accounts);
        deactivate();
      };
      const handleDisconnect = () => {
        // TODO: remove ... 
        console.log("Handling 'disconnect' event");
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
  }, [active, error, suppress, activate, deactivate]);
}

export function useDisconnectListener() {
  const { walletDisconnect } = useWalletLogin();
  const { connector } = useWeb3React();

  useEffect((): any => {
    if (connector && connector.addListener) {
      const handleEvent = async () => {
        await walletDisconnect();
      };

      connector.addListener("Web3ReactDeactivate", handleEvent);

      return () => {
        if (connector.removeListener) {
          connector.removeListener("Web3ReactDeactivate", handleEvent);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector]);
}

export function useAccountChangeListener() {
  const { walletDisconnect } = useWalletLogin();
  const { connector } = useWeb3React();

  useEffect((): any => {
    if (connector && connector.addListener) {
      const handleEvent = async () => {
        console.log("Web3ReactUpdate")
        await walletDisconnect();
      };

      connector.addListener("Web3ReactUpdate", handleEvent);

      return () => {
        if (connector.removeListener) {
          connector.removeListener("Web3ReactUpdate", handleEvent);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector]);
}
