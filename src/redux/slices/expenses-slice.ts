import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

/* ============================
   TYPES
============================ */
export interface Expense {
  firebaseId: string;
  title: string;
  date: string;
  value: number;
  description: string;
  // add other fields if needed
}

interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

/* ============================
   CONSTANTS
============================ */
const FIREBASE_BASE_URL =
  "https://full-stack-expenses-with-type-default-rtdb.firebaseio.com/users";

/* ============================
   FETCH EXPENSES
============================ */
export const fetchExpenses = createAsyncThunk<
  Expense[],
  void,
  { state: RootState; rejectValue: string }
>("expenses/fetchExpenses", async (_, { getState, rejectWithValue }) => {
  const { userId, token } = getState().auth;

  if (!userId || !token) {
    return rejectWithValue("Not authenticated");
  }

  const res = await axios.get(
    `${FIREBASE_BASE_URL}/${userId}/expenses.json?auth=${token}`
  );

  if (!res.data) return [];

  return Object.entries(res.data).map(([firebaseId, expense]) => ({
    firebaseId,
    ...(expense as Omit<Expense, "firebaseId">),
  }));
});

/* ============================
   ADD EXPENSE
============================ */
export const addExpenseFirebase = createAsyncThunk<
  Expense,
  Expense,
  { state: RootState; rejectValue: string }
>("expenses/addExpenseFirebase", async (expense, { getState, rejectWithValue }) => {
  const { userId, token } = getState().auth;

  if (!userId || !token) {
    return rejectWithValue("Not authenticated");
  }

  const res = await axios.post(
    `${FIREBASE_BASE_URL}/${userId}/expenses.json?auth=${token}`,
    expense
  );

  return { firebaseId: res.data.name, ...expense };
});

/* ============================
   DELETE EXPENSE
============================ */
export const deleteExpenseFirebase = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("expenses/deleteExpenseFirebase", async (firebaseId, { getState, rejectWithValue }) => {
  const { userId, token } = getState().auth;

  if (!userId || !token) {
    return rejectWithValue("Not authenticated");
  }

  await axios.delete(
    `${FIREBASE_BASE_URL}/${userId}/expenses/${firebaseId}.json?auth=${token}`
  );

  return firebaseId;
});

/* ============================
   UPDATE EXPENSE
============================ */
export const updateExpenseFirebase = createAsyncThunk<
  { firebaseId: string; updatedExpense: Expense },
  { firebaseId: string; updatedExpense: Expense },
  { state: RootState; rejectValue: string }
>(
  "expenses/updateExpenseFirebase",
  async ({ firebaseId, updatedExpense }, { getState, rejectWithValue }) => {
    const { userId, token } = getState().auth;

    if (!userId || !token) {
      return rejectWithValue("Not authenticated");
    }

    await axios.put(
      `${FIREBASE_BASE_URL}/${userId}/expenses/${firebaseId}.json?auth=${token}`,
      updatedExpense
    );

    return { firebaseId, updatedExpense };
  }
);

/* ============================
   SLICE
============================ */
const initialState: ExpensesState = {
  expenses: [],
  loading: false,
  error: null,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<Expense[]>) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(addExpenseFirebase.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.expenses.unshift(action.payload);
      })

      .addCase(deleteExpenseFirebase.fulfilled, (state, action: PayloadAction<string>) => {
        state.expenses = state.expenses.filter(
          (e) => e.firebaseId !== action.payload
        );
      })

      .addCase(updateExpenseFirebase.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (e) => e.firebaseId === action.payload.firebaseId
        );

        if (index !== -1) {
          state.expenses[index] = {
            firebaseId: action.payload.firebaseId,
            ...action.payload.updatedExpense,
          };
        }
      });
  },
});

export default expensesSlice.reducer;
