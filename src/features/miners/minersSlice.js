import { createSlice } from "@reduxjs/toolkit";
import Decimal from "break_infinity.js";
import initialState from "../../data/miners.json";

export const minersSlice = createSlice({
  name: "miners",
  initialState: initialState,
  reducers: {
    buyOne: (state, action) => {
      const updatedAmount = state.miners[action.payload].amount + 1;
      // Increases amount
      state.miners[action.payload].amount += 1;

      // Increases per second by multiplying amount of miners with generation per miner
      state.miners[action.payload].perSecond = +(
        updatedAmount * state.miners[action.payload].perMiner
      ).toFixed(2);

      // Updates the current cost with the following formula
      // currentCost = baseCost*growthCoefficient^amount
      state.miners[action.payload].currentCost =
        state.miners[action.payload].baseCost *
        state.miners[action.payload].growthCoefficient ** updatedAmount;
    },
    buyUntil10: (state, action) => {
      // Calculates the amount left until 10
      const amountLeftUntil10 = 10 - (state.miners[action.payload].amount % 10);
      const updatedAmount =
        state.miners[action.payload].amount + amountLeftUntil10;
      // Updates the amount
      state.miners[action.payload].amount += amountLeftUntil10;
      // Updates perSecond by calculating the increase first with amountUntil10*generationPerMiner
      // and then adds that to current perSecond
      state.miners[action.payload].perSecond += +(
        amountLeftUntil10 * state.miners[action.payload].perMiner
      ).toFixed(2);
      // Updates the currentCost to be in line with the following formula
      // currentCost = baseCost*growthCoefficient^amount
      state.miners[action.payload].currentCost =
        state.miners[action.payload].baseCost *
        state.miners[action.payload].growthCoefficient ** updatedAmount;
    },
    unlockNextMiner: (state, action) => {
      state.miners[action.payload].unlocked = true;
      state.unlocks.unlockProgress += 1;
    },
    applyMinerUpgrade: (state, action) => {
      // Calls a specific miner and updates their additive and multiplicative multipliers
      // Gets multiplier type, coefficient and miner id in action.payload
      let multiplier = 0;
      let newPerMiner = 0;

      switch (action.payload.type) {
        case "additive":
          multiplier =
            action.payload.coefficient%1 +
            state.miners[action.payload.id].additiveMultiplier;
          state.miners[action.payload.id].additiveMultiplier +=
            action.payload.coefficient;
          newPerMiner =
            state.miners[action.payload.id].baseGeneration *
            state.miners[action.payload.id].multiplicativeMultiplier *
            multiplier;
          state.miners[action.payload.id].perMiner = newPerMiner;
          state.miners[action.payload.id].perSecond =
            state.miners[action.payload.id].amount * newPerMiner;

          break;
        case "multiplicative":
          multiplier =
            action.payload.coefficient *
            state.miners[action.payload.id].multiplicativeMultiplier;
          state.miners[action.payload.id].multiplicativeMultiplier *=
            action.payload.coefficient;
          newPerMiner =
            state.miners[action.payload.id].baseGeneration *
            state.miners[action.payload.id].additiveMultiplier *
            multiplier;
          state.miners[action.payload.id].perMiner = newPerMiner;
          state.miners[action.payload.id].perSecond =
            state.miners[action.payload.id].amount * newPerMiner;
          break;
        default:
          break;
      }
      // Updates perMiner = baseGeneration * additiveMultipliers * multiplicativeMultipliers
      // updates perSecond = amount * perMiner
    },
  },
});

// Action creators are generated for each case reducer function
export const { buyOne, buyUntil10, unlockNextMiner, applyMinerUpgrade } =
  minersSlice.actions;

export default minersSlice.reducer;
