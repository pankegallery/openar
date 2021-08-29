import { useRouter } from "next/router";
import { appConfig } from "~/config";
import { useTypedSelector } from ".";

type TypeLoginStatus = "logged-in" | "logged-out";

export const STORAGE_ITEM_NAME = "loginStatus";

let eventAttached = false;

export const setTabWideAccessStatus = (loginStatus: TypeLoginStatus) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_ITEM_NAME, loginStatus);
  }
};

export const useAuthTabWideLogInOutReload = () => {
  const authenticated = useTypedSelector(({ user }) => user.authenticated);
  const status = authenticated ? "logged-in" : "logged-out";
  const router = useRouter();

  if (typeof window !== "undefined" && !eventAttached) {
    eventAttached = true;

    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_ITEM_NAME) {
        if (event.newValue === "logged-out") {
          document.location.reload();
        } else {
          console.log(`window.addEventListener(storage) push to ${appConfig.reauthenticateRedirectUrl}`);
          router.push(appConfig.reauthenticateRedirectUrl);
        }
      }
    });
  }

  return [status] as const;
};

export default useAuthTabWideLogInOutReload;
