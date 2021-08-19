import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { OpenARDappProvider } from "~/providers";

function MyApp({ Component, pageProps }: AppProps) {
  return <OpenARDappProvider><Component {...pageProps} /></OpenARDappProvider>
}
export default MyApp
