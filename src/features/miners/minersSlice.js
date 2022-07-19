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
      const amount = new Decimal(state.miners[action.payload].amount);
      const amountLeftUntil10 = amount
        .div(10)
        .minus(amount.div(10).floor())
        .times(10)
        .minus(10)
        .abs();
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
      state.miners[action.payload].unlocked = true;
      state.unlocks.unlockProgress += 1;
    },
    applyMinerUpgrade: (state, action) => {
      // Calls a specific miner and updates their additive and multiplicative multipliers
      // Gets multiplier type, coefficient and miner id in action.payload
      let multiplier = 0;
      let newPerMiner = 0;
      const baseGeneration = new Decimal(
        state.miners[action.payload.id].baseGeneration
      );

      switch (action.payload.type) {
        case "additive":
          multiplier =
            (action.payload.coefficient % 1) +
            state.miners[action.payload.id].additiveMultiplier;
          state.miners[action.payload.id].additiveMultiplier +=
            action.payload.coefficient;
          newPerMiner = baseGeneration
            .times(state.miners[action.payload.id].multiplicativeMultiplier)
            .times(multiplier);
          state.miners[action.payload.id].perMiner = newPerMiner.toString();
          state.miners[action.payload.id].perSecond = newPerMiner
            .times(state.miners[action.payload.id].amount)
            .toString();
          break;
        case "multiplicative":
          multiplier =
            action.payload.coefficient *
            state.miners[action.payload.id].multiplicativeMultiplier;
          state.miners[action.payload.id].multiplicativeMultiplier *=
            action.payload.coefficient;
          newPerMiner = baseGeneration
            .times(state.miners[action.payload.id].additiveMultiplier)
            .times(multiplier);
          state.miners[action.payload.id].perMiner = newPerMiner.toString();
          state.miners[action.payload.id].perSecond = newPerMiner
            .times(state.miners[action.payload.id].amount)
            .toString();
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
