import Router from "next/router";
import type { PermissionName } from "~/appuser";

import { appConfig } from "~/config";
import { useAuthentication } from "~/hooks";

export const RestrictPageAccess = (
  AccessRestrictedComponent: any,
  permission: PermissionName
) => {
  // const [appUser] = useAuthentication();
  const appUser = true;
  const hocComponent = ({ ...props }) => (
    <AccessRestrictedComponent {...props} />
  );

  if (AccessRestrictedComponent.getLayout)
    hocComponent.getLayout = AccessRestrictedComponent.getLayout

  hocComponent.getInitialProps = async (context) => {
    // Are you an authorized user or not?
    if (!appUser) { // || !appUser.can(permission)) {
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
      return { ...wrappedProps };
    }

    return {};
  };

  return hocComponent;
};
export default RestrictPageAccess;
