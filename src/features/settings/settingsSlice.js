import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadCurrency } from "../currency/currencySlice";
import { loadMiners } from "../miners/minersSlice";
import { loadStats } from "../stats/statsSlice";
import { loadUpgrades } from "../upgrade/upgradesSlice";

export const loadGame = createAsyncThunk(
  "settings/loadGame",
  async (saveState, thunkAPI) => {
    thunkAPI.dispatch(setLoading());
    thunkAPI.dispatch(loadCurrency({current: saveState.currency.currentCurrency, perSec: saveState.currency.currencyPerSecond, timestamp: saveState.timestamp}));
    thunkAPI.dispatch(loadMiners(saveState.miners));
    thunkAPI.dispatch(loadStats({stats: saveState.stats, timestamp: saveState.timestamp, current: saveState.currency.currentCurrency, perSec: saveState.currency.currencyPerSecond}))
    thunkAPI.dispatch(loadUpgrades(saveState.upgrades));
  }
);
export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    isLoading: false,
  },
  reducers: {
    saveGame: (state, action) => {
      localStorage.setItem("gameSave", JSON.stringify(action.payload));
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
    resetGame: (state, action) => {
      localStorage.removeItem("gameSave");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadGame.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { saveGame, resetGame, setLoading } = settingsSlice.actions;

export default settingsSlice.reducer;
