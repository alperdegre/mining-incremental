import useInterval from "./hooks/useInterval";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  doTick,
  updateCurrencyPerSecond,
  updateCurrency
} from "./features/currency/currencySlice";
import { changePage } from "./features/navigation/navigationSlice";
import MinerButton from "./components/MinerButton";
import { buyOne } from "./features/miners/minersSlice";

function App() {
  const currentCurrency = useSelector(
    (state) => state.currency.currentCurrency
  );
  const currencyPerSecond = useSelector(
    (state) => state.currency.currencyPerSecond
  );
  const tickRate = useSelector((state) => state.currency.tickRate);
  const currentPage = useSelector((state) => state.navigation.currentPage);
  const miners = useSelector((state) => state.miners.miners);
  const dispatch = useDispatch();

  useInterval(() => {
    const perSecondGeneration = miners
      .map((miner) => miner.perSecond)
      .reduce((prev, curr) => +prev + +curr);
    dispatch(updateCurrencyPerSecond(perSecondGeneration));
    dispatch(doTick());
  }, [1000]);

  // Nav button handlers changing the currentPage value inside navigationSlice
  // This value is used to render main section conditionally
  const miningButtonHandler = (event) => {
    event.preventDefault();
    dispatch(changePage("MINING"));
  };
  const upgradesButtonHandler = (event) => {
    event.preventDefault();
    dispatch(changePage("UPGRADES"));
  };
  const statsButtonHandler = (event) => {
    event.preventDefault();
    dispatch(changePage("STATS"));
  };
  const aboutButtonHandler = (event) => {
    event.preventDefault();
    dispatch(changePage("ABOUT"));
  };

  const buyMinerHandler = (id) => {
    if (currentCurrency >= miners[id].cost) {
      dispatch(buyOne(id));
      dispatch(updateCurrency(miners[id].cost));
    }
  };

  return (
    <div className="App">
      <div className="currencySection">
        <h1>Mining Idle Prototype</h1>
        <h2>You have {currentCurrency.toFixed(2)} Mining Bucks</h2>
        <h3>You are getting {currencyPerSecond} Mining Bucks per second</h3>
        <p>Tickrate: {tickRate}</p>
      </div>
      <div className="navButtonSection">
        <button onClick={miningButtonHandler} type="button">
          Mining
        </button>
        <button onClick={upgradesButtonHandler} type="button">
          Upgrades
        </button>
        <button onClick={statsButtonHandler} type="button">
          Stats
        </button>
        <button onClick={aboutButtonHandler} type="button">
          About
        </button>
      </div>
      <div className="mainSection">
        {currentPage === "MINING" && (
          <table className="miningTable">
            <tbody>
              {miners.map((miner) => {
                return (
                  <MinerButton
                    key={miner.id}
                    id={miner.id}
                    name={miner.name}
                    amount={miner.amount}
                    cost={miner.cost}
                    onBuyOne={buyMinerHandler}
                    currencyPerSecond={miner.perSecond}
                  />
                );
              })}
            </tbody>
          </table>
        )}

        {currentPage === "UPGRADES" && <h1>UPGRADES</h1>}
        {currentPage === "STATS" && <h1>STATS</h1>}
        {currentPage === "ABOUT" && <h1>ABOUT</h1>}
      </div>
    </div>
  );
}

export default App;
