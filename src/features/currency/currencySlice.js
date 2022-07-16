import { createSlice } from "@reduxjs/toolkit";

export const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currentCurrency: 10,
    currencyPerSecond: 0,
    tickRate: 1000
  },
  reducers: {
    doTick: (state) => {
      state.currentCurrency += state.currencyPerSecond;
    },
    updateCurrencyPerSecond: (state, action) => {
      state.currencyPerSecond = +action.payload.toFixed(2);
    },
    updateCurrency: (state,action) => {
      state.currentCurrency -= action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { doTick, updateCurrencyPerSecond, updateCurrency } =
  currencySlice.actions;

export default currencySlice.reducer;
