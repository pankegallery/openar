import React, { Context, createContext, useContext } from "react";
import { appConfig } from "~/config";
import type { AppConfig } from "~/types";

// create context
export const ConfigContext: Context<AppConfig> =
  createContext<AppConfig>(appConfig);

export const useConfigContext = () => useContext(ConfigContext);

// context provider
export const ConfigContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ConfigContext.Provider value={appConfig}>
      {children}
    </ConfigContext.Provider>
  );
};