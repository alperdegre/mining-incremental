import { createSlice } from "@reduxjs/toolkit";
import Decimal from "break_infinity.js";

export const statsSlice = createSlice({
  name: "stats",
  initialState: {
    totalGeneratedBucks: "0",
    totalSecondsPassed: 0,
    totalBucksSpent: "0",
    totalMinersBought: 0,
    totalUpgradesBought: 0,
  },
  reducers: {
    updateTimeAndMoneyStats: (state, action) => {
        // Creates new Decimals from already generated money and generation for this second
        // Adds them together then converts toString to save it
        const generation = new Decimal(action.payload);
        const generatedSoFar = new Decimal(state.totalGeneratedBucks);
        state.totalGeneratedBucks = generation.plus(generatedSoFar).toString();
        
        state.totalSecondsPassed += 1;
    },
    updateMinersBought: (state, action) => {
        state.totalMinersBought += action.payload.amount;

        const currentTotalBucksSpent = new Decimal(state.totalBucksSpent);
        const newSpentAmount = new Decimal(action.payload.cost);
        state.totalBucksSpent = currentTotalBucksSpent.plus(newSpentAmount).toString();
    },
    updateUpgradesBought: (state, action) => {
        state.totalUpgradesBought += 1;

        const currentTotalBucksSpent = new Decimal(state.totalBucksSpent);
        const newSpentAmount = new Decimal(action.payload);
        state.totalBucksSpent = currentTotalBucksSpent.plus(newSpentAmount).toString();
    },
    loadStats: (state, action) => {
      state.totalGeneratedBucks = action.payload.totalGeneratedBucks;
      const difference = Date.now() - action.payload.timestamp;
      state.totalSecondsPassed = action.payload.stats.totalSecondsPassed + difference/1000;
      state.totalBucksSpent = action.payload.stats.totalBucksSpent;
      state.totalMinersBought = action.payload.stats.totalMinersBought;
      state.totalUpgradesBought = action.payload.stats.totalUpgradesBought;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  updateTimeAndMoneyStats,
  updateMinersBought,
  updateUpgradesBought,
  loadStats
} = statsSlice.actions;

export default statsSlice.reducer;
