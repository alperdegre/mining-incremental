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
      const generation = new Decimal(action.payload.perSec);
      const generatedSoFar = new Decimal(state.totalGeneratedBucks);
      state.totalGeneratedBucks = generation
        .times(action.payload.timePassed)
        .plus(generatedSoFar)
        .toString();

      state.totalSecondsPassed += action.payload.timePassed;
    },
    updateMinersBought: (state, action) => {
      // Gets 'amount' and the 'cost' for the update in action.payload
      state.totalMinersBought += action.payload.amount;

      // To calculate total bucks spent, it creates two new decimals for current spent bucks and cost for the new ones
      const currentTotalBucksSpent = new Decimal(state.totalBucksSpent);
      const newSpentAmount = new Decimal(action.payload.cost);

      // Adds them together for the new total bucks spent
      state.totalBucksSpent = currentTotalBucksSpent
        .plus(newSpentAmount)
        .toString();
    },
    updateUpgradesBought: (state, action) => {
      // Gets 'cost' for the update in action.payload
      state.totalUpgradesBought += 1;

      // To calculate total bucks spent, it creates two new decimals for current spent bucks and the cost for the upgrade
      const currentTotalBucksSpent = new Decimal(state.totalBucksSpent);
      const newSpentAmount = new Decimal(action.payload);

      // Adds them together for the new total bucks spent
      state.totalBucksSpent = currentTotalBucksSpent
        .plus(newSpentAmount)
        .toString();
    },
    loadStats: (state, action) => {
      // Needs to calculate totalGeneratedBucks with how much time spent since offline
      // To calculate the time difference, it subtracts last save's timestamp from current time
      // Converts it to seconds and and adds perSecondGeneration * timeDifference to last totalGeneratedBucks
      const currency = new Decimal(action.payload.current);
      const perSec = new Decimal(action.payload.perSec);
      const difference = (Date.now() - action.payload.timestamp) / 1000;
      state.totalGeneratedBucks = currency
        .plus(perSec.times(difference))
        .toString();

      // Loads the rest of the stats
      state.totalSecondsPassed =
        action.payload.stats.totalSecondsPassed + difference;
      state.totalBucksSpent = action.payload.stats.totalBucksSpent;
      state.totalMinersBought = action.payload.stats.totalMinersBought;
      state.totalUpgradesBought = action.payload.stats.totalUpgradesBought;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateTimeAndMoneyStats,
  updateMinersBought,
  updateUpgradesBought,
  loadStats,
} = statsSlice.actions;

export default statsSlice.reducer;
