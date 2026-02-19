"use client";

import { useEffect, useState, Suspense, useRef, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api/authService";

interface PaymentStatusData {
  sessionId: string;
  stripePaymentStatus: string;
  stripeSessionStatus: string;
  stripePaymentIntentId: string;
  stripeInvoiceId: string;
  bookingId: string;
  bookingStatus: string;
  paymentStatus: string;
}

interface PaymentStatusResponse {
  message: string;
  success: boolean;
  data: PaymentStatusData | null;
}

// Helper function to convert string to title case
const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  const sessionId = searchParams.get("session_id");
  const paymentIntent = searchParams.get("payment_intent");

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [mounted, setMounted] = useState(false);
  const redirectInitiated = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch payment status from API
  useEffect(() => {
    if (!mounted) return;

    const fetchPaymentStatus = async () => {
      // Need either sessionId or paymentIntent to check status
      if (!sessionId && !paymentIntent) {
        setError("Missing payment session information");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Call payment-status API with sessionId or paymentIntentId
        let queryParam: string;
        if (sessionId) {
          queryParam = "session_id=" + encodeURIComponent(sessionId);
        } else {
          queryParam = "paymentIntentId=" + encodeURIComponent(paymentIntent || "");
        }
        const response = await apiClient.get<PaymentStatusResponse>(
          `/payment-status?${queryParam}`
        );

        if (response.data.success && response.data.data) {
          setPaymentStatus(response.data.data);
        } else {
          setError(response.data.message || "Failed to retrieve payment status");
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as { message?: string })?.message ||
          "Failed to check payment status";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [mounted, sessionId, paymentIntent]);

  // Determine if payment was successful based on API response
  const isSuccess =
    paymentStatus?.paymentStatus === "PAID" ||
    paymentStatus?.stripePaymentStatus === "paid" ||
    paymentStatus?.stripeSessionStatus === "complete";

  // Handle countdown timer
  useEffect(() => {
    if (!isSuccess || !mounted || loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, mounted, loading]);

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (isSuccess && mounted && !loading && countdown === 0 && !redirectInitiated.current) {
      redirectInitiated.current = true;
      // Use setTimeout to defer router.push to next tick, avoiding React warning
      // This ensures navigation happens after the current render cycle
      setTimeout(() => {
        startTransition(() => {
          router.push("/bookings");
        });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, mounted, loading, countdown]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

  // Show error state if API call failed
  if (error || paymentStatus === null) {
    return (
      <div className="bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-[#4c4946] mb-4">
              Unable to Verify Payment
            </h1>

            <p className="text-gray-600 mb-6">
              {error || "We could not verify your payment status. Please try again or contact support if the problem persists."}
            </p>

            {cartId ? (
              <button
                onClick={() => router.push(`/payment/${cartId}`)}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
              >
                Retry Payment
              </button>
            ) : (
              <button
                onClick={() => router.push("/cart")}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
              >
                Return to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {isSuccess ? (
            <>
              {/* Success State */}
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-[#4c4946] mb-4">
                Your payment has been successful
              </h1>

              {paymentStatus.bookingId && (
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Booking ID</p>
                  <div className="text-lg font-semibold text-[#4c4946]">
                    {paymentStatus.bookingId}
                  </div>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-semibold mb-2">
                  Redirecting to your bookings...
                </p>
                <p className="text-sm text-green-700">
                  You will be redirected in {countdown} second
                  {countdown !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={() => {
                  router.push("/bookings");
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
              >
                Go to Bookings Now
              </button>
            </>
          ) : (
            <>
              {/* Failure State */}
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-[#4c4946] mb-4">
                Payment Failed
              </h1>

              <p className="text-gray-600 mb-6">
                We could not process your payment. Please try again or
                contact support if the problem persists.
              </p>

              {paymentStatus.bookingId && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Payment Status: <span className="font-semibold">{toTitleCase(paymentStatus.paymentStatus)}</span></p>
                  <p className="text-sm text-gray-600">Stripe Status: <span className="font-semibold">{toTitleCase(paymentStatus.stripePaymentStatus)}</span></p>
                </div>
              )}

              {cartId ? (
                <button
                  onClick={() => {
                    router.push(`/payment/${cartId}`);
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
                >
                  Retry Payment
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/cart");
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
                >
                  Return to Cart
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPageContent() {
  return (
    <Suspense
      fallback={
        <div className="bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment status...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

