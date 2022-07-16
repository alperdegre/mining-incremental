import useInterval from './hooks/useInterval';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment } from './features/counter/counterSlice';

function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  useInterval(() => {
    dispatch(increment());
  },[1000]);
  
  return (
    <div className="App">
      <h1>Incremental Prototype</h1>
      <p>Counter: {count}</p>
    </div>
  );
}

export default App;
