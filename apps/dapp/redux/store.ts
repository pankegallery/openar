import { configureStore } from "@reduxjs/toolkit";

import { save, load } from "redux-localstorage-simple";

import * as reducer from "./slices";

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    if (typeof window !== "undefined") {
      return getDefaultMiddleware().concat(save({ debounce: 500 }));
    }
    return getDefaultMiddleware();
  },
  preloadedState: typeof window !== "undefined" ? load() : undefined,
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
