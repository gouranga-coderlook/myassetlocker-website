import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Plan, Bundle, Addon, ProtectionPlan, DeliveryZone } from "./pricingSlice";

export interface DeliveryInformation {
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryNotes: string;
}

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  addressDetails: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fullAddress: string;
  } | null;
  nearestStore: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    region: "india" | "usa";
  } | null;
  distanceKm: number | null;
  deliveryCharge: number | "out_of_area" | null;
  matchedZone: DeliveryZone | null;
}

export interface DurationBins {
  months: number | null;
  bins: number;
}

export interface BookingCart {
  // Pricing breakdown
  total: number;
  baseStorageCost: number;
  redeliveryFee: number;
  climateControlCost: number;
  addonsCost: number;
  addonsDeliveryCost: number;
  protectionPlanCost: number;
  savings: number;
  
  // Plan selection - store full plan object with all details
  plan: Plan | null;
  
  // Bundle selection - store full bundle object
  bundles: Bundle | null;
  
  // Add-ons - store full addon objects array
  addons: Addon[];
  
  // Protection plan - store full protection plan object
  protectionPlan: ProtectionPlan | null;
  
  // Duration and bins
  durationBins: DurationBins;
  
  // Climate control flag
  climateControl: boolean;
  
  // Delivery information
  deliveryInfo: DeliveryInformation;
  
  // Location data from StoreLocationFinder
  locationData: LocationData | null;
  
  // Coupon code
  couponCode?: string | null;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  cartId?: string; // UUID for guest cart identification
  cartItemId?: string; // UUID for cart item identification (when loaded from API)
  zoneDeliveryCharges: number | null;
}

