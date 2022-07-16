import { createSlice } from "@reduxjs/toolkit";

export const minersSlice = createSlice({
  name: "miners",
  initialState: {
    miners: [
      {
        id: 0,
        name: "Stone",
        amount: 0,
        perSecond: 0,
        perMiner: 0.1,
        cost: 10,
        unlocked: true,
      },
      {
        id: 1,
        name: "Iron",
        amount: 0,
        perSecond: 0,
        perMiner: 1,
        cost: 100,
        unlocked: false,
      },
      {
        id: 2,
        name: "Gold",
        amount: 0,
        perSecond: 0,
        perMiner: 10,
        cost: 1000,
        unlocked: false,
      },
      {
        id: 3,
        name: "Emerald",
        amount: 0,
        perSecond: 0,
        perMiner: 100,
        cost: 10000,
        unlocked: false,
      },
      {
        id: 4,
        name: "Diamond",
        amount: 0,
        perSecond: 0,
        perMiner: 1000,
        cost: 100000,
        unlocked: false,
      },
    ],
    unlocks: {
      unlockTresholds: [100, 1000, 10000, 100000],
      unlockProgress: 0,
    },
  },
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
      state.miners[action.payload].perSecond = +(
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
