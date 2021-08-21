import {
  ChainId,
} from '@usedapp/core'

import {appConfig} from "~/config";

export const readOnlyUrls = {
  [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${appConfig.infuraApiKey}`,
  [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${appConfig.infuraApiKey}`,
  [ChainId.xDai]: `${appConfig.ankrXDaiRPCURL}`,
  [ChainId.Hardhat]: 'http://localhost:8545',
  [ChainId.Localhost]: 'http://localhost:8545',
}