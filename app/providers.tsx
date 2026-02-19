// app/providers.tsx
"use client";
import React, { useMemo, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, RootState } from "../store/store";
import { Toaster } from "react-hot-toast";
import AuthPopup from "@/components/AuthPopup";
import { getAccessToken, getRefreshToken, getUser, cleanupInvalidAuthData } from "@/lib/utils/tokenStorage";
import { setAuthData, setAuthHydrated } from "@/store/slices/authSlice";
import { setupAxiosInterceptors } from "@/lib/api/axiosInterceptor";
import { getUserCart } from "@/lib/api/cartService";
import { initializeCart } from "@/store/slices/cartSlice";

type Props = {
  readonly children: React.ReactNode;
  readonly preloadedState?: Partial<RootState>;
};

export default function Providers({ children, preloadedState }: Props) {
  // Track if cart has been loaded to prevent multiple loads
  const cartLoadedRef = useRef(false);
  const previousAuthStateRef = useRef<{ isAuthenticated: boolean; userId?: string }>({
    isAuthenticated: false,
  });

  // create store once per client render; preloadedState only used at initial render
  const store = useMemo(
    () => makeStore(preloadedState),
    [preloadedState]
  );

  // Initialize auth from localStorage and setup axios interceptors
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clean up any invalid data first
    cleanupInvalidAuthData();

    // Setup axios interceptors for automatic token refresh
    setupAxiosInterceptors(store);

    // Load auth data from localStorage
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const user = getUser();

    if (accessToken && refreshToken && user) {
      store.dispatch(setAuthData({
        accessToken,
        refreshToken,
        user,
      }));
    }
    store.dispatch(setAuthHydrated(true));
  }, [store]);

  // Load cart based on auth state (only on initial mount, and only if cart is empty)
  useEffect(() => {
    if (typeof window === "undefined" || cartLoadedRef.current) return;

    // Wait a bit for auth to initialize
    const timer = setTimeout(() => {
      const state = store.getState();
      const { user, accessToken } = state.auth;
      const isAuthenticated = !!user && !!accessToken;
      const currentCart = state.cart;

      // Check if cart already has meaningful data - if so, don't load from storage
      const hasCartData = currentCart.plan || currentCart.bundles || currentCart.addons.length > 0 || 
                         currentCart.deliveryInfo?.fullName || currentCart.deliveryInfo?.email ||
                         currentCart.durationBins.bins > 0;

      // Only load if cart is completely empty
      if (hasCartData) {
        cartLoadedRef.current = true;
        return;
      }

      const loadCart = async () => {
        try {
          if (isAuthenticated) {
            // Logged-in user: Load from API
            // Get pricing data from store to properly transform API response
            const pricingState = store.getState().pricing;
            const pricingData = pricingState.data;
            const serverCarts = await getUserCart(
              pricingData?.plans || [],
              pricingData?.bundles || [],
              pricingData?.addons || [],
              pricingData?.protection_plans || []
            );
            // Use the first cart if available and current cart is empty
            if (serverCarts.length > 0) {
              const serverCart = serverCarts[0];
              if (serverCart && (serverCart.plan || serverCart.bundles || serverCart.addons.length > 0)) {
                store.dispatch(initializeCart(serverCart));
              }
            }
          }
          // Guest users: Cart is not persisted, starts fresh each session
        } catch (error) {
          console.error("Failed to load cart:", error);
        } finally {
          cartLoadedRef.current = true;
        }
      };

      loadCart();
    }, 100);

    return () => clearTimeout(timer);
  }, [store]);

  // Handle cart sync when user logs in
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Subscribe to store changes to detect auth state changes
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const { user, accessToken } = state.auth;
      const isAuthenticated = !!user && !!accessToken;
      const currentUserId = user?.id;

      const previousAuthState = previousAuthStateRef.current;
      const wasAuthenticated = previousAuthState.isAuthenticated;

      // If user just logged in (transition from guest to authenticated)
      if (!wasAuthenticated && isAuthenticated) {
        const syncCartOnLogin = async () => {
          try {
            // Get server cart from API
            // Get pricing data from store to properly transform API response
            const pricingState = store.getState().pricing;
            const pricingData = pricingState.data;
            const serverCarts = await getUserCart(
              pricingData?.plans || [],
              pricingData?.bundles || [],
              pricingData?.addons || [],
              pricingData?.protection_plans || []
            );

            // Use the first cart if available
            if (serverCarts.length > 0) {
              const serverCart = serverCarts[0];
              // Load server cart if it has data
              if (serverCart && (serverCart.plan || serverCart.bundles || serverCart.addons.length > 0)) {
                store.dispatch(initializeCart(serverCart));
              }
            }
          } catch (error) {
            console.error("Failed to sync cart on login:", error);
          }
        };

        syncCartOnLogin();
      }

      // Update previous auth state
      previousAuthStateRef.current = {
        isAuthenticated,
        userId: currentUserId,
      };
    });

    return () => {
      unsubscribe();
    };
  }, [store]);

  return (
    <Provider store={store}>
      {children}
      <AuthPopup />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#4c4946",
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #fecaca",
              background: "#fef2f2",
            },
          },
        }}
      />
    </Provider>
  );
}
