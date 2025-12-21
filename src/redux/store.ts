import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import expensesReducer from "./slices/expenses-slice";

/* ============================
   STORE
============================ */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
  },
});

/* ============================
   TYPES
============================ */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
