import { ChainId, DAppProvider } from "@usedapp/core";
import React from "react";
import { readOnlyUrls } from "~/services/crypto";
const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: readOnlyUrls,
};

export const OpenARDappProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <DAppProvider config={config}>{children}</DAppProvider>;
