import Router from "next/router";
import type { PermissionName } from "~/appuser";
import cookie from 'cookie';
import { AuthenticatedAppUser } from "~/appuser";

import { appConfig } from "~/config";
import { getAppUser } from "~/services/authentication";

export const RestrictPageAccess = (
  AccessRestrictedComponent: any,
  permission: PermissionName
) => {
  const appUser = getAppUser();
  
  // TODO: this must be more complicated

  const hocComponent = ({ ...props }) => (
    <AccessRestrictedComponent {...props} />
  );

  if (AccessRestrictedComponent.getLayout)
    hocComponent.getLayout = AccessRestrictedComponent.getLayout

  hocComponent.getInitialProps = async (context) => {
    
    // TODO: is this safe? 
    let canPotentiallyReadPage = false;
    
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
          Location: appConfig.restrictedAccessRedirectUrl,
        });
        context.res?.end();
      } else {
        Router.replace(appConfig.restrictedAccessRedirectUrl);
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
