import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ============================
   TYPES
============================ */
interface AuthState {
  loggedIn: boolean;
  token: string | null;
  userId: string | null;
  emailVerified: boolean;
}

interface AuthPayload {
  token: string;
  userId: string;
  emailVerified: boolean;
}

/* ============================
   INITIAL STATE (localStorage)
============================ */
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const emailVerified = localStorage.getItem("emailVerified") === "true";

const initialState: AuthState = {
  loggedIn: !!token,
  token: token,
  userId: userId,
  emailVerified: emailVerified,
};

/* ============================
   SLICE
============================ */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthPayload>) {
      state.loggedIn = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.emailVerified = action.payload.emailVerified;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem(
        "emailVerified",
        String(action.payload.emailVerified)
      );
    },

    register(state, action: PayloadAction<AuthPayload>) {
      state.loggedIn = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.emailVerified = action.payload.emailVerified;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem(
        "emailVerified",
        String(action.payload.emailVerified)
      );
    },

    logout(state) {
      state.loggedIn = false;
      state.token = null;
      state.userId = null;
      state.emailVerified = false;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("emailVerified");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
