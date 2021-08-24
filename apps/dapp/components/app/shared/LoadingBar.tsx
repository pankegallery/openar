import React, { useEffect, useState } from "react";
import Router from "next/router";
import { Box } from "@chakra-ui/react";

export const LoadingBar = ({ color }: { color: string }) => {
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    const showBar = () => setBarVisible(true);
    const hideBar = () => setBarVisible(false);

    Router.events.on("routeChangeStart", showBar);
    Router.events.on("routeChangeComplete", hideBar);
    Router.events.on("routeChangeError", hideBar);
    
    return () => {
      Router.events.off("routeChangeStart", showBar);
      Router.events.off("routeChangeComplete", hideBar);
      Router.events.off("routeChangeError", hideBar);
    };
  }, []);

  return (
    <>
      {barVisible && (
        <Box
          bg={color}
          className={`loadingbar ${barVisible ? "loading" : ""}`}
        ></Box>
      )}
    </>
  );
};
