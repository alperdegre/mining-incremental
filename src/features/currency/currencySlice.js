import { createSlice } from "@reduxjs/toolkit";
import Decimal from "break_infinity.js";

export const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currentCurrency: "10",
    currencyPerSecond: "0",
    tickRate: 1000,
  },
  reducers: {
    doTick: (state) => {
      const current = new Decimal(state.currentCurrency);
      const perSec = new Decimal(state.currencyPerSecond);

      state.currentCurrency = current.plus(perSec).toString();
    },
    updateCurrencyPerSecond: (state, action) => {
      const newPerSec = new Decimal(action.payload);
      state.currencyPerSecond = newPerSec.toString();
    },
    updateCurrency: (state, action) => {
      const current = new Decimal(state.currentCurrency);
      state.currentCurrency = current.minus(action.payload).toString();
    },
  },
});

// Action creators are generated for each case reducer function
export const { doTick, updateCurrencyPerSecond, updateCurrency } =
  currencySlice.actions;

export default currencySlice.reducer;
