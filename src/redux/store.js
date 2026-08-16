import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { STORAGE_KEYS } from "@/constants/config";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";

/**
 * Real cart / wishlist slices, each persisted independently via
 * redux-persist under the storage keys constants/config.js already
 * reserves for them. Only `items`/`grandTotal` are whitelisted — the
 * transient `status`/`error`/`isDrawerOpen` fields are never persisted,
 * so a reload never shows a stale "loading" or "failed" state.
 *
 * This module only ever runs in the browser: it's reachable exclusively
 * through ReduxProvider ("use client"), so Next.js bundles it into the
 * client chunk and never evaluates it during server rendering — no
 * SSR/localStorage guard needed for redux-persist's default storage.
 */
const cartPersistConfig = {
  key: STORAGE_KEYS.cart,
  storage,
  whitelist: ["items", "grandTotal"],
};

const wishlistPersistConfig = {
  key: STORAGE_KEYS.wishlist,
  storage,
  whitelist: ["items"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  wishlist: persistReducer(wishlistPersistConfig, wishlistReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

/** Exported for a future logout flow to purge persisted cart/wishlist state. */
export const persistor = persistStore(store);
