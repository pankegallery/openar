import { ChainId, DAppProvider } from "@usedapp/core";
import React from "react";

const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_URL}`,
  },
};

export const OpenARDappProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <DAppProvider config={config}>{children}</DAppProvider>;
