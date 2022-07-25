import { createSlice } from "@reduxjs/toolkit";
import Decimal from "break_infinity.js";
import initialState from "../../data/miners.json";

export const minersSlice = createSlice({
  name: "miners",
  initialState: initialState,
  reducers: {
    buyOne: (state, action) => {
      // Increases amount
      const updatedAmount = new Decimal(state.miners[action.payload].amount)
        .plus(1)
        .toString();
      state.miners[action.payload].amount = updatedAmount;

      // Increases per second by multiplying amount of miners with generation per miner
      const perMiner = new Decimal(state.miners[action.payload].perMiner);
      state.miners[action.payload].perSecond = perMiner
        .times(updatedAmount)
        .toString();

      // Updates the current cost with the following formula
      // currentCost = baseCost*growthCoefficient^amount
      const baseCost = new Decimal(state.miners[action.payload].baseCost);
      const growthCoefficient = new Decimal(
        state.miners[action.payload].growthCoefficient
      );
      state.miners[action.payload].currentCost = baseCost
        .times(growthCoefficient.pow(updatedAmount))
        .toString();
    },
    buyUntil10: (state, action) => {
      // Calculates the amount left until 10
      // Gets the ones digit from string, converts to number
      // Then finds the necessary amount with 10 - onesDigit
      const amount = new Decimal(state.miners[action.payload].amount);
      const onesDigit = parseInt(
        state.miners[action.payload].amount.slice(
          state.miners[action.payload].amount.length - 1,
          state.miners[action.payload].amount.length
        )
      );
      const amountLeftUntil10 = new Decimal(10 - onesDigit);

      const updatedAmount = amount.plus(amountLeftUntil10).toString();
      // Updates the amount
      state.miners[action.payload].amount = updatedAmount;
      // Updates perSecond by calculating the increase first with amountUntil10*generationPerMiner
      // and then adds that to current perSecond
      const perSecond = new Decimal(state.miners[action.payload].perSecond);
      state.miners[action.payload].perSecond = perSecond
        .plus(amountLeftUntil10.times(state.miners[action.payload].perMiner))
        .toString();

      // Updates the currentCost to be in line with the following formula
      // currentCost = baseCost*growthCoefficient^amount
      const baseCost = new Decimal(state.miners[action.payload].baseCost);
      const growthCoefficient = new Decimal(
        state.miners[action.payload].growthCoefficient
      );
      state.miners[action.payload].currentCost = baseCost
        .times(growthCoefficient.pow(updatedAmount))
        .toString();
    },
    unlockNextMiner: (state, action) => {
      // Return if it tries to unlock a miner that is off-index
      // This can occur during initial loading
      if (action.payload > state.miners.length - 1) {
        return;
      }
      state.miners[action.payload].unlocked = true;
      state.unlocks.unlockProgress += 1;
    },
    applyMinerUpgrade: (state, action) => {
      // Calls a specific miner and updates their additive and multiplicative multipliers
      // Gets multiplier type, coefficient and miner id in action.payload
      let multiplier = 0;
      let newPerMiner = new Decimal(0);
      const baseGeneration = new Decimal(
        state.miners[action.payload.id].baseGeneration
      );

      // Checks type which can be additive or multiplicative for upgrade types
      switch (action.payload.type) {
        case "additive":
          // If its additive, it calculates it in a multiplier variable
          multiplier =
            (action.payload.coefficient % 1) +
            state.miners[action.payload.id].additiveMultiplier;
          state.miners[action.payload.id].additiveMultiplier +=
            action.payload.coefficient - 1;

          // Calculates a new PerMiner generation by multiplying the previous multipliers with new additive multiplier
          // baseGeneration * multiplicativeMultiplier * multiplier
          newPerMiner = baseGeneration
            .times(state.miners[action.payload.id].multiplicativeMultiplier)
            .times(multiplier);

          // Sets the perMiner to this newly calculated value
          state.miners[action.payload.id].perMiner = newPerMiner.toString();

          // Sets perSecond by multiplying this new PerMiner generation with current amount for the miner
          state.miners[action.payload.id].perSecond = newPerMiner
            .times(state.miners[action.payload.id].amount)
            .toString();
          break;
        case "multiplicative":
          // If its multiplicative, it calculates the new multiplicative in a variable named multiplier
          multiplier =
            action.payload.coefficient *
            state.miners[action.payload.id].multiplicativeMultiplier;
          state.miners[action.payload.id].multiplicativeMultiplier *=
            action.payload.coefficient;

          // Calculates a new PerMiner generation by multiplying the previous multipliers with new additive multiplier
          // baseGeneration * additiveMultiplier * multiplier
          newPerMiner = baseGeneration
            .times(state.miners[action.payload.id].additiveMultiplier)
            .times(multiplier);

          // Sets the perMiner to this newly calculated value
          state.miners[action.payload.id].perMiner = newPerMiner.toString();

          // Sets perSecond by multiplying this new PerMiner generation with current amount for the miner
          state.miners[action.payload.id].perSecond = newPerMiner
            .times(state.miners[action.payload.id].amount)
            .toString();
          break;
        default:
          break;
      }
    },
    loadMiners: (state, action) => {
      state.miners = action.payload.miners;
      state.unlocks = action.payload.unlocks;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  buyOne,
  buyUntil10,
  unlockNextMiner,
  applyMinerUpgrade,
  loadMiners,
} = minersSlice.actions;

export default minersSlice.reducer;
