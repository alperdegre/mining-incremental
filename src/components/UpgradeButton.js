import React from "react";
import PropTypes from "prop-types";
import "./UpgradeButton.css";
import { formatNumber } from "../utils/utils";

const UpgradeButton = ({ id, name, cost, onUpgradeBought }) => {
  const purchaseUpgradeHandler = (event) => {
    event.preventDefault();
    onUpgradeBought(id, cost);
  };

  return (
    <button
      type="button"
      onClick={purchaseUpgradeHandler}
      className="upgrade__button"
    >
      <h3>{name}</h3>
      <p>{formatNumber(cost, 0)}</p>
    </button>
  );
};

UpgradeButton.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  cost: PropTypes.string,
  onUpgradeBought: PropTypes.func,
};

export default UpgradeButton;
