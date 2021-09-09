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
          console.log('activated injectedConnector')
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
    console.log(
      `useWeb3InactiveListener useEffect Active:${active} Error:${error} Suppres:${suppress} Ethereum:${!!ethereum}`
    );
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      console.log("useWeb3InactiveListener attach events");
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injectedConnector);
        // TODO: this one should also ensure that the login flow is happeing
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log(
          "useWeb3InactiveListener: Handling 'chainChanged' event with payload",
          chainId
        );
        activate(injectedConnector);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log(
          "useWeb3InactiveListener: Handling 'accountsChanged' event with payload (possibly logout?)",
          accounts,
          account
        );
        activate(injectedConnector);
      };
      const handleDisconnect = () => {
        // TODO: remove ...
        console.log("useWeb3InactiveListener: Handling 'disconnect' event");
        deactivate();
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("disconnect", handleConnect);

      return () => {
        if (ethereum.removeListener) {
          console.log("useWeb3InactiveListener: remove listener");
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
  const { walletDisconnect } = useWalletLogin();
  useWhyDidYouUpdate("w3AL", {
    active,
    error,
    suppress,
    activate,
    deactivate,
    account,
    walletDisconnect,
  });
  useEffect((): any => {
    const { ethereum } = window as any;
    console.log(
      `useWeb3ActiveListener useEffect Active:${active} Error:${error} Suppres:${suppress} Ethereum:${!!ethereum}`
    );
    if (ethereum && ethereum.on && active && !error && !suppress) {
      console.log("useWeb3ActiveListener attach events");
      const handleConnect = () => {
        console.log("Handling 'useWeb3ActiveListener:connect' event");
        activate(injectedConnector);
        // TODO: this one should also ensure that the login flow is happeing
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log(
          "Handling 'useWeb3ActiveListener:chainChanged' event with payload",
          chainId
        );
        activate(injectedConnector);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log(
          "useWeb3ActiveListener: Handling 'accountsChanged' event with payload (possibly logout?)",
          accounts,
          account
        );
        activate(injectedConnector);
      };
      const handleDisconnect = async () => {
        // TODO: remove ...
        console.log("Handling 'useWebActiveListener:disconnect' event");
        await walletDisconnect();
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("disconnect", handleConnect);

      return () => {
        if (ethereum.removeListener) {
          console.log("useWeb3ActiveListener: remove listener");
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
  ]);
}

export function useWeb3ReactListener() {
  const { walletDisconnect } = useWalletLogin();
  const { connector } = useWeb3React();

  useEffect((): any => {
    if (connector && connector.addListener) {
      const handleEvent = async (a, b, c) => {
        console.log(
          "Handling 'useDisconnectListener:useWeb3ReactListener' event calling: walletDisconnect",
          a,
          b,
          caches
        );
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
