import { createSlice } from "@reduxjs/toolkit";
import initialState from "../../data/miners.json";

export const minersSlice = createSlice({
  name: "miners",
  initialState : initialState,
  reducers: {
    buyOne: (state, action) => {
      state.miners[action.payload].amount += 1;
      state.miners[action.payload].perSecond = +(
        state.miners[action.payload].amount *
        state.miners[action.payload].perMiner
      ).toFixed(2);
    },
    buyUntil10: (state, action) => {
      const amountLeftUntil10 = 10 - (state.miners[action.payload].amount % 10);
      state.miners[action.payload].amount += amountLeftUntil10;
      state.miners[action.payload].perSecond += +(
        amountLeftUntil10 * state.miners[action.payload].perMiner
      ).toFixed(2);
    },
    unlockNextMiner: (state, action) => {
      state.miners[action.payload].unlocked = true;
      state.unlocks.unlockProgress += 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { buyOne, buyUntil10, unlockNextMiner } = minersSlice.actions;

export default minersSlice.reducer;
