import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ChainId } from "@usedapp/core";

import { appConfig } from "~/config";

export const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";

export const xDAI = "0x6b175474e89094c44da98b954eedeac495271d0f";

export const supportedChainIds = [
  ChainId.Mainnet,
  ChainId.Ropsten,
  ChainId.xDai,
  ChainId.Hardhat,
  ChainId.Localhost,
];

export const readOnlyUrls = {
  [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${appConfig.infuraApiKey}`,
  [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${appConfig.infuraApiKey}`,
  [ChainId.xDai]: `${appConfig.ankrXDaiRPCURL}`,
  [ChainId.Hardhat]: "http://localhost:8545",
  [ChainId.Localhost]: "http://localhost:8545",
};

// TODO: make better ...
const POLLING_INTERVAL = 12000;

export const injectedConnector = new InjectedConnector({
  supportedChainIds: supportedChainIds,
});

export const walletConntectConnector = new WalletConnectConnector({
  
  rpc: readOnlyUrls,
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
