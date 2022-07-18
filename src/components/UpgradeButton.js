import React from "react";
import PropTypes from "prop-types";
import "./UpgradeButton.css";
import { formatNumber } from "../utils/utils";

const UpgradeButton = ({ id, name, cost, description, onUpgradeBought }) => {
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
      <div>
      <h3>{name}</h3>
      <p>{description}</p>
      </div>
      <div className="upgrade__cost">
        <p>{formatNumber(cost, 0)} Bucks</p>
      </div>
    </button>
  );
};

UpgradeButton.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  cost: PropTypes.string,
  description: PropTypes.string,
  onUpgradeBought: PropTypes.func,
};

export default UpgradeButton;
