"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { getBookingById, type Booking } from "@/lib/api/bookingService";
import Hero from "@/components/Hero";
import AuthLoadingView from "@/components/AuthLoadingView";
import toast from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import { getInvoiceById } from "@/lib/api/invoiceService";
import InvoicePDF from "@/components/invoice/InvoicePDF";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";
import BookingItemsList from "@/components/bookings/BookingItemsList";
import DeliveryInfoCard from "@/components/bookings/DeliveryInfoCard";
import PaymentSummaryCard from "@/components/bookings/PaymentSummaryCard";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, authHydrated, openAuthPopup } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bookingId = params.id as string;

  // Ensure we only fetch after mount (interceptors ready) and when we have a token (avoids 401 on hard refresh)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !authHydrated || !isAuthenticated || !bookingId) {
      if (!isAuthenticated || !bookingId) setLoading(false);
      return;
    }

    const loadBooking = async () => {
      try {
        setLoading(true);
        const bookingData = await getBookingById(bookingId);
        if (!bookingData) {
          toast.error("Booking not found");
          router.push("/bookings");
          return;
        }
        setBooking(bookingData);
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          toast.error("Please sign in to view this booking.");
          router.push("/bookings");
        } else {
          console.error("Error loading booking:", error);
          toast.error("Failed to load booking details. Please try again.");
          router.push("/bookings");
        }
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [mounted, authHydrated, isAuthenticated, bookingId, router]);

  const handleDownloadInvoice = async () => {
    if (!booking?.invoiceId) {
      toast.error("Invoice ID not found for this booking");
      return;
    }

    try {
      setIsDownloadingInvoice(true);

      // Fetch invoice data
      const invoice = await getInvoiceById(booking.invoiceId);

      if (!invoice) {
        toast.error("Invoice not found");
        return;
      }

      // Generate PDF
      const doc = <InvoicePDF invoice={invoice} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.id.slice(0, 8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!authHydrated) {
    return (
      <AuthLoadingView
        headline="Booking Details"
        bodyText="View your booking information"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <Hero
          backgroundImage="/products-1.png"
          headline="Booking Details"
          bodyText="View your booking information"
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
              Sign in to view booking details
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign in to access your booking information
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <Hero
          backgroundImage="/products-1.png"
          headline="Booking Details"
          bodyText="View your booking information"
          height="compact"
        />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <Hero
          backgroundImage="/products-1.png"
          headline="Booking Details"
          bodyText="View your booking information"
          height="compact"
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Booking not found
            </h2>
            <p className="text-gray-600 mb-8">
              The booking you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={() => router.push("/bookings")}
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-xl hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
            >
              Back to Bookings
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
        headline="Booking Details"
        bodyText={`Booking ${booking.bookingNumber}`}
        height="compact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push("/bookings")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Back to Bookings</span>
        </button>

        {/* Booking Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Booking {booking.bookingNumber}
              </h1>
              <p className="text-sm text-gray-500 mb-3">
                Created on {formatDate(booking.createdAt)}
              </p>
              <BookingStatusBadge
                status={booking.status}
                paymentStatus={booking.paymentStatus}
              />
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl sm:text-4xl font-bold text-[#f8992f]">
                ${booking.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Booking Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-[#f8992f]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Booking Items
              </h2>
              <BookingItemsList booking={booking} />
            </div>
          </div>

          {/* Right Column - Delivery & Payment */}
          <div className="space-y-6">
            <DeliveryInfoCard deliveryInfo={booking.deliveryInfo} />
            <PaymentSummaryCard booking={booking} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={() => router.push("/bookings")}
              className="px-6 py-3 text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Back to Bookings
            </button>
            {/* Track Pickup Button - Show for pickup workflow statuses */}
            {booking.orderStatus && 
             ["PICKUP_REQUEST", "PICKUP_CONFIRMED", "PICKUP_TIME_CONFIRMED", 
              "PICKUP_SCHEDULED", "PICKED_UP", "STORED"].includes(
                booking.orderStatus.toUpperCase()
              ) && (
              <button
                onClick={() => router.push(`/valet-storage/pickup/workflow?id=${booking.id}`)}
                className="px-6 py-3 text-base font-semibold text-blue-600 hover:text-blue-700 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
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
            {/* Track Delivery Button - Show for delivery workflow statuses */}
            {booking.orderStatus && 
             ["DELIVERY_REQUEST", "DELIVERY_REQUEST_CONFIRMED", 
              "DELIVERY_SCHEDULED", "DELIVERED"].includes(
                booking.orderStatus.toUpperCase()
              ) && (
              <button
                onClick={() => router.push(`/valet-storage/delivery/workflow?id=${booking.id}`)}
                className="px-6 py-3 text-base font-semibold text-green-600 hover:text-green-700 border-2 border-green-600 rounded-xl hover:bg-green-50 transition-all flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
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
            <button
              onClick={handleDownloadInvoice}
              disabled={isDownloadingInvoice || !booking.invoiceId}
              className="px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] hover:from-[#d8852a] hover:to-[#e88a25] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {isDownloadingInvoice ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Downloading...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
