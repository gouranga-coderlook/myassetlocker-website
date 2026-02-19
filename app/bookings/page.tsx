"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserBookings, type Booking } from "@/lib/api/bookingService";
import Hero from "@/components/Hero";
import AuthLoadingView from "@/components/AuthLoadingView";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, authHydrated, openAuthPopup } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewingDetailsId, setViewingDetailsId] = useState<string | null>(null);
  const pageSize = 10;

  const loadBookings = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await getUserBookings(page, pageSize);
      setBookings(response.bookings);
      setTotal(response.total);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, page, pageSize]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    loadBookings();
  }, [isAuthenticated, page, loadBookings]);

  const getOrderStatusColor = (orderStatus: string | undefined) => {
    if (!orderStatus) return "bg-gray-100 text-gray-800";

    const normalizedStatus = orderStatus.toUpperCase();

    // Delivered - Green
    if (normalizedStatus === "DELIVERED") {
      return "bg-green-100 text-green-800";
    }

    // Confirmed/Stored - Purple
    if (
      normalizedStatus === "PICKUP_CONFIRMED" ||
      normalizedStatus === "STORED" ||
      normalizedStatus === "DELIVERY_REQUEST_CONFIRMED"
    ) {
      return "bg-purple-100 text-purple-800";
    }

    // In Progress - Blue
    if (
      normalizedStatus === "PICKUP_SCHEDULED" ||
      normalizedStatus === "PICKED_UP" ||
      normalizedStatus === "DELIVERY_SCHEDULED"
    ) {
      return "bg-blue-100 text-blue-800";
    }

    // Requested - Yellow
    if (
      normalizedStatus === "PICKUP_REQUEST" ||
      normalizedStatus === "DELIVERY_REQUEST"
    ) {
      return "bg-yellow-100 text-yellow-800";
    }

    // Draft - Gray
    if (normalizedStatus === "DRAFT") {
      return "bg-gray-100 text-gray-800";
    }

    // Default - Blue
    return "bg-blue-100 text-blue-800";
  };

  const formatOrderStatus = (orderStatus: string | undefined) => {
    if (!orderStatus) return "";

    // Convert underscore-separated to space-separated and capitalize each word
    return orderStatus
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = async (booking: Booking) => {
    if (viewingDetailsId) return; // Prevent multiple clicks

    try {
      setViewingDetailsId(booking.id);
      router.push(`/bookings/${booking.id}`);

      // Reset loading state after navigation (safety timeout)
      // If navigation succeeds, component will unmount, so this won't matter
      setTimeout(() => {
        setViewingDetailsId(null);
      }, 3000);
    } catch (error) {
      console.error("Error navigating to booking details:", error);
      setViewingDetailsId(null);
    }
  };

  const handleDownloadInvoice = (booking: Booking) => {
    router.push(`/invoices/${booking.invoiceId}`);
  };

  // Show loading until auth has been restored from storage to avoid flash of sign-in prompt
  if (!authHydrated) {
    return (
      <AuthLoadingView
        headline="My Bookings"
        bodyText="View and manage your storage bookings"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <Hero
          backgroundImage="/products-1.png"
          headline="My Bookings"
          bodyText="View and manage your storage bookings"
          height="compact"
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign in to view your bookings
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign in to access your booking history
            </p>
            <button
              onClick={openAuthPopup}
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-xl hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
      <Hero
        backgroundImage="/products-1.png"
        headline="My Bookings"
        bodyText="View and manage your storage bookings"
        height="compact"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No bookings found
            </h2>
            <p className="text-gray-600 mb-8">
              You haven&apos;t placed any bookings yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-[#4c4946]">
                        {booking.bookingNumber}
                      </h3>
                      {/* <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span> */}
                      {booking.paymentStatus && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                          {booking.paymentStatus}
                        </span>
                      )}
                      {booking.orderStatus && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(
                            booking.orderStatus
                          )}`}
                        >
                          {formatOrderStatus(booking.orderStatus)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span>
                        <span className="font-semibold">Placed:</span>{" "}
                        {formatDate(booking.createdAt)}
                      </span>
                      <span>
                        <span className="font-semibold">Items:</span>{" "}
                        {booking.items.length}
                      </span>
                      <span>
                        <span className="font-semibold">Total:</span>{" "}
                        <span className="font-bold text-[#f8992f]">
                          ${booking.total.toFixed(2)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Only show action buttons if status is NOT DELIVERED */}
                    {booking.orderStatus?.toUpperCase() !== "DELIVERED" && (
                      <>
                        {/* Request Pickup Button - Show only when orderStatus is draft */}
                        {booking.orderStatus?.toLowerCase() === "draft" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/valet-storage/pickup?bookingId=${booking.id}`);
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] hover:from-[#d8852a] hover:to-[#e88a25] rounded-lg transition-all whitespace-nowrap flex items-center gap-2 shadow-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                              />
                            </svg>
                            Request Pickup
                          </button>
                        )}
                        {/* View Workflow Button - Show for pickup workflow statuses */}
                        {booking.orderStatus &&
                          ["PICKUP_SCHEDULED", "PICKED_UP"].includes(
                            booking.orderStatus.toUpperCase()
                          ) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/valet-storage/pickup/workflow?id=${booking.id}`);
                              }}
                              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap flex items-center gap-2"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                              </svg>
                              Track Pickup
                            </button>
                          )}
                        {/* Request for Redelivery Button - Show when orderStatus is STORED */}
                        {booking.orderStatus?.toUpperCase() === "STORED" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/valet-storage/redelivery?bookingId=${booking.id}`);
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] hover:from-[#d8852a] hover:to-[#e88a25] rounded-lg transition-all whitespace-nowrap flex items-center gap-2 shadow-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                            Request Redelivery
                          </button>
                        )}
                        {/* Track Delivery Button - Show after admin confirms (not for DELIVERY_REQUEST or DELIVERED) */}
                        {booking.orderStatus &&
                          ["DELIVERY_REQUEST_CONFIRMED",
                            "DELIVERY_SCHEDULED"].includes(
                              booking.orderStatus.toUpperCase()
                            ) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/valet-storage/delivery/workflow?id=${booking.id}`);
                              }}
                              className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition-colors whitespace-nowrap flex items-center gap-2"
                            >
                              <svg
                                className="w-4 h-4"
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
                              Track Delivery
                            </button>
                          )}
                      </>
                    )}
                    {/* View Invoice - Always available */}
                    <button
                      onClick={() => handleDownloadInvoice(booking)}
                      className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 rounded-lg hover:bg-[#f8992f]/5 transition-colors whitespace-nowrap"
                    >
                      View Invoice
                    </button>
                    {/* View Details - Always available */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(booking);
                      }}
                      disabled={viewingDetailsId === booking.id || viewingDetailsId !== null}
                      className="px-4 py-2 text-sm font-medium text-[#f8992f] hover:text-[#d8852a] border border-[#f8992f] rounded-lg hover:bg-[#f8992f]/5 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {viewingDetailsId === booking.id ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        "View Details"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {total > pageSize && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
