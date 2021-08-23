import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CryptoState = {
  loginMessage: string | null;
  errors: string[] | null;
  signatureRequired: boolean;
};

const initialState: CryptoState = {
  loginMessage: null,
  errors: null,
  signatureRequired: false,
};

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    cryptoStateUpdate(state, action: PayloadAction<CryptoState>) {
      console.log("crypto state update");
      return state = {
        ...state,
        ...action.payload,
      };
    },
    cryptoStateReset(state) {
      console.log("ctypro state reset");
      return initialState;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = cryptoSlice;

// Extract and export each action creator by name
export const { cryptoStateUpdate, cryptoStateReset } = actions;

// Export the reducer, either as a default or named export
export default reducer;
