import { ChainId, DAppProvider } from '@usedapp/core'
import React from 'react'

const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: `${process.env.NEXT_PUBLIC_INFURA_URL}`,
  },
}

//console.log(process.env);

export const OpenARDappProvider = ({children}:{children: React.ReactNode}) => 
  <DAppProvider config={config}>
    {children}
  </DAppProvider>
