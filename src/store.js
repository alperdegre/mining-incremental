import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/currency/counterSlice';
import currencyReducer from './features/currency/currencySlice';
import navigationReducer from './features/navigation/navigationSlice';

export default configureStore({
    reducer: {
        counter: counterReducer,
        currency: currencyReducer,
        navigation: navigationReducer,
    },
})