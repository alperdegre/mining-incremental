import { createSlice, isFulfilled } from "@reduxjs/toolkit";
import Decimal from "break_infinity.js";
import initialState from "../../data/upgrades.json";
import { loadGame } from "../settings/settingsSlice";

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
            new Decimal(upgrade.amountRequired).lessThanOrEqualTo(
              action.payload.amount
            )
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
    buyUpgrade: (state, action) => {
      // Gets a specific upgrade id, checks if that upgrade is in boughtUpgrades array
      // If its not present, adds it to boughtUpgrades array
      if (state.boughtUpgrades.includes(action.payload)) {
        return;
      }

      state.boughtUpgrades.push(action.payload);
    },
    loadUpgrades: (state, action) => {
      state.unlockedUpgrades = action.payload.unlockedUpgrades;
      state.boughtUpgrades = action.payload.boughtUpgrades;
    }
  },
});

// Action creators are generated for each case reducer function
export const { checkForUpgrades, buyUpgrade, loadUpgrades } = upgradesSlice.actions;

export default upgradesSlice.reducer;
