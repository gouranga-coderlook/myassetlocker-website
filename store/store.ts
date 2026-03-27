// store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import pricingReducer from "./slices/pricingSlice";
import cartReducer from "./slices/cartSlice";
import warehouseReducer from "./slices/warehouseSlice";

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    pricing: pricingReducer,
    cart: cartReducer,
    warehouses: warehouseReducer,
});

// Infer the RootState and AppDispatch types from the store itself
export const makeStore = (preloadedState?: Partial<ReturnType<typeof rootReducer>>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false }),
        devTools: process.env.NODE_ENV !== "production",
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
