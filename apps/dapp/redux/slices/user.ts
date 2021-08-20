import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthenticatedAppUserData } from "~/appuser";

type EmailVerificationState = "unknown" | "yes" | "no";

type UserLoginPayload = {
  appUserData: AuthenticatedAppUserData;
  expires: string;
};

type UserProfileUpdate = {
  firstName: string;
  lastName: string;
  emailVerified: EmailVerificationState | undefined;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    authenticated: false,
    appUserData: null,
    emailVerified: "unknown",
    refreshing: false,
    allowRefresh: true,
    expires: new Date("1970-01-01").toISOString(),
  } as {
    authenticated: boolean;
    emailVerified: EmailVerificationState;
    appUserData: AuthenticatedAppUserData | null;
    refreshing: boolean;
    allowRefresh: boolean;
    expires: string;
  },
  reducers: {
    userProfileUpdate(state, action: PayloadAction<AuthenticatedAppUserData>) {
      console.log("State change: userProfileUpdate");
      if (state.appUserData)
        state.appUserData = {
          ...state.appUserData,
          ...{
            pseudonym: action.payload.pseudonym,
            ethAddress: action.payload.ethAddress,
          },
        };

      if (action.payload.emailVerified)
        state.emailVerified = action.payload.emailVerified ? "yes" : "no";
    },
    userLogout(state) {
      console.log("State change: userLogout");
      state.authenticated = false;
      state.refreshing = false;
      state.allowRefresh = true;
      state.appUserData = null;
      state.emailVerified = "unknown";
      state.expires = new Date().toISOString();
    },
    userLogin(state, action: PayloadAction<UserLoginPayload>) {
      console.log("State change: userLogin");
      state.authenticated = true;
      state.appUserData = action.payload.appUserData;
      state.expires = action.payload.expires;
      state.refreshing = false;
      state.allowRefresh = true;
    },
    userEmailVerificationState(
      state,
      action: PayloadAction<EmailVerificationState>
    ) {
      state.emailVerified = action.payload;
    },
    authRefreshing(state, action: PayloadAction<boolean>) {
      state.refreshing = action.payload;
    },
    authAllowRefresh(state, action: PayloadAction<boolean>) {
      state.allowRefresh = action.payload;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = userSlice;

// Extract and export each action creator by name
export const {
  userLogout,
  userLogin,
  authRefreshing,
  userEmailVerificationState,
  userProfileUpdate,
  authAllowRefresh,
} = actions;

// Export the reducer, either as a default or named export
export default reducer;
