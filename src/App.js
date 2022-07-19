import useInterval from "./hooks/useInterval";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  doTick,
  updateCurrencyPerSecond,
  updateCurrency,
} from "./features/currency/currencySlice";
import { changePage } from "./features/navigation/navigationSlice";
import MinerButton from "./components/MinerButton";
import {
  buyOne,
  buyUntil10,
  unlockNextMiner,
  applyMinerUpgrade,
} from "./features/miners/minersSlice";
import { checkForUpgrades, buyUpgrade } from "./features/upgrade/upgradesSlice";
import { formatNumber, calculateRealCost } from "./utils/utils";
import UpgradeButton from "./components/UpgradeButton";
import { useEffect, useMemo } from "react";
import Decimal from "break_infinity.js";
import {
  updateMinersBought,
  updateTimeAndMoneyStats,
  updateUpgradesBought,
} from "./features/stats/statsSlice";
import { resetGame, saveGame } from "./features/settings/settingsSlice";

function App() {
  // Currency Selectors
  const currentCurrency = useSelector(
    (state) => state.currency.currentCurrency
  );
  const currencyPerSecond = useSelector(
    (state) => state.currency.currencyPerSecond
  );
  const tickRate = useSelector((state) => state.currency.tickRate);

  // Navigation Selectors
  const currentPage = useSelector((state) => state.navigation.currentPage);

  // Miner Selectors
  const miners = useSelector((state) => state.miners.miners);

  // Upgrade Selectors
  const upgrades = useSelector((state) => state.upgrades.upgrades);
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

  // Time Variables
  const year = Math.floor(totalSecondsPassed / 31536000);
  const month = Math.floor((totalSecondsPassed % 31536000) / 2628000);
  const day = Math.floor(((totalSecondsPassed % 31536000) % 2628000) / 86400);
  const hour = Math.floor((totalSecondsPassed % (3600 * 24)) / 3600);
  const minute = Math.floor((totalSecondsPassed % 3600) / 60);
  const second = Math.floor(totalSecondsPassed % 60);

  // Memoizes an array to render upgrades, filters through the array to find
  // upgrades where upgrade.id is included in unlocked Upgrades
  const upgradesToRender = useMemo(() => {
    return upgrades.filter((upgrade) => {
      return (
        unlockedUpgrades.includes(upgrade.id) &&
        !boughtUpgrades.includes(upgrade.id)
      );
    });
  }, [unlockedUpgrades, boughtUpgrades, upgrades]);
  const { unlockTresholds, unlockProgress } = useSelector(
    (state) => state.miners.unlocks
  );
  const dispatch = useDispatch();

  // Tick happens inside this custom hook every second
  useInterval(() => {
    // Check to see if you can unlock the next Mining Tier
    if (currentCurrency >= unlockTresholds[unlockProgress]) {
      dispatch(unlockNextMiner(unlockProgress + 1));
    }

    // First maps through miners to get each of their perSecond generation
    // after that reduces that array to a single value
    const perSecondGeneration = miners
      .map((miner) => miner.perSecond)
      .reduce((prev, curr) => new Decimal(prev).plus(curr))
      .toString();

    // Updates per second generation
    dispatch(updateCurrencyPerSecond(perSecondGeneration));

    // Increases money per tick
    dispatch(doTick());

    // Updates Total Time and Total Money Gained for stats
    dispatch(updateTimeAndMoneyStats(perSecondGeneration));
  }, [100]);

  // Interval to save the game every minute
  useInterval(() => {
    // Save Game
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

    //dispatch(saveGame(currentState));
  }, [60000000]);

  useEffect(() => {
    const saveState = JSON.parse(localStorage.getItem("gameSave"));
    console.log(saveState);
  }, []);

  // Nav button handlers changing the currentPage value inside navigationSlice
  // This value is used to render main section conditionally
  const miningButtonHandler = (event) => {
    event.preventDefault();
    dispatch(changePage("MINING"));
  };
  const upgradesButtonHandler = (event) => {
    event.preventDefault();
    dispatch(changePage("UPGRADES"));
  };
  const statsButtonHandler = (event) => {
    event.preventDefault();
    dispatch(changePage("STATS"));
  };
  const aboutButtonHandler = (event) => {
    event.preventDefault();
    dispatch(changePage("ABOUT"));
  };

  const buyMinerHandler = (id) => {
    // Gets back id from a specific miner generator button and checks if you have enough money
    const current = new Decimal(currentCurrency);
    if (current.greaterThanOrEqualTo(miners[id].currentCost)) {
      // Dispatches buying one, and updates currency with proper cost
      // Checks for upgrades and updates miners
      const minerAmount = new Decimal(miners[id].amount).plus(1).toString();
      dispatch(buyOne(id));
      dispatch(updateCurrency(miners[id].currentCost));
      dispatch(checkForUpgrades({ id, amount: minerAmount }));
      dispatch(updateMinersBought({ amount: 1, cost: miners[id].currentCost }));
    }
  };

  const buyMinerUntil10Handler = (id) => {
    // Gets back id from a specific miner generator button and checks if you have enough money
    // Calculates the difference until 10 and dispatches accordingly
    const realCost = calculateRealCost(
      miners[id].amount,
      miners[id].growthCoefficient,
      miners[id].currentCost
    );
    const currencyAvailable = new Decimal(currentCurrency);

    if (currencyAvailable.greaterThanOrEqualTo(realCost)) {
      // Dispatches buying until 10, and updates currency with proper cost
      const minerAmount = new Decimal(miners[id].amount).plus(1);

      dispatch(buyUntil10(id));
      dispatch(updateCurrency(realCost));
      dispatch(
        updateMinersBought(
          minerAmount
            .div(10)
            .minus(minerAmount.div(10).floor())
            .times(10)
            .minus(10)
            .abs()
            .toString()
        )
      );
    }
  };

  const buyUpgradeHandler = (id, cost) => {
    const currencyAvailable = new Decimal(currentCurrency);
    const upgradeCost = new Decimal(cost);

    if (currencyAvailable.minus(upgradeCost).greaterThan(0)) {
      const specificUpgrade = upgrades.filter((upgrade) => upgrade.id === id);
      dispatch(updateCurrency(upgradeCost.toString()));
      dispatch(buyUpgrade(id));
      dispatch(
        applyMinerUpgrade({
          id: specificUpgrade[0].id,
          type: specificUpgrade[0].type,
          coefficient: specificUpgrade[0].coefficient,
        })
      );
      dispatch(updateUpgradesBought(upgradeCost.toString()));
    }
  };

  const resetButtonHandler = (event) => {
    event.preventDefault();
    dispatch(resetGame());
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
        {currentPage === "MINING" && (
          <table className="miningTable">
            <tbody>
              {miners.map((miner) => {
                if (miner.unlocked) {
                  return (
                    <MinerButton
                      key={miner.id}
                      id={miner.id}
                      name={miner.name}
                      amount={miner.amount}
                      cost={miner.currentCost}
                      costUntil10={calculateRealCost(
                        miner.amount,
                        miner.growthCoefficient,
                        miner.currentCost
                      )}
                      onBuyOne={buyMinerHandler}
                      onBuyUntil10={buyMinerUntil10Handler}
                      currencyPerSecond={miner.perSecond}
                    />
                  );
                }
              })}
            </tbody>
          </table>
        )}

        {currentPage === "UPGRADES" && (
          <div className="upgradeSection">
            {upgradesToRender.map((upgrade) => {
              return (
                <UpgradeButton
                  key={upgrade.id}
                  id={upgrade.id}
                  name={upgrade.name}
                  cost={upgrade.cost}
                  description={upgrade.description}
                  onUpgradeBought={buyUpgradeHandler}
                />
              );
            })}
          </div>
        )}
        {currentPage === "STATS" && (
          <div className="statsSection">
            <h2>Stats</h2>
            <p className="stats__text">
              You have generated{" "}
              <span className="stats__stat">
                {formatNumber(totalGeneratedBucks, 2)}
              </span>{" "}
              bucks so far!
            </p>
            <p className="stats__text">
              You bought{" "}
              <span className="stats__stat">
                {formatNumber(totalMinersBought, 0)}
              </span>{" "}
              miners to do that.
            </p>
            <p className="stats__text">
              You bought{" "}
              <span className="stats__stat">{totalUpgradesBought}</span>{" "}
              upgrades for your miners.
            </p>
            <p className="stats__text">
              You spent{" "}
              <span className="stats__stat">
                {formatNumber(totalBucksSpent, 2)}
              </span>{" "}
              bucks for those miners and upgrades.
            </p>
            <p className="stats__text">
              You have played for{" "}
              {totalSecondsPassed >= 31536000 && (
                <>
                  <span className="stats__stat">{year}</span>{" "}
                  {year === 1 ? "year" : "years"}{" "}
                </>
              )}
              {totalSecondsPassed >= 2592000 && (
                <>
                  <span className="stats__stat">{month}</span>{" "}
                  {month === 1 ? "month" : "months"}{" "}
                </>
              )}
              {totalSecondsPassed >= 86400 && (
                <>
                  <span className="stats__stat">{day}</span>{" "}
                  {day === 1 ? "day" : "days"}{" "}
                </>
              )}
              {totalSecondsPassed >= 3600 && (
                <>
                  <span className="stats__stat">{hour}</span>{" "}
                  {hour === 1 ? "hour" : "hours"}{" "}
                </>
              )}
              {totalSecondsPassed >= 60 && (
                <>
                  <span className="stats__stat">{minute}</span>{" "}
                  {minute === 1 ? "minute" : "minutes"} and{" "}
                </>
              )}
              <span className="stats__stat">{second}</span>{" "}
              {second <= 1 ? "second" : "seconds"}
            </p>
            <button
              type="button"
              className="button reset__button"
              onClick={resetButtonHandler}
            >
              Reset Game
            </button>
          </div>
        )}
        {currentPage === "ABOUT" && <h1>ABOUT</h1>}
      </div>
    </div>
  );
}

export default App;
