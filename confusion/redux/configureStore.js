import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { dishes } from './dishes';
import { comments } from './comments';
import { leaders } from './leaders';
import { promotions } from './promotions';
import { favorites } from './favorites';

export const ConfigureStore = () => {

    const config = {
        key: 'root',
        storage,
        debug: true
    }

    const store = createStore(
        persistCombineReducers(config, {
            dishes,
            comments,
            leaders,
            promotions,
            favorites
        }),
        applyMiddleware(thunk, logger)
    );

    const persistor = persistStore(store);

    return { store, persistor }
    
}


