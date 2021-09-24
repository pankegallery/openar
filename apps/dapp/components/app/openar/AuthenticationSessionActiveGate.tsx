import React, { useEffect } from "react";
import Router from "next/router";

import { useAuthentication } from "~/hooks";

export const AuthenticationSessionActiveGate = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [appUser, {hasCookies}] = useAuthentication();
  
  useEffect(() => {
    if ((!appUser || !hasCookies()) && Router.asPath !== "/login") {
      
      Router.replace("/login");    
    }
      
    // eslint-disable-next-line 
  }, []);

  return <>{children}</>;
};
