import "../styles/globals.scss";
import { Provider } from "react-redux";

import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { ChakraProvider } from "@chakra-ui/react";
import { store } from "~/redux/store";
import {
  ConfigContextProvider,
  AppApolloProvider,
  OpenARDappProvider,
} from "~/providers";
import { chakraTheme } from "~/theme";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function OpenARApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ConfigContextProvider>
      <ChakraProvider theme={chakraTheme}>
        <Provider store={store}>
          <AppApolloProvider>
            <OpenARDappProvider>
             
              {getLayout(<Component {...pageProps} />)}
            </OpenARDappProvider>
          </AppApolloProvider>
        </Provider>
      </ChakraProvider>
    </ConfigContextProvider>
  );
}
export default OpenARApp;
