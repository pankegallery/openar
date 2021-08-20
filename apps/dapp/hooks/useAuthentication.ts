import type { AuthenticatedAppUserData } from "~/appuser";
import { createAuthenticatedAppUser } from "~/appuser";

import { useRouter } from "next/router";
import { useTypedSelector } from "~/hooks";

import { user } from "~/services";

export const useAuthentication = () => {
  const router = useRouter();
  const { authenticated, appUserData } = useTypedSelector(({ user }) => user);

  const appUser =
    appUserData && appUserData?.id && appUserData.pseudonym
      ? createAuthenticatedAppUser(appUserData)
      : null;

  const isLoggedIn = (): boolean => {
    return (authenticated && appUserData !== null) || user.isRefreshing();
  };

  const login = async (u: AuthenticatedAppUserData): Promise<boolean> => {
    return await user.login(u);
  };

  const logout = async () => {
    return await user.logout();
  };

  const logoutAndRedirect = async (path: string = "/login") => {
    const result = await user.logout();
    router.push(path);
    return result;
  };

  return [appUser, { isLoggedIn, login, logout, logoutAndRedirect }] as const;
};
