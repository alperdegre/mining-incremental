import React from "react";
import PropTypes from "prop-types";
import "./MinerButton.css";

const MinerButton = ({ name, amount, currencyPerSecond, onBuyOne }) => {
  return (
    <tr className="miner__row">
      <td className="miner__name">{name}</td>
      <td className="miner__generation">Generating {currencyPerSecond} Mining Bucks</td>
      <td className="miner__amount">{amount} {name} Miners</td>
      <td className="miner__buttons">
        <button type="button" className="miner__button" onClick={onBuyOne}>Cost: 10</button>
        <button type="button" className="miner__button">Until 10, Cost: 100</button>
      </td>
    </tr>
  );
};

MinerButton.propTypes = {
  name: PropTypes.string,
  amount: PropTypes.number,
  onBuyOne: PropTypes.func,
  currencyPerSecond: PropTypes.number,
};

export default MinerButton;
