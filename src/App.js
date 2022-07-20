import useInterval from "./hooks/useInterval";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  doTick,
  updateCurrencyPerSecond,
} from "./features/currency/currencySlice";
import { changePage } from "./features/navigation/navigationSlice";
import { unlockNextMiner } from "./features/miners/minersSlice";
import { formatNumber } from "./utils/utils";
import { useEffect, useMemo } from "react";
import Decimal from "break_infinity.js";
import { updateTimeAndMoneyStats } from "./features/stats/statsSlice";
import {
  saveGame,
  loadGame,
} from "./features/settings/settingsSlice";
import MiningPage from "./pages/MiningPage";
import UpgradesPage from "./pages/UpgradesPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const dispatch = useDispatch();

  // Currency Selectors
  const currentCurrency = useSelector(
    (state) => state.currency.currentCurrency
  );
  const currencyPerSecond = useSelector(
    (state) => state.currency.currencyPerSecond
  );
  const tickRate = useSelector((state) => state.currency.tickRate);

  // Miner Selectors
  const miners = useSelector((state) => state.miners.miners);

  // Upgrade Selectors
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

  // Miner Selectors
  const { unlockTresholds, unlockProgress } = useSelector(
    (state) => state.miners.unlocks
  );

  // Settings Selectors
  const updateRate = useSelector((state) => state.settings.updateRate);

  // First maps through miners to get each of their perSecond generation
  // after that reduces that array to a single value
  const perSecondGeneration = useMemo(() => {
    return miners
      .map((miner) => miner.perSecond)
      .reduce((prev, curr) => new Decimal(prev).plus(curr))
      .toString();
  }, [miners]);

  // Tick happens inside this custom hook every second
  useInterval(() => {
    // Check to see if you can unlock the next Mining Tier
    if (currentCurrency >= unlockTresholds[unlockProgress]) {
      dispatch(unlockNextMiner(unlockProgress + 1));
    }

    // Updates per second generation
    dispatch(updateCurrencyPerSecond(perSecondGeneration));

    // Increases money per tick
    dispatch(doTick(updateRate));

    // Updates Total Time and Total Money Gained for stats
    dispatch(
      updateTimeAndMoneyStats({ perSec: perSecondGeneration, timePassed: 1/(1000/updateRate) })
    );
  }, [updateRate]);

  // Interval to save the game every 30 seconds
  useInterval(() => {
    // Save Game every minute
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
        updateRate
      },
      timestamp: Date.now(),
    };

    dispatch(saveGame(currentState));
  }, [30000]);

  useEffect(() => {
    const saveState = JSON.parse(localStorage.getItem("gameSave"));
    if (saveState) {
      dispatch(loadGame(saveState));
    }
  }, [dispatch]);

  // Nav button handlers changing the currentPage value inside navigationSlice
  // This value is used to render main section conditionally
  const miningButtonHandler = (event) => {
    dispatch(changePage("MINING"));
  };
  const upgradesButtonHandler = (event) => {
    dispatch(changePage("UPGRADES"));
  };
  const statsButtonHandler = (event) => {
    dispatch(changePage("STATS"));
  };
  const settingsButtonHandler = (event) => {
    dispatch(changePage("SETTINGS"));
  };

  return (
    <>
      <div className="currencySection">
        <h1 className="page__title">Mining Idle Prototype</h1>
        <h2 className="currency__currentText">You have <span className="currency__boldText">{formatNumber(currentCurrency, 2)}</span> Mining Bucks</h2>
        <h3 className="currency__subText">
          You are getting {formatNumber(currencyPerSecond, 2).toString()} Mining Bucks per second
        </h3>
        <p>Tickrate: {tickRate}</p>
      </div>
      <div className="navButtonSection">
        <button onClick={miningButtonHandler} type="button" className="button">
          Mining
        </button>
        <button
          onClick={upgradesButtonHandler}
          type="button"
          className="button"
        >
          Upgrades
        </button>
        <button onClick={statsButtonHandler} type="button" className="button">
          Stats
        </button>
        <button onClick={settingsButtonHandler} type="button" className="button">
          Settings
        </button>
      </div>
      <div className="mainSection">
        <MiningPage />
        <UpgradesPage />
        <StatsPage />
        <SettingsPage />
      </div>
    </>
  );
}

export default App;
