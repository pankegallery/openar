import { authRefreshMutationGQL } from "~/graphql/mutations";
import type { AuthenticatedAppUserData } from "~/appuser";

import { client } from "./apolloClient";
import { authentication } from ".";
import { getAuthToken, getRefreshCookie } from "./authentication";

import { store } from "~/redux/store";
import {
  userPreLogoutLogout,
  userLogout,
  userLogin,
  authRefreshing,
  authAllowRefresh,
} from "~/redux/slices/user";
import {
  cryptoStateReset,
} from "~/redux/slices/crypto"


import { setTabWideAccessStatus } from "~/hooks/useAuthTabWideLogInOutReload";

let refreshTimeoutId: ReturnType<typeof setTimeout>;

const canRefresh = () => store.getState().user.allowRefresh;

const refreshToken = async () => {
  if (client && canRefresh() && getRefreshCookie()) {
    setAllowRefresh(false);
    setRefreshing(true);
  
    client
      .mutate({
        fetchPolicy: "no-cache",
        mutation: authRefreshMutationGQL,
      })
      .then(({ data }: any) => {
        if (
          data?.authRefresh?.tokens?.access &&
          data?.authRefresh?.tokens?.refresh
        ) {
          const payload = authentication.getTokenPayload(
            data.authRefresh.tokens.access
          );

          if (payload) {
            authentication.setAuthToken(data.authRefresh.tokens.access);
            authentication.setRefreshCookie(data.authRefresh.tokens.refresh);

            login(payload.user);
          } else {
            throw new Error("Unable to fetch new access token #1");
          }
        } else {
          throw new Error("Unable to fetch new access token #2");
        }
      })
      .catch((error) => {
        logout();
      });
  } else if (canRefresh()) {
    await logout();
  }
};

const setAllowRefresh = (status: boolean) =>
  store.dispatch(authAllowRefresh(status));

const setRefreshing = (status: boolean) =>
  store.dispatch(authRefreshing(status));

const isRefreshing = () => store.getState().user.refreshing;

const login = async (u: AuthenticatedAppUserData): Promise<boolean> =>  
  new Promise((resolve) => {
    console.log("USER LOGIN", u)
    setRefreshing(false);
    setTabWideAccessStatus("logged-in");

    // clearTimeout(refreshTimeoutId);
    const token = getAuthToken();
    
    if (token) {
      refreshTimeoutId = setTimeout(
        refreshToken,
        new Date(token.expires).getTime() - Date.now() - 10000
      );
    }

    store.dispatch(userLogin({ appUserData: u, expires: getRefreshCookie() }));

    resolve(true);
  });

const preLoginLogout = async (): Promise<boolean> =>
  new Promise(async (resolve) => {
    clearTimeout(refreshTimeoutId);
    
    setRefreshing(false);
    authentication.removeAuthToken();
    authentication.removeRefreshCookie();

    store.dispatch(userPreLogoutLogout());
    
    // we're using resetStore (as clearStore cancels all ongoing queries)
    if (client) await client.resetStore();

    setTabWideAccessStatus("logged-out");

    resolve(true);
  });

const logout = async (): Promise<boolean> =>
  new Promise(async (resolve) => {
    
    clearTimeout(refreshTimeoutId);
    
    setRefreshing(false);
    authentication.removeAuthToken();
    authentication.removeRefreshCookie();

    store.dispatch(userLogout());

    store.dispatch(cryptoStateReset());
    
    // we're using resetStore (as clearStore cancels all ongoing queries)
    if (client) await client.resetStore();

    setTabWideAccessStatus("logged-out");

    resolve(true);
  });

export const isLocalSessionValid = (): boolean => {
  let sessionOk = false;

  const refreshCookie = authentication.getRefreshCookie();
  if (refreshCookie) {
    try {
      const d = new Date(refreshCookie);
      if (d > new Date()) sessionOk = true;
    } catch (err) {}
  }

  return sessionOk;
};

const defaults = {
  preLoginLogout,
  refreshToken,
  login,
  logout,
  setRefreshing,
  isRefreshing,
  canRefresh,
  setAllowRefresh,
  isLocalSessionValid,
};
export default defaults;
