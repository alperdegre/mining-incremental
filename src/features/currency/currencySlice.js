import { createSlice } from "@reduxjs/toolkit";

export const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currentCurrency: 0,
    currencyPerSecond: 0.1,
    tickRate: 1000
  },
  reducers: {
    doTick: (state) => {
      state.currentCurrency += state.currencyPerSecond;
    },
    updateCurrencyPerSecond: (state, action) => {

    },
  },
});

// Action creators are generated for each case reducer function
export const { doTick, updateCurrencyPerSecond } =
  currencySlice.actions;

export default currencySlice.reducer;
