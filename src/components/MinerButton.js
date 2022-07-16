import React from "react";
import PropTypes from "prop-types";
import "./MinerButton.css";
import { formatNumber } from "../utils/numberFormatter";

const MinerButton = ({
  id,
  name,
  amount,
  cost,
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
        Generating {currencyPerSecond} Mining Bucks
      </td>
      <td className="miner__amount">
        {amount} {name} Miners
      </td>
      <td className="miner__buttons">
        <button type="button" className="miner__button" onClick={buyOneHandler}>
          Cost: {formatNumber(cost, 0)}
        </button>
        <button type="button" className="miner__button" onClick={buyUntil10Handler}>
          Until 10, Cost: {formatNumber(cost * (10 - amount%10), 0)}
        </button>
      </td>
    </tr>
  );
};

MinerButton.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  amount: PropTypes.number,
  cost: PropTypes.number,
  onBuyOne: PropTypes.func,
  onBuyUntil10: PropTypes.func,
  currencyPerSecond: PropTypes.number,
};

export default MinerButton;
