import Decimal from "break_infinity.js";

export function formatNumber(inputNum, trunc, options) {
  const number = new Decimal(inputNum);
  const exponent = number.exponent;
  const precisionNumber = trunc === true ? 0 : 2;

  if (exponent < 3) {
    return number.toFixed(precisionNumber);
  }
  switch (options) {
    case "standard":
      if (exponent >= 3 && exponent < 6) {
        return `${number.divideBy(10 ** 3).toFixed(precisionNumber)} K`;
      } else if (exponent >= 6 && exponent < 9) {
        return `${number.divideBy(10 ** 6).toFixed(precisionNumber)} M`;
      } else if (exponent >= 9 && exponent < 12) {
        return `${number.divideBy(10 ** 9).toFixed(precisionNumber)} B`;
      } else if (exponent >= 12 && exponent < 15) {
        return `${number.divideBy(10 ** 12).toFixed(precisionNumber)} t`;
      } else if (exponent >= 15 && exponent < 18) {
        return `${number.divideBy(10 ** 15).toFixed(precisionNumber)} q`;
      } else if (exponent >= 18 && exponent < 21) {
        return `${number.divideBy(10 ** 18).toFixed(precisionNumber)} Q`;
      } else if (exponent >= 21 && exponent < 24) {
        return `${number.divideBy(10 ** 21).toFixed(precisionNumber)} s`;
      } else if (exponent >= 24 && exponent < 27) {
        return `${number.divideBy(10 ** 24).toFixed(precisionNumber)} S`;
      } else if (exponent >= 27 && exponent < 30) {
        return `${number.divideBy(10 ** 27).toFixed(precisionNumber)} o`;
      } else if (exponent >= 30 && exponent < 33) {
        return `${number.divideBy(10 ** 30).toFixed(precisionNumber)} n`;
      } else if (exponent >= 33 && exponent < 36) {
        return `${number.divideBy(10 ** 33).toFixed(precisionNumber)} d`;
      } else if (exponent >= 36 && exponent < 39) {
        return `${number.divideBy(10 ** 36).toFixed(precisionNumber)} U`;
      } else if (exponent >= 39 && exponent < 42) {
        return `${number.divideBy(10 ** 39).toFixed(precisionNumber)} D`;
      } else if (exponent >= 42 && exponent < 45) {
        return `${number.divideBy(10 ** 42).toFixed(precisionNumber)} T`;
      } else if (exponent >= 45 && exponent < 48) {
        return `${number.divideBy(10 ** 45).toFixed(precisionNumber)} Qt`;
      } else if (exponent >= 48 && exponent < 51) {
        return `${number.divideBy(10 ** 48).toFixed(precisionNumber)} Qd`;
      } else if (exponent >= 51 && exponent < 54) {
        return `${number.divideBy(10 ** 51).toFixed(precisionNumber)} Sd`;
      } else if (exponent >= 54 && exponent < 57) {
        return `${number.divideBy(10 ** 54).toFixed(precisionNumber)} St`;
      } else if (exponent >= 57 && exponent < 60) {
        return `${number.divideBy(10 ** 57).toFixed(precisionNumber)} O`;
      } else if (exponent >= 60 && exponent < 63) {
        return `${number.divideBy(10 ** 60).toFixed(precisionNumber)} N`;
      } else if (exponent >= 63 && exponent < 66) {
        return `${number.divideBy(10 ** 63).toFixed(precisionNumber)} v`;
      } else if (exponent >= 66) {
        return `${number.divideBy(10 ** 66).toFixed(precisionNumber)} c`;
      }
      break;
    case "scientific":
      return `${number.mantissa.toFixed(2)}e${number.exponent}`;
    case "engineering":
      if (exponent === 3){
        return `${number.mantissa.toFixed(2)}e${number.exponent}`;
      } else if(exponent === 4){
        return `${(number.mantissa * 10).toFixed(2)}e${number.exponent - 1}`;
      } else {
        return `${(number.mantissa * 100).toFixed(2)}e${number.exponent - 2}`;
      }
  }
}

export function calculateRealCost(amount, growthCoefficient, currentCost) {
  const onesDigit = parseInt(amount.slice(amount.length - 1, amount.length));
  const currentCostDecimal = new Decimal(currentCost);

  let total = 0;

  for (let i = 0; i < 10 - onesDigit; i++) {
    total += growthCoefficient ** i;
  }

  const realCost = currentCostDecimal.times(total);

  return realCost.toString();
}

export function capitalizeString(string) {
  if(typeof string !== "string") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}