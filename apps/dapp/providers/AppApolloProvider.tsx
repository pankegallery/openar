import React from "react";
import { ApolloProvider } from "@apollo/client";
import { initializeClient } from "~/services";
import { useConfigContext } from "~/providers";

export const AppApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const appConfig = useConfigContext();
  return (
    <ApolloProvider client={initializeClient(appConfig)}>
      {children}
    </ApolloProvider>
  );
};

export default AppApolloProvider;
