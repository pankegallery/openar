import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { readOnlyUrls } from "./readOnlyUrls";

// TODO: make better ...
const POLLING_INTERVAL = 12000;

export const walletConntectConnector = new WalletConnectConnector({
  rpc: readOnlyUrls,
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
