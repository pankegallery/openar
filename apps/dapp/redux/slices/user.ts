import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthenticatedAppUserData } from "~/appuser";

type EmailVerificationState = "unknown" | "yes" | "no";

type UserLoginPayload = {
  appUserData: AuthenticatedAppUserData;
  expires: string;
};

type UserState = {
  justConnected: boolean;
  authenticated: boolean;
  emailVerified: EmailVerificationState;
  appUserData: AuthenticatedAppUserData | null;
  refreshing: boolean;
  allowRefresh: boolean;
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
    justConnected: false,
    authenticated: false,
    appUserData: null,
    emailVerified: "unknown",
    refreshing: false,
    allowRefresh: true,
    expires: new Date("1970-01-01").toISOString(),
  } as UserState,
  reducers: {
    userProfileUpdate(state, action: PayloadAction<AuthenticatedAppUserData>) {
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
      state.justConnected = false;
      state.authenticated = false;
      state.refreshing = false;
      state.allowRefresh = true;
      state.appUserData = null;
      state.emailVerified = "unknown";
      state.expires = new Date().toISOString();
    },
    userPreLogoutLogout(state) {
      state.justConnected = true;
      state.authenticated = false;
      state.refreshing = false;
      state.allowRefresh = true;
      state.appUserData = null;
      state.emailVerified = "unknown";
      state.expires = new Date().toISOString();
    },
    userLogin(state, action: PayloadAction<UserLoginPayload>) {
      state.justConnected = false;
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
    authSetJustConnected(state) {
      state.justConnected = true;
      state.authenticated = false;
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
  authSetJustConnected,
  userPreLogoutLogout,
} = actions;

// Export the reducer, either as a default or named export
export default reducer;
