import React from "react";
import PropTypes from "prop-types";
import "./MinerButton.css";
import { formatNumber } from "../utils/utils";

const MinerButton = ({
  id,
  name,
  amount,
  cost,
  costUntil10,
  currencyPerSecond,
  onBuyOne,
  onBuyUntil10
}) => {

  const buyOneHandler = (event) => {
    event.preventDefault();
    onBuyOne(id);
  };

  const buyUntil10Handler = event => {
    event.preventDefault();
    onBuyUntil10(id);
  }

  return (
    <tr className="miner__row">
      <td className="miner__name">{name}</td>
      <td className="miner__generation">
        Generating {formatNumber(currencyPerSecond, 0)} Mining Bucks
      </td>
      <td className="miner__amount">
        {formatNumber(amount, 0)} {name} Miners
      </td>
      <td className="miner__buttons">
        <button type="button" className="button" onClick={buyOneHandler}>
          Cost: {formatNumber(cost, 0)}
        </button>
        <button type="button" className="button" onClick={buyUntil10Handler}>
          Until 10, Cost: {formatNumber(costUntil10, 2)}
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
  costUntil10: PropTypes.string,
  onBuyOne: PropTypes.func,
  onBuyUntil10: PropTypes.func,
  currencyPerSecond: PropTypes.string,
};

export default MinerButton;
