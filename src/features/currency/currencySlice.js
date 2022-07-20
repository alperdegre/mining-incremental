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
    doTick: (state, action) => {
      const current = new Decimal(state.currentCurrency);
      const perSec = new Decimal(state.currencyPerSecond);

      // perSec / (1000 / updateRate) to get proper per Second generation based on updateRate
      state.currentCurrency = current.plus(perSec.divide(1000/action.payload)).toString();
    },
    updateCurrencyPerSecond: (state, action) => {
      const newPerSec = new Decimal(action.payload);
      state.currencyPerSecond = newPerSec.toString();
    },
    updateCurrency: (state, action) => {
      const current = new Decimal(state.currentCurrency);
      switch (action.payload.type) {
        case "add":
            state.currentCurrency = current.plus(action.payload.currency).toString();
          break;
        case "remove":
            state.currentCurrency = current.minus(action.payload.currency).toString();
          break;
        default:
          break;
      }
    },
    loadCurrency: (state, action) => {
      const currency = new Decimal(action.payload.current);
      const perSec = new Decimal(action.payload.perSec);
      const difference = (Date.now() - action.payload.timestamp)/1000;
      state.currentCurrency = currency.plus(perSec.times(difference)).toString();
      state.currencyPerSecond = perSec.toString();
    }
  },
});

// Action creators are generated for each case reducer function
export const { doTick, updateCurrencyPerSecond, updateCurrency, loadCurrency } =
  currencySlice.actions;

export default currencySlice.reducer;
