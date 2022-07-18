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
  applyMinerUpgrade
} from "./features/miners/minersSlice";
import { checkForUpgrades, buyUpgrade } from "./features/upgrade/upgradesSlice";
import { formatNumber, calculateRealCost } from "./utils/utils";
import UpgradeButton from "./components/UpgradeButton";
import { useEffect, useMemo } from "react";
import Decimal from "break_infinity.js";

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

  // Memoizes an array to render upgrades, filters through the array to find
  // upgrades where upgrade.id is included in unlocked Upgrades
  const upgradesToRender = useMemo(() => {
    return upgrades.filter((upgrade) => {
      return (
        unlockedUpgrades.includes(upgrade.id) &&
        !boughtUpgrades.includes(upgrade.id)
      );
    });
  }, [unlockedUpgrades, boughtUpgrades]);
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
      .reduce((prev, curr) => +prev + +curr);

    // Updates per second generation
    dispatch(updateCurrencyPerSecond(perSecondGeneration));

    // Increases money per tick
    dispatch(doTick());
  }, [10]);

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
    if (currentCurrency >= miners[id].currentCost) {
      // Dispatches buying one, and updates currency with proper cost
      dispatch(buyOne(id));
      dispatch(updateCurrency(miners[id].currentCost));
      dispatch(checkForUpgrades({ id, amount: miners[id].amount + 1 }));
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

    if (currentCurrency >= realCost) {
      // Dispatches buying until 10, and updates currency with proper cost
      dispatch(buyUntil10(id));
      dispatch(updateCurrency(realCost));
    }
  };

  const buyUpgradeHandler = (id, cost) => {
    const currencyAvailable = new Decimal(currentCurrency);
    const upgradeCost = new Decimal(cost);

    if (currencyAvailable.minus(upgradeCost).greaterThan(0)) {
      const specificUpgrade = upgrades.filter(upgrade => upgrade.id === id);
      dispatch(updateCurrency(upgradeCost));
      dispatch(buyUpgrade(id));
      dispatch(applyMinerUpgrade({id: specificUpgrade[0].id, type: specificUpgrade[0].type, coefficient: specificUpgrade[0].coefficient}));
    }
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
                  onUpgradeBought={buyUpgradeHandler}
                />
              );
            })}
          </div>
        )}
        {currentPage === "STATS" && <h1>STATS</h1>}
        {currentPage === "ABOUT" && <h1>ABOUT</h1>}
      </div>
    </div>
  );
}

export default App;
