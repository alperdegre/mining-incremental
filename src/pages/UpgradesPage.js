import Decimal from "break_infinity.js";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import UpgradeButton from "../components/UpgradeButton";
import { updateCurrency } from "../features/currency/currencySlice";
import { applyMinerUpgrade } from "../features/miners/minersSlice";
import { updateUpgradesBought } from "../features/stats/statsSlice";
import { buyUpgrade } from "../features/upgrade/upgradesSlice";

const UpgradesPage = () => {
  const dispatch = useDispatch();

  // Navigation Selectors
  const currentPage = useSelector((state) => state.navigation.currentPage);

  // Upgrade Selectors
  const upgrades = useSelector((state) => state.upgrades.upgrades);
  const unlockedUpgrades = useSelector(
    (state) => state.upgrades.unlockedUpgrades
  );
  const boughtUpgrades = useSelector((state) => state.upgrades.boughtUpgrades);

  // Currency Selectors
  const currentCurrency = useSelector(
    (state) => state.currency.currentCurrency
  );

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

  // Buys an Upgrade depending on id
  const buyUpgradeHandler = (id, cost) => {
    const currencyAvailable = new Decimal(currentCurrency);
    const upgradeCost = new Decimal(cost);

    if (currencyAvailable.minus(upgradeCost).greaterThan(0)) {
      const specificUpgrade = upgrades.filter((upgrade) => upgrade.id === id);
      dispatch(
        updateCurrency({ type: "remove", currency: upgradeCost.toString() })
      );
      dispatch(buyUpgrade(id));

      dispatch(
        applyMinerUpgrade({
          id: specificUpgrade[0].appliesTo,
          type: specificUpgrade[0].type,
          coefficient: specificUpgrade[0].coefficient,
        })
      );
      dispatch(updateUpgradesBought(upgradeCost.toString()));
    }
  };

  return (
    currentPage === "UPGRADES" && (
      <>
        <h2 className="page__title">UPGRADES</h2>
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
      </>
    )
  );
};

export default UpgradesPage;
