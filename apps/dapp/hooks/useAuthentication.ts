import type { AuthenticatedAppUserData } from "~/appuser";
import { createAuthenticatedAppUser } from "~/appuser";

import { useRouter } from "next/router";
import { useTypedSelector } from "~/hooks";

import { user } from "~/services";

export const useAuthentication = () => {
  const router = useRouter();
  const { authenticated, appUserData } = useTypedSelector(({ user }) => user);

  console.log(appUserData);
  // const appUser =
  //   appUserData && appUserData?.id && appUserData.pseudonym
  //     ? createAuthenticatedAppUser(appUserData)
  //     : null;

  const appUser = createAuthenticatedAppUser({
    id: 2,
    ethAddress: "0x324hhkjhakjdhsf324345h34",
    pseudonym: "Pseudo Peter",
    roles: [
      "user",
      "administrator",
      "api",
      "artist",
      "collector",
      "critic",
      "curator",
    ],
    emailVerified: "no",
    permissions: ["profileRead","profileUpdate"]
  });
  // appUserData && appUserData?.id && appUserData.pseudonym
  //   ?
  //   : null;

  const isLoggedIn = (): boolean => {
    return (authenticated && appUserData !== null) || user.isRefreshing();
  };

  const login = async (u: AuthenticatedAppUserData): Promise<boolean> => {
    return await user.login(u);
  };

  const logout = async () => {
    return await user.logout();
  };

  const preLoginLogout = async () => {
    return await user.preLoginLogout();
  };

  const logoutAndRedirect = async (path: string = "/login") => {
    const result = await user.logout();
    router.push(path);
    return result;
  };

  return [
    appUser,
    { isLoggedIn, login, logout, preLoginLogout, logoutAndRedirect },
  ] as const;
};
