import { createSlice } from "@reduxjs/toolkit";
import initialState from "../../data/upgrades.json";

export const upgradesSlice = createSlice({
  name: "upgrades",
  initialState: {
    unlockedUpgrades: [],
    boughtUpgrades: [],
    upgrades: initialState,
  },
  reducers: {
    checkForUpgrades: (state, action) => {
      // Filters the upgrades and checks if you have enough amount of a specific miner
      const unlockableUpgrades = state.upgrades
        .filter((upgrade) => {
          return (
            upgrade.appliesTo === action.payload.id &&
            upgrade.amountRequired <= action.payload.amount
          );
        })
        // And maps through those upgrades to only select id's from them.
        .map((upgrade) => upgrade.id);

      // Checks if there are new unlockable upgrades
      if (unlockableUpgrades.length > 0) {
        // Updates the current unlocked upgrades state
        state.unlockedUpgrades = unlockableUpgrades;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { checkForUpgrades } = upgradesSlice.actions;

export default upgradesSlice.reducer;
