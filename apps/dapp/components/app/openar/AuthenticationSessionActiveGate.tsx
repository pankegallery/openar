import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthentication } from "~/hooks";

export const AuthenticationSessionActiveGate = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [appUser, {hasCookies}] = useAuthentication();
  const router = useRouter();

  useEffect(() => {
    if ((!appUser || !hasCookies()) && router.asPath !== "/login") {
      
      router.replace("/login");    
    }
      
    // eslint-disable-next-line 
  }, []);

  return <>{children}</>;
};
