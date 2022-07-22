import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadCurrency } from "../currency/currencySlice";
import { loadMiners } from "../miners/minersSlice";
import { loadStats } from "../stats/statsSlice";
import { loadUpgrades } from "../upgrade/upgradesSlice";
import initialSave from "../../data/initialSave.json";

export const loadGame = createAsyncThunk(
  "settings/loadGame",
  async (saveState, thunkAPI) => {
    thunkAPI.dispatch(setLoading(saveState.settings));
    thunkAPI.dispatch(
      changeTheme(saveState.settings.theme === "theme" ? "theme" : "theme dark")
    );
    thunkAPI.dispatch(
      loadCurrency({
        current: saveState.currency.currentCurrency,
        perSec: saveState.currency.currencyPerSecond,
        timestamp: saveState.timestamp,
      })
    );
    thunkAPI.dispatch(loadMiners({ miners: saveState.miners, unlocks: saveState.unlocks }));
    thunkAPI.dispatch(
      loadStats({
        stats: saveState.stats,
        timestamp: saveState.timestamp,
        current: saveState.currency.currentCurrency,
        perSec: saveState.currency.currencyPerSecond,
      })
    );
    thunkAPI.dispatch(loadUpgrades(saveState.upgrades));
  }
);

export const resetGame = createAsyncThunk(
  "settings/resetGame",
  async (theme, thunkAPI) => {
    const initialState = initialSave;
    const timestamp = Date.now();
    thunkAPI.dispatch(
      setLoading({
        updateRate: initialSave.settings.updateRate,
        theme: theme,
        notation: initialSave.settings.notation,
      })
    );
    thunkAPI.dispatch(
      loadCurrency({
        current: initialState.currency.currentCurrency,
        perSec: initialState.currency.currencyPerSecond,
        timestamp: timestamp,
      })
    );
    thunkAPI.dispatch(
      loadMiners({ miners: initialState.miners, unlocks: initialState.unlocks })
    );
    thunkAPI.dispatch(
      loadStats({
        stats: initialState.stats,
        timestamp: timestamp,
        current: initialState.currency.currentCurrency,
        perSec: initialState.currency.currencyPerSecond,
      })
    );
    thunkAPI.dispatch(loadUpgrades(initialState.upgrades));
    initialState.timestamp = timestamp;
    initialState.settings.theme = theme;
    thunkAPI.dispatch(saveGame(initialState));
  }
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    isLoading: false,
    updateRate: 250,
    theme: "theme",
    notation: "standard",
  },
  reducers: {
    saveGame: (_, action) => {
      localStorage.setItem("gameSave", JSON.stringify(action.payload));
    },
    setLoading: (state, action) => {
      state.isLoading = true;
      state.updateRate = +action.payload.updateRate;
      state.theme = action.payload.theme;
      state.notation = action.payload.notation;
    },
    changeUpdateRate: (state, action) => {
      if (action.payload < 33) {
        state.updateRate = 33;
      } else if (action.payload > 1000) {
        state.updateRate = 1000;
      } else {
        state.updateRate = action.payload;
      }
    },
    changeTheme: (state, action) => {
      state.theme = action.payload;
      document.body.classList = action.payload;
    },
    changeNotation: (state, action) => {
      state.notation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadGame.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  saveGame,
  setLoading,
  changeUpdateRate,
  changeTheme,
  changeNotation,
} = settingsSlice.actions;

export default settingsSlice.reducer;
