import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/currency/counterSlice';
import currencyReducer from './features/currency/currencySlice';
import navigationReducer from './features/navigation/navigationSlice';
import minersReducer from './features/miners/minersSlice'
import upgradesReducer from './features/upgrade/upgradesSlice';
import statsReducer from './features/stats/statsSlice';
import settingsReducer from './features/settings/settingsSlice';

export default configureStore({
    reducer: {
        counter: counterReducer,
        currency: currencyReducer,
        navigation: navigationReducer,
        miners: minersReducer,
        upgrades: upgradesReducer,
        stats: statsReducer,
        settings: settingsReducer,
    },
})