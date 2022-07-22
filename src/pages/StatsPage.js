import React from "react";
import { useSelector } from "react-redux";
import { formatNumber } from "../utils/utils";

const StatsPage = () => {
  // Navigation Selectors
  const currentPage = useSelector((state) => state.navigation.currentPage);

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

  // Settings Selectors
  const notation = useSelector((state) => state.settings.notation);

  // Time Variables
  const year = Math.floor(totalSecondsPassed / 31536000);
  const month = Math.floor((totalSecondsPassed % 31536000) / 2628000);
  const day = Math.floor(((totalSecondsPassed % 31536000) % 2628000) / 86400);
  const hour = Math.floor((totalSecondsPassed % (3600 * 24)) / 3600);
  const minute = Math.floor((totalSecondsPassed % 3600) / 60);
  const second = Math.floor(totalSecondsPassed % 60);

  return (
    currentPage === "STATS" && (
      <div className="statsSection">
        <h2 className="page__title">Stats</h2>
        <p className="stats__text">
          You have generated{" "}
          <span className="stats__stat">
            {formatNumber(totalGeneratedBucks, false, notation)}
          </span>{" "}
          bucks so far!
        </p>
        <p className="stats__text">
          You bought{" "}
          <span className="stats__stat">
            {formatNumber(totalMinersBought, true, notation)}
          </span>{" "}
          miners to do that.
        </p>
        <p className="stats__text">
          You bought <span className="stats__stat">{totalUpgradesBought}</span>{" "}
          upgrades for your miners.
        </p>
        <p className="stats__text">
          You spent{" "}
          <span className="stats__stat">
            {formatNumber(totalBucksSpent, false, notation)}
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
      </div>
    )
  );
};

export default StatsPage;
