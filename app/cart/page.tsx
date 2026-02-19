// app/cart/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useAuth } from "@/lib/hooks/useAuth";
import Hero from "@/components/Hero";
import AuthLoadingView from "@/components/AuthLoadingView";
import Link from "next/link";
import toast from "react-hot-toast";
import { getUserCart, removeCartItem } from "@/lib/api/cartService";
import { initializeCart } from "@/store/slices/cartSlice";
import type { BookingCart } from "@/store/slices/cartSlice";
import CartDetailsModal from "@/components/CartDetailsModal";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, authHydrated } = useAuth();
  const pricingData = useAppSelector((state) => state.pricing.data);
  const cartLoadedRef = useRef(false);
  const [carts, setCarts] = useState<BookingCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState<BookingCart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingCartId, setDeletingCartId] = useState<string | number | null>(null);
  const [cartToDelete, setCartToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [processingPaymentCartItemId, setProcessingPaymentCartItemId] = useState<string | null>(null);

  // Load all carts from API when page loads (for authenticated users; wait for auth to hydrate first)
  useEffect(() => {
    if (
      globalThis.window === undefined ||
      cartLoadedRef.current ||
      !authHydrated ||
      !isAuthenticated
    ) {
      setLoading(false);
      return;
    }

    const loadCarts = async () => {
      try {
        setLoading(true);
        // Get pricing data from store to properly transform API response
        const allCarts = await getUserCart(
          pricingData?.plans || [],
          pricingData?.bundles || [],
          pricingData?.addons || [],
          pricingData?.protection_plans || []
        );

        setCarts(allCarts);
      } catch {
        toast.error("Failed to load carts");
      } finally {
        setLoading(false);
        cartLoadedRef.current = true;
      }
    };

    loadCarts();
  }, [authHydrated, isAuthenticated, pricingData]);

  const handlePayNow = async (cart: BookingCart) => {
    // Check if cart has a cartId
    if (!cart.cartId) {
      toast.error("Cart ID is missing. Please try again.");
      return;
    }

    // Use cartItemId if available, otherwise fall back to cartId
    // This ensures each cart item button shows loading independently
    const uniqueId = cart.cartItemId || cart.cartId;

    // Prevent multiple clicks on the same cart item
    if (processingPaymentCartItemId === uniqueId) {
      return;
    }

    try {
      // Set loading state for this specific cart item
      setProcessingPaymentCartItemId(uniqueId);

      // Set this cart as the active cart in Redux
      dispatch(initializeCart(cart));
      
      // Build payment URL with cartId and optional cartItemId
      // If cartItemId exists, pass it as query param to checkout specific item
      // Otherwise, all items in the cart will be checked out
      let paymentUrl = `/payment/${cart.cartId}`;
      if (cart.cartItemId) {
        paymentUrl += `?cartItemId=${cart.cartItemId}`;
      }
      
      // Redirect to payment page
      // Loading state will show during navigation transition
      router.push(paymentUrl);
    } catch (error) {
      console.error("Error navigating to payment:", error);
      toast.error("Failed to proceed to payment. Please try again.");
      setProcessingPaymentCartItemId(null);
    }
    // Note: We don't reset processingPaymentCartItemId on success because navigation happens
    // The state will be reset when component unmounts or user navigates back
  };

  const handleViewDetails = (cart: BookingCart) => {
    setSelectedCart(cart);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCart(null);
  };

  const handleDeleteClick = (cartItemId: string) => {
    setCartToDelete(cartItemId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCartToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!cartToDelete) return;

    try {
      setDeletingCartId(cartToDelete);
      setIsDeleteModalOpen(false);
      
      const success = await removeCartItem(cartToDelete);
      
      if (success) {
        // Remove cart item from local state
        setCarts((prevCarts) => 
          prevCarts.filter((cart) => cart.cartItemId !== cartToDelete)
        );
        toast.success("Cart item deleted successfully");
      } else {
        toast.error("Failed to delete cart item");
      }
    } catch {
      toast.error("Failed to delete cart item");
    } finally {
      setDeletingCartId(null);
      setCartToDelete(null);
    }
  };

  // Handle Escape key for delete modal
  useEffect(() => {
    if (!isDeleteModalOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDeleteModalOpen(false);
        setCartToDelete(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDeleteModalOpen]);

  // Prevent body scroll when delete modal is open
  useEffect(() => {
    if (isDeleteModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDeleteModalOpen]);

  // Reset payment processing state after navigation or timeout
  useEffect(() => {
    if (processingPaymentCartItemId) {
      // Reset after 3 seconds if navigation didn't happen (safety timeout)
      const timeout = setTimeout(() => {
        setProcessingPaymentCartItemId(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [processingPaymentCartItemId]);

  // Check if carts array is empty
  const isCartEmpty = carts.length === 0;

  if (!authHydrated) {
    return (
      <AuthLoadingView
        headline="Your Cart"
        bodyText="Review your storage booking details"
        backgroundImage="/cart_image.jpg"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
      <Hero
        backgroundImage="/cart_image.jpg"
        headline="Your Cart"
        bodyText="Review your storage booking details"
        height="compact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading && (
          // Loading State
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your carts...</p>
          </div>
        )}
        {!loading && isCartEmpty && (
          // Empty Cart State
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding storage plans and services to your cart
            </p>
            <Link
              href="/pricing"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-xl hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
            >
              Browse Storage Plans
            </Link>
          </div>
        )}
        {!loading && !isCartEmpty && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#4c4946]">
                Cart Items ({carts.length})
              </h2>
            </div>

            {/* Row-based Cart List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Table Header - Desktop Only */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="col-span-5">
                  <span className="text-sm font-semibold text-gray-700">Item Details</span>
                </div>
                <div className="col-span-3">
                  <span className="text-sm font-semibold text-gray-700">Additional Info</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-sm font-semibold text-gray-700">Price</span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm font-semibold text-gray-700">Actions</span>
                </div>
              </div>

              {/* Cart Items - Row Format */}
              <div className="divide-y divide-gray-200">
                {carts.map((cart, index) => (
                  <div
                    key={cart.cartItemId || `${cart.cartId}-${index}` || `cart-item-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-6 py-4 sm:py-6">
                      {/* Item Details Section */}
                      <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4">
                        {/* Icon/Image */}
                        <div className="flex-shrink-0">
                          {(() => {
                          if (cart.bundles) {
                            return (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#ea9637] to-[#FB9A2D] flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-md">
                                {cart.bundles.bundle_name.charAt(0)}
                              </div>
                            );
                          }
                          if (cart.plan) {
                            return (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#ea9637] to-[#FB9A2D] flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-md">
                                {cart.plan.plan_name.charAt(0)}
                              </div>
                            );
                          }
                          return (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          );
                        })()}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                                {cart.bundles?.bundle_name || cart.plan?.plan_name || "No plan selected"}
                              </h3>
                              {cart.plan && cart.durationBins.months && cart.durationBins.bins > 0 && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {cart.durationBins.bins} bins × {cart.durationBins.months}{" "}
                                  {cart.durationBins.months === 1 ? "month" : "months"}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-[#f8992f] mb-2">
                                Base: ${cart.baseStorageCost.toFixed(2)}
                              </p>
                            </div>
                            {/* Mobile Delete Button */}
                            <button
                              onClick={() => cart.cartItemId && handleDeleteClick(cart.cartItemId)}
                              disabled={!cart.cartItemId || deletingCartId === cart.cartItemId}
                              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Delete cart item"
                            >
                              {deletingCartId === cart.cartItemId ? (
                                <svg
                                  className="w-5 h-5 text-gray-400 animate-spin"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5 text-gray-500 hover:text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info Section */}
                      <div className="lg:col-span-3 flex flex-col gap-2 text-sm">
                        {cart.addons.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Add-ons:</span>
                            <span className="font-medium text-gray-900">
                              {cart.addons.length} item{cart.addons.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                        {cart.climateControl && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Climate Control:</span>
                            <span className="font-medium text-green-600">Yes</span>
                          </div>
                        )}
                        {cart.protectionPlan && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Protection:</span>
                            <span className="font-medium text-gray-900 truncate">
                              {cart.protectionPlan.name}
                            </span>
                          </div>
                        )}
                        {cart.deliveryInfo.fullName && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Delivery:</span>
                            <span className="font-medium text-gray-900">Configured</span>
                          </div>
                        )}
                        {cart.savings > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 font-semibold">Savings:</span>
                            <span className="font-bold text-green-600">
                              ${cart.savings.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {!cart.addons.length && !cart.climateControl && !cart.protectionPlan && !cart.deliveryInfo.fullName && cart.savings === 0 && (
                          <span className="text-gray-400 text-xs">No additional items</span>
                        )}
                      </div>

                      {/* Price Section */}
                      <div className="lg:col-span-2 flex flex-col items-start sm:items-center lg:items-center justify-center">
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                          <p className="text-xl sm:text-2xl font-bold text-[#f8992f]">
                            ${cart.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="lg:col-span-2 flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-2 justify-center">
                        <button
                          onClick={() => handlePayNow(cart)}
                          disabled={!cart.cartId || processingPaymentCartItemId === (cart.cartItemId || cart.cartId)}
                          className="w-full sm:w-auto lg:w-full px-4 py-2.5 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg hover:from-[#d8852a] hover:to-[#e88a25] transition-all text-sm shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {processingPaymentCartItemId === (cart.cartItemId || cart.cartId) ? (
                            <>
                              <svg
                                className="w-4 h-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Processing...
                            </>
                          ) : (
                            "Pay Now"
                          )}
                        </button>
                        <button
                          onClick={() => handleViewDetails(cart)}
                          className="w-full sm:w-auto lg:w-full px-4 py-2.5 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          View Details
                        </button>
                        {/* Desktop Delete Button */}
                        <button
                          onClick={() => cart.cartItemId && handleDeleteClick(cart.cartItemId)}
                          disabled={!cart.cartItemId || deletingCartId === cart.cartItemId}
                          className="hidden lg:block w-full px-4 py-2.5 text-red-600 bg-red-50 font-semibold rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Delete cart item"
                        >
                          {deletingCartId === cart.cartItemId ? "Deleting..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Cart Details Modal */}
        <CartDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          cart={selectedCart}
        />

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <button
              type="button"
              className="fixed inset-0 bg-black opacity-50 transition-opacity cursor-default w-full h-full"
              onClick={handleCloseDeleteModal}
              aria-label="Close modal"
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
              <div
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
                aria-labelledby="delete-modal-title"
              >
                {/* Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Delete Cart
                    </h3>
                    <p className="text-sm text-gray-500">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                {/* Message */}
                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete this cart item? This action cannot be undone.
                  cart will be permanently removed.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseDeleteModal}
                    disabled={deletingCartId !== null}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deletingCartId !== null}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingCartId ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
