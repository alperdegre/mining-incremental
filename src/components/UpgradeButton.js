import React from "react";
import PropTypes from "prop-types";
import "./UpgradeButton.css";
import { formatNumber } from "../utils/utils";

const UpgradeButton = ({name, cost}) => {

  const purchaseUpgradeHandler = (event) => {
    event.preventDefault();
    
  };

  return (
    <button type="button" onClick={purchaseUpgradeHandler} className="upgrade__button">
      <h3>{name}</h3>
      <p>{formatNumber(cost,0)}</p>
    </button>
  );
};

UpgradeButton.propTypes = {
    name: PropTypes.string,
    cost: PropTypes.string
};

export default UpgradeButton;
