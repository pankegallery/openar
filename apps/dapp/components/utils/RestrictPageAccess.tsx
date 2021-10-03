import Router from "next/router";
import type { PermissionName } from "~/appuser";
import cookie from 'cookie';

import { appConfig } from "~/config";
import { getAppUser } from "~/services/authentication";

// TODO: this migh be worth to port to serverSideProps
// https://github.com/vercel/next.js/discussions/10925
export const RestrictPageAccess = (
  AccessRestrictedComponent: any,
  permission: PermissionName
) => {
  const hocComponent = ({ ...props }) => (
    <AccessRestrictedComponent {...props} />
  );

  if (AccessRestrictedComponent.getLayout)
    hocComponent.getLayout = AccessRestrictedComponent.getLayout

  hocComponent.getInitialProps = async (context) => {
    let canPotentiallyReadPage: boolean;
    let redirectTo = appConfig.restrictedAccessRedirectUrl;

    if (context.req) {
      context.req.cookies = cookie.parse(context.req.headers['cookie'] ?? "");
      if (context.req.cookies.refreshToken || getAppUser())
        canPotentiallyReadPage = true;
      
    } else {
      if (getAppUser())
        canPotentiallyReadPage = true;
    } 
    
    // Are you an authorized user or not?
    if (!canPotentiallyReadPage) {
      // Handle server-side and client-side rendering.
      if (context.res) {
        context.res?.writeHead(302, {
          Location: redirectTo,
        });
        context.res?.end();
      } else {
        if (Router.pathname !== redirectTo)
          Router.replace(redirectTo);          
      }
    } else if (AccessRestrictedComponent.getInitialProps) {
      const wrappedProps = await AccessRestrictedComponent.getInitialProps({
        ...context,
      });
      return { ...wrappedProps, canPotentiallyReadPage };
    }
    // TODO: maybe this should not return an empty object ... 
    return { canPotentiallyReadPage };
  };

  return hocComponent;
};
export default RestrictPageAccess;