const initialState: BookingCart = {
  // Pricing breakdown
  total: 0,
  baseStorageCost: 0,
  redeliveryFee: 0,
  climateControlCost: 0,
  addonsCost: 0,
  addonsDeliveryCost: 0,
  protectionPlanCost: 0,
  savings: 0,
  zoneDeliveryCharges:0,
  
  // Selections
  plan: null,
  bundles: null,
  addons: [],
  protectionPlan: null,
  durationBins: {
    months: null,
    bins: 0,
  },
  climateControl: false,
  
  // Delivery information - Dummy data for testing Remove this before production
  // deliveryInfo: {
  //   fullName: "John Doe",
  //   email: "john.doe@example.com",
  //   phone: "(555) 123-4567",
  //   deliveryAddress: "123 Main Street, Apt 4B",
  //   city: "New York",
  //   state: "NY",
  //   zipCode: "10001",
  //   deliveryNotes: "Please call before delivery. Ring doorbell twice.",
  // },
  
  locationData: null,
  couponCode: null,

  deliveryInfo: {
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    city: "",
    state: "",
    zipCode: "",
    deliveryNotes: "",
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Pricing breakdown actions
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setBaseStorageCost: (state, action: PayloadAction<number>) => {
      state.baseStorageCost = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setRedeliveryFee: (state, action: PayloadAction<number>) => {
      state.redeliveryFee = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setClimateControlCost: (state, action: PayloadAction<number>) => {
      state.climateControlCost = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setAddonsCost: (state, action: PayloadAction<number>) => {
      state.addonsCost = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setAddonsDeliveryCost: (state, action: PayloadAction<number>) => {
      state.addonsDeliveryCost = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setProtectionPlanCost: (state, action: PayloadAction<number>) => {
      state.protectionPlanCost = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setSavings: (state, action: PayloadAction<number>) => {
      state.savings = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setPricingBreakdown: (state, action: PayloadAction<Partial<Pick<BookingCart, "total" | "baseStorageCost" | "redeliveryFee" | "climateControlCost" | "addonsCost" | "addonsDeliveryCost" | "protectionPlanCost" | "savings">>>) => {
      Object.assign(state, action.payload);
      state.updatedAt = new Date().toISOString();
    },

    // Plan actions - store full plan object
    setPlan: (state, action: PayloadAction<Plan | null>) => {
      state.plan = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    // Bundle actions - store full bundle object
    setBundle: (state, action: PayloadAction<Bundle | null>) => {
      state.bundles = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    // Duration and bins actions
    setDurationBins: (state, action: PayloadAction<DurationBins>) => {
      state.durationBins = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setMonths: (state, action: PayloadAction<number | null>) => {
      state.durationBins.months = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    setBins: (state, action: PayloadAction<number>) => {
      state.durationBins.bins = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    // Addon actions - store full addon objects (managed by ID when available, fallback to name)
    addAddon: (state, action: PayloadAction<Addon>) => {
      // Check if addon exists by ID first, then by name
      const exists = state.addons.some(a => 
        (a.id && action.payload.id && a.id === action.payload.id) ||
        (!a.id && !action.payload.id && a.name === action.payload.name)
      );
      if (!exists) {
        state.addons.push(action.payload);
        state.updatedAt = new Date().toISOString();
      }
    },
    removeAddon: (state, action: PayloadAction<string>) => {
      // Remove by ID if provided (UUID format), otherwise by name
      const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(action.payload);
      if (isId) {
        state.addons = state.addons.filter((addon) => addon.id !== action.payload);
      } else {
        state.addons = state.addons.filter((addon) => addon.name !== action.payload);
      }
      state.updatedAt = new Date().toISOString();
    },
    toggleAddon: (state, action: PayloadAction<Addon>) => {
      // Find by ID first, then by name
      const index = state.addons.findIndex(a => 
        (a.id && action.payload.id && a.id === action.payload.id) ||
        (!a.id && !action.payload.id && a.name === action.payload.name)
      );
      if (index === -1) {
        state.addons.push(action.payload);
      } else {
        state.addons.splice(index, 1);
      }
      state.updatedAt = new Date().toISOString();
    },
    setAddons: (state, action: PayloadAction<Addon[]>) => {
      state.addons = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    // Climate control action
    setClimateControl: (state, action: PayloadAction<boolean>) => {
      state.climateControl = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    // Protection plan action - store full protection plan object
    setProtectionPlan: (state, action: PayloadAction<ProtectionPlan | null>) => {
      state.protectionPlan = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    // Delivery information actions
    setDeliveryInfo: (state, action: PayloadAction<Partial<DeliveryInformation>>) => {
      state.deliveryInfo = {
        ...state.deliveryInfo,
        ...action.payload,
      };
      state.updatedAt = new Date().toISOString();
    },

    updateDeliveryField: (
      state,
      action: PayloadAction<{ field: keyof DeliveryInformation; value: string }>
    ) => {
      state.deliveryInfo[action.payload.field] = action.payload.value;
      state.updatedAt = new Date().toISOString();
    },

    // Location data actions
    setLocationData: (state, action: PayloadAction<LocationData | null>) => {
      state.locationData = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    updateLocationData: (state, action: PayloadAction<Partial<LocationData>>) => {
      state.locationData = {
        ...state.locationData,
        ...action.payload,
      } as LocationData;
      state.updatedAt = new Date().toISOString();
    },

    // Bulk update action for multiple fields at once
    updateCart: (state, action: PayloadAction<Partial<BookingCart>>) => {
      Object.assign(state, {
        ...action.payload,
        updatedAt: new Date().toISOString(),
      });
    },

    // Reset cart to initial state
    clearCart: (state) => {
      Object.assign(state, {
        ...initialState,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    },

    // Initialize cart with existing data
    initializeCart: (state, action: PayloadAction<Partial<BookingCart>>) => {
      Object.assign(state, {
        ...initialState,
        ...action.payload,
        createdAt: action.payload.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    },

    // Coupon code action
    setCouponCode: (state, action: PayloadAction<string | null>) => {
      state.couponCode = action.payload;
      state.updatedAt = new Date().toISOString();
    },
  },
});

export const {
  // Pricing breakdown
  setTotal,
  setBaseStorageCost,
  setRedeliveryFee,
  setClimateControlCost,
  setAddonsCost,
  setAddonsDeliveryCost,
  setProtectionPlanCost,
  setSavings,
  setPricingBreakdown,
  
  // Selections
  setPlan,
  setBundle,
  setDurationBins,
  setMonths,
  setBins,
  addAddon,
  removeAddon,
  toggleAddon,
  setAddons,
  setClimateControl,
  setProtectionPlan,
  
  // Delivery info
  setDeliveryInfo,
  updateDeliveryField,
  
  // Location data
  setLocationData,
  updateLocationData,
  
  // Bulk operations
  updateCart,
  clearCart,
  initializeCart,
  
  // Coupon
  setCouponCode,
} = cartSlice.actions;

export default cartSlice.reducer;

