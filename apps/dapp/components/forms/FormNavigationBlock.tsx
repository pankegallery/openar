import { useEffect } from "react";
import Router from "next/router";
import { useBeforeUnload } from "react-use";

export const FormNavigationBlock = ({
  shouldBlock,
}: {
  shouldBlock: boolean;
}) => {
  const message = "It looks like you've unsaved changes. Leave without saving?";

  useBeforeUnload(shouldBlock, message);

  useEffect(() => {
    const handler = () => {
      if (shouldBlock && !window.confirm(message)) {
        Router.events.emit("routeChangeError");
        throw 'routeChange aborted.';
      }
    };
    
    try {
      
  
      Router.events.on("routeChangeStart", handler);
  
    } catch (err) {}
    
    return () => {
      Router.events.off("routeChangeStart", handler);
    };
  }, [shouldBlock, message]);

  return <></>;
};
