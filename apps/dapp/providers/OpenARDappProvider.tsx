import React, {
  useState,
  useEffect,
  Context,
  createContext,
  useContext,
} from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";

import {
  useWeb3EagerConnect,
  useWeb3InactiveListener,
  useWeb3ActiveListener,
  useWeb3ReactListener,
} from "~/hooks";

const OpenARDappEnsureDisConnect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { connector } = useWeb3React<Web3Provider>();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useWeb3EagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useWeb3InactiveListener(!triedEager || !!activatingConnector);
  useWeb3ActiveListener(!triedEager || !!activatingConnector);
  useWeb3ReactListener();

  return <>{children}</>;
};

// create context
export const OpenARDappWeb3InjectedContext: Context<boolean> =
  createContext<boolean>(false);

export const useOpenARDappWeb3InjectedContext = () =>
  useContext(OpenARDappWeb3InjectedContext);

function getWeb3Library(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const OpenARWeb3ReactProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Web3ReactProvider getLibrary={getWeb3Library}>
      {children}
    </Web3ReactProvider>
  );
};

export const OpenARDappProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isWeb3Injected, setIsWeb3Injected] = useState(false);

  useEffect(() => {
    const run = async () => {
      const provider = await detectEthereumProvider();

      if (provider) setIsWeb3Injected(true);
    };
    run();
  }, []);

  return (
    <OpenARWeb3ReactProvider>
      <OpenARDappEnsureDisConnect>
        <OpenARDappWeb3InjectedContext.Provider value={isWeb3Injected}>
          {children}
        </OpenARDappWeb3InjectedContext.Provider>
      </OpenARDappEnsureDisConnect>
    </OpenARWeb3ReactProvider>
  );
};
