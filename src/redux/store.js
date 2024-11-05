import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./slice";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

// Configuration for persisting walletReducer in session storage
const persistConfigSession = {
  key: "wallet",
  storage: storageSession,
};

// Persist reducers with their respective configurations
const persistedWalletReducer = persistReducer(persistConfigSession, walletReducer);

// Configure store with persisted reducers
const store = configureStore({
  reducer: {
    wallet: persistedWalletReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
