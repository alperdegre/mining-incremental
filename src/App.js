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

  const { unlockTresholds, unlockProgress } = useSelector(
    (state) => state.miners.unlocks
  );

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
    dispatch(doTick());

    // Updates Total Time and Total Money Gained for stats
    dispatch(
      updateTimeAndMoneyStats({ perSec: perSecondGeneration, timePassed: 1 })
    );
  }, [1000]);

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
  const aboutButtonHandler = (event) => {
    dispatch(changePage("ABOUT"));
  };

  return (
    <div className="App">
      <div className="currencySection">
        <h1>Mining Idle Prototype</h1>
        <h2>You have {formatNumber(currentCurrency, 2)} Mining Bucks</h2>
        <h3>
          You are getting {currencyPerSecond.toString()} Mining Bucks per second
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
        <button onClick={aboutButtonHandler} type="button" className="button">
          About
        </button>
      </div>
      <div className="mainSection">
        <MiningPage />
        <UpgradesPage />
        <StatsPage />
        {/* {currentPage === "ABOUT" && <h1>ABOUT</h1>} */}
      </div>
    </div>
  );
}

export default App;
