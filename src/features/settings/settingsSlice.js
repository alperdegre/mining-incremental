import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    value: 0,
  },
  reducers: {
    saveGame: (state, action) => {
      localStorage.setItem("gameSave", JSON.stringify(action.payload));
    },
    loadGame: (state, action) => {
      state.value -= 1;
    },
    resetGame: (state, action) => {
      localStorage.removeItem("gameSave");
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveGame, loadGame, resetGame } = settingsSlice.actions;

export default settingsSlice.reducer;
