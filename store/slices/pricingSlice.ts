import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// API Response Types
export interface PlanPricing {
    base: number;
    deliveryFee: number;
}

export interface Plan {
    id: string;
    plan_name: string;
    description: string;
    hasDiscount: boolean;
    discount_value: number;
    discount_type: string;
    perBinPrice: number;
    pricing: Record<string, Record<string, PlanPricing>>; // months -> bins -> pricing
}

export interface Bundle {
    id: string;
    bundle_name: string;
    description: string;
    fromMonth: string;
    toMonth: string;
    months: number;
    extras: string;
    price: number;
}

export interface Addon {
    name: string;
    description: string;
    chargeType: "fixed" | "percent";
    amount: number;
    reDeliveryFee: number;
    recurrence: "monthly" | "one_time";
    premiumFeatures: boolean;
}

export interface ProtectionPlan {
    name: string;
    price: number;
    displayPrice: string;
    limit: number;
    displayLimit: string;
    description: string;
}

export interface DeliveryZone {
    id: string;
    zoneName: string;
    description: string;
    distanceRange: string;
    distanceMin: number;
    distanceMax: number;
    price: number;
    status: string;
}

export interface Pricing {
    plans: Plan[];
    bundles: Bundle[];
    addons: Addon[];
    protection_plans: ProtectionPlan[];
    deliveryZones?: DeliveryZone[] | { data?: DeliveryZone[] };
}

interface PricingState {
    data: Pricing | null;
    loading: boolean;
    error: string | null;
}

const initialState: PricingState = {
    data: null,
    loading: false,
    error: null,
};

const pricingSlice = createSlice({
    name: "pricing",
    initialState,
    reducers: {
        setPricingData: (state, action: PayloadAction<Pricing>) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
            if (action.payload) {
                state.error = null;
            }
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearPricing: (state) => {
            state.data = null;
            state.error = null;
            state.loading = false;
        },
    },
});

export const { setPricingData, setLoading, setError, clearPricing } = pricingSlice.actions;
export default pricingSlice.reducer;

