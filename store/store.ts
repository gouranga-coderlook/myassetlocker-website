// store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import pricingReducer from "./slices/pricingSlice";
import cartReducer from "./slices/cartSlice";

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    pricing: pricingReducer,
    cart: cartReducer,
});

// Infer the RootState and AppDispatch types from the store itself
export const makeStore = (preloadedState?: Partial<ReturnType<typeof rootReducer>>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (gdm) => gdm({ serializableCheck: false }),
        devTools: process.env.NODE_ENV !== "production",
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
