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


/*
TODO:  Warning: Expected server HTML to contain a matching <div> in <div>.

Chase the mismatching divs ... 

This message can also occurs due to bad code that doesn't render consistent content between your SSR and CSR, thus hydrate can't resolve.

For example SSR returns :

...
<div id="root">
   <div id="myDiv">My div content</div>
</div>
...
While CSR returns :

...
<div id="root">
    <div id="anotherDiv">My other div content</div>
</div>
...
The best solution in this case is not installing libraries or turning off hydrate but actually fix the inconsistency in your code.

Temporaryly removing <script src="/react-bundle-path.js"></script> from index.js can help to compare the exact content rendered by SSR with content rendered by CSR hydrate.



*/