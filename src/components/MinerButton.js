import React from "react";
import PropTypes from "prop-types";
import "./MinerButton.css";

const MinerButton = ({
  id,
  name,
  amount,
  cost,
  currencyPerSecond,
  onBuyOne,
}) => {
  const buyOneHandler = (event) => {
    event.preventDefault();
    onBuyOne(id);
  };

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
          Cost: {cost}
        </button>
        <button type="button" className="miner__button">
          Until 10, Cost: 100
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
  currencyPerSecond: PropTypes.number,
};

export default MinerButton;
