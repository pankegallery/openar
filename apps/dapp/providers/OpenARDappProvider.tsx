import React, {useState, useEffect} from "react";
import { ChainId, DAppProvider } from "@usedapp/core";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import { useLocalStorage } from "~/hooks";
import { readOnlyUrls, injectedConnector } from "~/services/crypto";

const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: readOnlyUrls,
};

const OpenARDappEnsureDisconnect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const { account, chainId, deactivate, active } = useEthers();
  const [connected] = useLocalStorage("connected", false);
  
  const { deactivate } = useWeb3React<Web3Provider>()

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized && !connected) {
        deactivate();
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  return <>{children}</>;
};

export const OpenARDappProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <DAppProvider config={config}>
    <OpenARDappEnsureDisconnect>{children}</OpenARDappEnsureDisconnect>
  </DAppProvider>
);
