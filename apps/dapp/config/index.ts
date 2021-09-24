import { Decimal } from "packages/crypto/dist";
import type { AppConfig } from "~/types";
import { decimalToHex } from "~/utils";

const domain =
  `${process.env.NEXT_PUBLIC_API_URL}` !== "undefined"
    ? new URL(`${process.env.NEXT_PUBLIC_API_URL}`)
    : "";

if (domain === "") throw Error("Please set NEXT_PUBLIC_API_URL");

const apiDomain = domain.host ? domain.host.split(":")[0] : "localhost";

export const appConfig: AppConfig = {
  apiDomain,
  contactEmail: "contact@openar.art",
  restrictedAccessRedirectUrl: "/",
  reauthenticateRedirectUrl: "/login",
  apiUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  apiGraphQLUrl: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
  subgraphGraphQLUrl: `${process.env.NEXT_PUBLIC_SUBGRAPH_URL}`,
  infuraApiKey: `${process.env.NEXT_PUBLIC_INFURA_ID}`,
  ankrXDaiRPCURL: `${process.env.NEXT_PUBLIC_ANKR_XDAI_RPC}`,
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID
    ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)
    : 0,
  numBlockConfirmations: 8,
  defaultPageSize: 30,
  platformCuts: {
    firstSalePlatform: Decimal.new(10),
    firstSalePool: Decimal.new(5),
    furtherSalesPlatform: Decimal.new(5),
    furtherSalesPool: Decimal.new(5),
    furtherSalesCreator: Decimal.new(5),
  },
};

export const chainInfo = {
  100: {
    chainName: "xDai",
    rpcUrls: ["https://rpc.xdaichain.com/"],
    chainId: `0x${decimalToHex(100)}`,
    nativeCurrency: {
      name: "xDai",
      symbol: "xDai",
      decimals: 18,
    },
    blockExplorerUrls: ["https://blockscout.com/xdai/mainnet"],
  },
  31337: {
    chainName: "Localhost 8545",
    rpcUrls: ["http://localhost:8545/"],
    chainId: `0x${decimalToHex(31337)}`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },    
  },
};