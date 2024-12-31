import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: [
    'config',
    'auth',
    'userConfig'
    // 'product'
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

function handleMiddleware() {
  const middlewares = getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  });
  if (__DEV__) {
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
  }
  return middlewares;
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: handleMiddleware(),
  devTools: true,
});

export const persistor = persistStore(store);
