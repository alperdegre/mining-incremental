import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadCurrency } from "../currency/currencySlice";
import { loadMiners } from "../miners/minersSlice";
import { loadStats } from "../stats/statsSlice";
import { loadUpgrades } from "../upgrade/upgradesSlice";

export const loadGame = createAsyncThunk(
  "settings/loadGame",
  async (saveState, thunkAPI) => {
    thunkAPI.dispatch(setLoading(saveState.settings));
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
    updateRate: 250,
  },
  reducers: {
    saveGame: (_, action) => {
      localStorage.setItem("gameSave", JSON.stringify(action.payload));
    },
    setLoading: (state, action) => {
      state.isLoading = true;
      state.updateRate = +(action.payload.updateRate);
    },
    resetGame: () => {
      localStorage.removeItem("gameSave");
    },
    changeUpdateRate: (state, action) => {
      if(action.payload < 33){
        state.updateRate = 33;
      } else if(action.payload > 1000){
        state.updateRate = 1000;
      } else {
        state.updateRate = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadGame.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { saveGame, resetGame, setLoading, changeUpdateRate } = settingsSlice.actions;

export default settingsSlice.reducer;
