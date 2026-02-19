"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import Hero from "@/components/Hero";
import toast from "react-hot-toast";
import { getUserCart } from "@/lib/api/cartService";
import type { BookingCart } from "@/store/slices/cartSlice";
import { createCheckoutSession } from "@/lib/api/bookingService";

export default function PaymentPage({ params }: Readonly<{ params: Promise<{ cartId: string }> }>) {
  const { cartId } = use(params);
  const searchParams = useSearchParams();
  const cartItemId = searchParams?.get("cartItemId") || null;
  const pricingData = useAppSelector((state) => state.pricing.data);
  const reduxCart = useAppSelector((state) => state.cart);
  const [cart, setCart] = useState<BookingCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const [checkoutAttempted, setCheckoutAttempted] = useState(false); // Track if checkout has been attempted
  const [checkoutError, setCheckoutError] = useState<string | null>(null); // Track checkout errors

  // Load cart data
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        // Check if cart is already in Redux and matches the cartId
        if (reduxCart.cartId === cartId && reduxCart.total > 0) {
          setCart(reduxCart);
          setLoading(false);
          return;
        }

        // Otherwise, fetch from API
        const allCarts = await getUserCart(
          pricingData?.plans || [],
          pricingData?.bundles || [],
          pricingData?.addons || [],
          pricingData?.protection_plans || []
        );

        const foundCart = allCarts.find((c) => c.cartId === cartId);
        if (foundCart) {
          setCart(foundCart);
        } else {
          toast.error("Cart not found");
        }
      } catch {
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [cartId, reduxCart, pricingData]);

  // Create checkout session and redirect
  useEffect(() => {
    const createCheckout = async () => {
      // Prevent multiple attempts or retries
      if (!cart || cart.total <= 0 || creatingCheckout || checkoutAttempted) {
        return;
      }

      setCreatingCheckout(true);
      setCheckoutAttempted(true); // Mark as attempted to prevent retries

      try {
        // Build request with cartId and REQUIRED cartItemIds
        // When coming from "Complete Booking", always use the newly added cart item
        // Priority: 1) query param cartItemId, 2) cart.cartItemId (from Redux - newly added), 3) fetch all items and use the most recent
        let itemIdToCheckout: string | null = null;
        
        if (cartItemId) {
          // If cartItemId is provided via query param, use it
          itemIdToCheckout = cartItemId;
        } else if (cart.cartItemId) {
          // Use cartItemId from cart object (this is the newly added item from Complete Booking)
          itemIdToCheckout = cart.cartItemId;
        } else {
          // Fallback: fetch all cart items and use the most recent one
          // This handles the case where cart was loaded from API but cartItemId is missing
          try {
            const allCarts = await getUserCart(
              pricingData?.plans || [],
              pricingData?.bundles || [],
              pricingData?.addons || [],
              pricingData?.protection_plans || []
            );
            const cartItemsForThisCart = allCarts.filter((c) => c.cartId === cartId);
            if (cartItemsForThisCart.length > 0) {
              // Use the most recently added item (last in array or by createdAt)
              const mostRecent = cartItemsForThisCart.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA; // Most recent first
              })[0];
              itemIdToCheckout = mostRecent.cartItemId || null;
            }
          } catch (error) {
            console.error("Failed to fetch cart items for checkout:", error);
          }
        }
        
        // Validate that we have a cartItemId (required by backend)
        if (!itemIdToCheckout) {
          throw new Error("No cart item found to checkout. Please ensure your cart has items.");
        }
        
        const request: { cartId: string; cartItemIds: string[] } = {
          cartId: cartId,
          cartItemIds: [itemIdToCheckout], // Always send the newly added cart item
        };
        
        const response = await createCheckoutSession(request);

        if (response.success && response.data?.checkoutUrl) {
          // Redirect to Stripe Checkout
          if (globalThis.window !== undefined) {
            globalThis.window.location.href = response.data.checkoutUrl;
          }
          // Don't set creatingCheckout to false here since we're redirecting
        } else {
          const errorMsg = response.message || "Failed to create checkout session";
          toast.error(errorMsg);
          setCheckoutError(errorMsg);
          setCreatingCheckout(false);
        }
      } catch (error: unknown) {
        const errorMsg =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (error as { message?: string })?.message ||
          "Failed to create checkout session";
        toast.error(errorMsg);
        setCheckoutError(errorMsg);
        setCreatingCheckout(false);
      }
    };

    // Only create checkout when cart is loaded and hasn't been attempted yet
    if (cart && !loading && !checkoutAttempted) {
      createCheckout();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, cartId, cartItemId, loading]);

  if (loading || creatingCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? "Loading payment details..." : "Creating checkout session..."}
          </p>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Cart not found</p>
          <p className="text-gray-600">Please try again or contact support.</p>
        </div>
      </div>
    );
  }

  // Show error state if checkout failed
  if (checkoutError && !creatingCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <Hero
          backgroundImage="/cart_image.jpg"
          headline="Payment Error"
          bodyText="Unable to create checkout session"
          height="compact"
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#4c4946] mb-4">Checkout Failed</h2>
              <p className="text-gray-700 mb-6">{checkoutError}</p>
              <button
                onClick={() => {
                  setCheckoutAttempted(false);
                  setCheckoutError(null);
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg hover:from-[#d8852a] hover:to-[#e88a25] transition-all shadow-sm hover:shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const amount = cart.total;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
      <Hero
        backgroundImage="/cart_image.jpg"
        headline="Complete Your Payment"
        bodyText="Secure checkout for your storage booking"
        height="compact"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Payment Summary */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#4c4946] mb-4">
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  ${cart.baseStorageCost.toFixed(2)}
                </span>
              </div>
              {cart.addonsCost > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Add-ons:</span>
                  <span className="font-semibold">
                    ${cart.addonsCost.toFixed(2)}
                  </span>
                </div>
              )}
              {cart.protectionPlanCost > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Protection Plan:</span>
                  <span className="font-semibold">
                    ${cart.protectionPlanCost.toFixed(2)}
                  </span>
                </div>
              )}
              {cart.climateControlCost > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Climate Control:</span>
                  <span className="font-semibold">
                    ${cart.climateControlCost.toFixed(2)}
                  </span>
                </div>
              )}
              {cart.savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Savings:</span>
                  <span className="font-semibold">
                    -${cart.savings.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-[#4c4946] pt-3 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-2xl text-[#f8992f]">
                  ${amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
