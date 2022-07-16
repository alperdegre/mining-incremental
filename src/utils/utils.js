export function formatNumber(inputNum, fixed) {
  let num = inputNum;
  if (typeof inputNum === "string") {
    num = +inputNum;
  }

  if (num < 1000) {
    return num.toFixed(fixed);
  } else if (num >= 1000) {
    switch (num.toFixed(0).length - 1) {
      case 3:
      case 4:
      case 5:
        return `${(num / 10 ** 3).toFixed(fixed)} K`;
      case 6:
      case 7:
      case 8:
        return `${(num / 10 ** 6).toFixed(fixed)} M`;
      case 9:
      case 10:
      case 11:
        return `${(num / 10 ** 9).toFixed(fixed)} B`;
      case 12:
      case 13:
      case 14:
        return `${(num / 10 ** 12).toFixed(fixed)} t`;
      case 15:
      case 16:
      case 17:
        return `${(num / 10 ** 15).toFixed(fixed)} q`;
      case 18:
      case 19:
      case 20:
        return `${(num / 10 ** 18).toFixed(fixed)} Q`;
      case 21:
      case 22:
      case 23:
        return `${(num / 10 ** 21).toFixed(fixed)} s`;
      case 24:
      case 25:
      case 26:
        return `${(num / 10 ** 24).toFixed(fixed)} S`;
      case 27:
      case 28:
      case 29:
        return `${(num / 10 ** 27).toFixed(fixed)} o`;
      case 30:
      case 31:
      case 32:
        return `${(num / 10 ** 30).toFixed(fixed)} n`;
      case 33:
      case 34:
      case 35:
        return `${(num / 10 ** 33).toFixed(fixed)} d`;
      case 36:
      case 37:
      case 38:
        return `${(num / 10 ** 36).toFixed(fixed)} U`;
      case 39:
      case 40:
      case 41:
        return `${(num / 10 ** 39).toFixed(fixed)} D`;
      case 42:
      case 43:
      case 44:
        return `${(num / 10 ** 42).toFixed(fixed)} T`;
      case 45:
      case 46:
      case 47:
        return `${(num / 10 ** 45).toFixed(fixed)} Qt`;
      case 48:
      case 49:
      case 50:
        return `${(num / 10 ** 48).toFixed(fixed)} Qd`;
      case 51:
      case 52:
      case 53:
        return `${(num / 10 ** 51).toFixed(fixed)} Sd`;
      case 54:
      case 55:
      case 56:
        return `${(num / 10 ** 54).toFixed(fixed)} St`;
      case 57:
      case 58:
      case 59:
        return `${(num / 10 ** 57).toFixed(fixed)} O`;
      case 60:
      case 61:
      case 62:
        return `${(num / 10 ** 60).toFixed(fixed)} N`;
      case 63:
      case 64:
      case 65:
        return `${(num / 10 ** 63).toFixed(fixed)} v`;
      case 66:
      case 67:
      case 68:
        return `${num} c`;
      default:
        return num;
    }
  }
}

export function calculateRealCost(amount, growthCoefficient, currentCost) {
  let sum = 0;
  for (let i = 0; i < (10 - (amount % 10)); i++){
    sum += growthCoefficient**i;
  }   
  const realCost = currentCost * sum;

  return realCost;
}