import React from "react";
import PropTypes from "prop-types";
import "./MinerButton.css";
import { useSelector } from "react-redux";
import { calculateRealCost, formatNumber } from "../utils/utils";

const MinerButton = ({
  id,
  name,
  amount,
  cost,
  growthCoefficient,
  currencyPerSecond,
  onBuyOne,
  onBuyUntil10,
}) => {
  // Settings Selectors
  const notation = useSelector((state) => state.settings.notation);

  const buyOneHandler = (event) => {
    event.preventDefault();
    onBuyOne(id);
  };

  const buyUntil10Handler = (event) => {
    event.preventDefault();
    onBuyUntil10(id);
  };

  return (
    <tr className="miner__row">
      <td className="miner__name">{name}</td>
      <td className="miner__generation">
        Generating {formatNumber(currencyPerSecond, false, notation)} Mining
        Bucks
      </td>
      <td className="miner__amount">
        {formatNumber(amount, true, notation)} {name} Miners
      </td>
      <td className="miner__buttons">
        <button type="button" className="button" onClick={buyOneHandler}>
          Cost: {formatNumber(cost, false, notation)}
        </button>
        <button type="button" className="button" onClick={buyUntil10Handler}>
          Until 10, Cost:{" "}
          {formatNumber(
            calculateRealCost(amount, growthCoefficient, cost),
            false,
            notation
          )}
        </button>
      </td>
    </tr>
  );
};

MinerButton.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  amount: PropTypes.string,
  cost: PropTypes.string,
  growthCoefficient: PropTypes.number,
  onBuyOne: PropTypes.func,
  onBuyUntil10: PropTypes.func,
  currencyPerSecond: PropTypes.string,
};

export default MinerButton;
