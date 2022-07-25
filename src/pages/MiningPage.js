import Decimal from "break_infinity.js";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateRealCost } from "../utils/utils";
import { buyOne, buyUntil10 } from "../features/miners/minersSlice";
import { updateMinersBought } from "../features/stats/statsSlice";
import { updateCurrency } from "../features/currency/currencySlice";
import MinerButton from "../components/MinerButton";
import { checkForUpgrades } from "../features/upgrade/upgradesSlice";

const MiningPage = () => {
  const dispatch = useDispatch();

  // Navigation Selectors
  const currentPage = useSelector((state) => state.navigation.currentPage);

  // Currency Selectors
  const currentCurrency = useSelector(
    (state) => state.currency.currentCurrency
  );

  // Miner Selectors
  const miners = useSelector((state) => state.miners.miners);

  const buyMinerHandler = (id) => {
    // Gets back id from a specific miner generator button and checks if you have enough money
    const current = new Decimal(currentCurrency);
    if (current.greaterThanOrEqualTo(miners[id].currentCost)) {
      // Dispatches buying one, and updates currency with proper cost
      // Checks for upgrades and updates miners
      const minerAmount = new Decimal(miners[id].amount).plus(1).toString();
      dispatch(buyOne(id));
      dispatch(
        updateCurrency({ type: "remove", currency: miners[id].currentCost })
      );
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
      const onesDigit = parseInt(
        miners[id].amount.slice(
          miners[id].amount.length - 1,
          miners[id].amount.length
        )
      );
      const amountLeftUntil10 = new Decimal(10 - onesDigit).toString();
      const minerAmount = new Decimal(miners[id].amount).plus(amountLeftUntil10).toString();

      dispatch(buyUntil10(id));
      dispatch(updateCurrency({ type: "remove", currency: realCost }));
      dispatch(checkForUpgrades({ id, amount: minerAmount }));
      dispatch(
        updateMinersBought({
          amount: amountLeftUntil10,
          cost: calculateRealCost(
            miners[id].amount,
            miners[id].growthCoefficient,
            miners[id].currentCost
          ),
        })
      );
    }
  };

  return (
    currentPage === "MINING" && (
      <>
        <h2 className="page__title">MINERS</h2>
        <table className="miningTable">
          <tbody>
            {miners.map((miner) => {
              return (
                miner.unlocked && (
                  <MinerButton
                    key={miner.id}
                    id={miner.id}
                    name={miner.name}
                    amount={miner.amount}
                    cost={miner.currentCost}
                    growthCoefficient={miner.growthCoefficient}
                    onBuyOne={buyMinerHandler}
                    onBuyUntil10={buyMinerUntil10Handler}
                    currencyPerSecond={miner.perSecond}
                  />
                )
              );
            })}
          </tbody>
        </table>
      </>
    )
  );
};

export default MiningPage;
