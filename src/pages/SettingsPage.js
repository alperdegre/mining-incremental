import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetGame,
  saveGame,
  changeUpdateRate,
  changeTheme,
  changeNotation,
} from "../features/settings/settingsSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();

  // Currency Selectors
  const currentCurrency = useSelector(
    (state) => state.currency.currentCurrency
  );
  const currencyPerSecond = useSelector(
    (state) => state.currency.currencyPerSecond
  );

  // Miner Selectors
  const miners = useSelector((state) => state.miners.miners);

  // Upgrades Selectors
  const unlockedUpgrades = useSelector(
    (state) => state.upgrades.unlockedUpgrades
  );
  const boughtUpgrades = useSelector((state) => state.upgrades.boughtUpgrades);

  // Stats Selectors
  const totalGeneratedBucks = useSelector(
    (state) => state.stats.totalGeneratedBucks
  );
  const totalSecondsPassed = useSelector(
    (state) => state.stats.totalSecondsPassed
  );
  const totalBucksSpent = useSelector((state) => state.stats.totalBucksSpent);
  const totalMinersBought = useSelector(
    (state) => state.stats.totalMinersBought
  );
  const totalUpgradesBought = useSelector(
    (state) => state.stats.totalUpgradesBought
  );

  // Navigation Selectors
  const currentPage = useSelector((state) => state.navigation.currentPage);

  // Settings Selectors
  const updateRate = useSelector((state) => state.settings.updateRate);
  const theme = useSelector((state) => state.settings.theme);
  const notation = useSelector((state) => state.settings.notation);

  const resetButtonHandler = (event) => {
    event.preventDefault();
    dispatch(resetGame(theme));
  };

  const saveButtonHandler = (event) => {
    event.preventDefault();
    saveCurrentGame();
  };

  const updateRateChangeHandler = (event) => {
    dispatch(changeUpdateRate(event.target.value));
  };

  const themeChangeHandler = (event) => {
    dispatch(changeTheme(theme === "theme" ? "theme dark" : "theme"));
  };

  const notationChangeHandler = (event) => {
    if(notation === "standard"){
      dispatch(changeNotation("scientific"));
    } else if(notation === "scientific"){
      dispatch(changeNotation("engineering"));
    } else if(notation === "engineering"){
      dispatch(changeNotation("standard"));
    }
  };

  const saveCurrentGame = () => {
    const currentState = {
      currency: {
        currentCurrency,
        currencyPerSecond,
      },
      miners: miners,
      upgrades: {
        unlockedUpgrades,
        boughtUpgrades,
      },
      stats: {
        totalGeneratedBucks,
        totalSecondsPassed,
        totalBucksSpent,
        totalMinersBought,
        totalUpgradesBought,
      },
      settings: {
        updateRate,
        theme,
        notation,
      },
      timestamp: Date.now(),
    };

    dispatch(saveGame(currentState));
  };

  return (
    currentPage === "SETTINGS" && (
      <div className="settingsSection">
        <h2 className="page__title">Settings</h2>
        <div className="settings__buttons">
          <button
            type="button"
            className="button settings__button"
            onClick={resetButtonHandler}
          >
            Reset Game
          </button>
          <button
            type="button"
            className="button settings__button"
            onClick={saveButtonHandler}
          >
            Save Game
          </button>
        </div>

        <div className="settings__updateRate">
          <div className="settings__updateRateTexts">
            <p>Update Rate</p>
            <p>{updateRate}ms</p>
          </div>

          <input
            type="range"
            id="updateRate"
            name="updateRate"
            min="33"
            max="1000"
            className="settings_rateSlider"
            onChange={updateRateChangeHandler}
            value={updateRate}
          ></input>
        </div>

        <div className="settings__buttons">
          <button
            type="button"
            className="button settings__button"
            onClick={themeChangeHandler}
          >
            {theme === "theme" ? "Dark" : "Light"} Mode
          </button>
          <button
            type="button"
            className="button settings__button"
            onClick={notationChangeHandler}
          >
            Notation: {notation}
          </button>
        </div>
      </div>
    )
  );
};

export default SettingsPage;
