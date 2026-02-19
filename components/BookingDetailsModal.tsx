// components/BookingDetailsModal.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pdf } from "@react-pdf/renderer";
import toast from "react-hot-toast";
import type { Booking } from "@/lib/api/bookingService";
import { getInvoiceById } from "@/lib/api/invoiceService";
import InvoicePDF from "@/components/invoice/InvoicePDF";

interface BookingDetailsModalProps {
  readonly booking: Booking | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

  if (!booking) return null;

  const handleDownloadInvoice = async () => {
    if (!booking.invoiceId) {
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

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-5xl mx-4 max-h-[95vh] bg-white rounded-xl shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] px-4 py-2 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Booking Details
                </h2>
                <p className="text-white/90 text-xs">{booking.bookingNumber}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-1.5 hover:bg-white/10 rounded"
                aria-label="Close modal"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content - Compact layout */}
            <div className="flex-1 overflow-hidden p-3">
              <div className="h-full grid grid-cols-12 gap-3">
                {/* Left Column - Booking Info & Items */}
                <div className="col-span-12 lg:col-span-7 flex flex-col h-full overflow-hidden">
                  {/* Status & Total - Compact Header */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-semibold capitalize ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      {booking.paymentStatus && (
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                          {booking.paymentStatus}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#f8992f]">
                        ${booking.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Booking Items - Scrollable if needed */}
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <h3 className="text-xs font-bold text-gray-900 mb-1 flex-shrink-0">
                      Booking Details
                    </h3>
                    <div className="space-y-2 pr-1">
                      {/* Bundle Section - Show prominently if exists */}
                      {booking.bundle && (
                        <div className="bg-gradient-to-r from-[#ea9637]/10 to-[#FB9A2D]/10 rounded-lg p-2 border border-[#ea9637]/20">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {booking.bundle.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 truncate">
                                {booking.bundle.name}
                              </h4>
                              {booking.bundle.description && (
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                  {booking.bundle.description}
                                </p>
                              )}
                            </div>
                          </div>
                          {(booking.bundle.fromMonth ||
                            booking.bundle.toMonth) && (
                            <p className="text-xs text-gray-600 mt-1">
                              {booking.bundle.fromMonth &&
                              booking.bundle.toMonth
                                ? `${booking.bundle.fromMonth} - ${booking.bundle.toMonth}`
                                : booking.bundle.fromMonth ||
                                  booking.bundle.toMonth}
                              {booking.bundle.months &&
                                booking.bundle.months > 0 &&
                                ` (${booking.bundle.months} ${
                                  booking.bundle.months === 1
                                    ? "month"
                                    : "months"
                                })`}
                            </p>
                          )}
                          {booking.bundle.extras && (
                            <p className="text-xs text-gray-600 mt-1">
                              {booking.bundle.extras}
                            </p>
                          )}
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#ea9637]/20">
                            <span className="text-xs font-semibold text-gray-700">
                              Bundle Price:
                            </span>
                            <span className="text-sm font-bold text-[#f8992f]">
                              ${booking.bundle.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Plan Section - Show if no bundle */}
                      {booking.plan && !booking.bundle && (
                        <div className="bg-gradient-to-r from-[#ea9637]/10 to-[#FB9A2D]/10 rounded-lg p-2 border border-[#ea9637]/20">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {booking.plan.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 truncate">
                                {booking.plan.name}
                              </h4>
                              {booking.plan.details && (
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                  {booking.plan.details}
                                </p>
                              )}
                            </div>
                          </div>
                          {booking.plan.durationBins &&
                            booking.plan.durationBins > 0 &&
                            booking.plan.durationMonths &&
                            booking.plan.durationMonths > 0 && (
                              <p className="text-xs text-gray-600 mt-1">
                                {booking.plan.durationBins} bins ×{" "}
                                {booking.plan.durationMonths}{" "}
                                {booking.plan.durationMonths === 1
                                  ? "month"
                                  : "months"}
                              </p>
                            )}
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#ea9637]/20">
                            <span className="text-xs font-semibold text-gray-700">
                              Plan Price:
                            </span>
                            <span className="text-sm font-bold text-[#f8992f]">
                              ${booking.plan.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Other Items (Addons, Protection Plan) - Filter out bundle and plan */}
                      {booking.items
                        .filter(
                          (item) =>
                            item.type !== "bundle" && item.type !== "plan"
                        )
                        .map((item) => {
                          // Check if this is a monthly recurring addon
                          const isMonthlyAddon =
                            item.type === "addon" &&
                            booking.plan?.durationMonths &&
                            booking.plan.durationMonths > 0;
                          const unitPrice =
                            isMonthlyAddon && item.quantity > 0
                              ? item.price /
                                (item.quantity *
                                  (booking.plan?.durationMonths || 1))
                              : item.price / (item.quantity || 1);

                          return (
                            <div
                              key={item.id}
                              className="bg-gray-50 rounded p-1.5 border border-gray-200"
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <h4 className="text-xs font-semibold text-gray-900 truncate">
                                      {item.name}
                                    </h4>
                                    <span className="px-1 py-0.5 bg-white rounded text-xs font-medium text-gray-600 capitalize flex-shrink-0">
                                      {item.type}
                                    </span>
                                  </div>
                                  {item.description && (
                                    <p className="text-xs text-gray-600 mb-0.5 line-clamp-1">
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    {isMonthlyAddon &&
                                    booking.plan?.durationMonths ? (
                                      <>
                                        <span>Qty: {item.quantity}</span>
                                        <span>
                                          ${unitPrice.toFixed(2)}/month
                                        </span>
                                        <span>
                                          × {booking.plan.durationMonths} months
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span>Qty: {item.quantity}</span>
                                        <span>${unitPrice.toFixed(2)}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xs font-bold text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Right Column - Delivery & Payment */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-2 h-full overflow-hidden">
                  {/* Delivery Information */}
                  <div className="flex-1 min-h-0 flex flex-col">
                    <h3 className="text-xs font-bold text-gray-900 mb-1 flex-shrink-0">
                      Delivery Information
                    </h3>
                    <div className="bg-gray-50 rounded p-2 border border-gray-200 flex-1 overflow-y-auto">
                      <div className="space-y-1 text-xs">
                        <p className="text-gray-900">
                          <span className="font-semibold">Name:</span>{" "}
                          {booking.deliveryInfo.fullName}
                        </p>
                        <p className="text-gray-900">
                          <span className="font-semibold">Email:</span>{" "}
                          {booking.deliveryInfo.email}
                        </p>
                        <p className="text-gray-900">
                          <span className="font-semibold">Phone:</span>{" "}
                          {booking.deliveryInfo.phone}
                        </p>
                        <div className="pt-1 border-t border-gray-200 mt-1">
                          <p className="text-gray-900 font-semibold mb-0.5 text-xs">
                            Address:
                          </p>
                          <p className="text-gray-600 text-xs">
                            {booking.deliveryInfo.address}
                            <br />
                            {booking.deliveryInfo.city},{" "}
                            {booking.deliveryInfo.state}{" "}
                            {booking.deliveryInfo.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Summary */}
                  <div className="flex-1 min-h-0 flex flex-col">
                    <h3 className="text-xs font-bold text-gray-900 mb-1 flex-shrink-0">
                      Payment & Summary
                    </h3>
                    <div className="bg-gray-50 rounded p-2 border border-gray-200 flex-1 flex flex-col">
                      {booking.paymentMethod && (
                        <div className="mb-1.5 pb-1.5 border-b border-gray-200 flex-shrink-0">
                          <p className="text-xs text-gray-600 mb-0.5">
                            Payment Method
                          </p>
                          <p className="text-xs font-semibold text-gray-900">
                            {booking.paymentMethod}
                          </p>
                        </div>
                      )}
                      <div className="space-y-0.5 text-xs flex-1 flex flex-col justify-end">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Storage:</span>
                          <span className="font-medium text-gray-900">
                            ${booking.subtotal.toFixed(2)}
                          </span>
                        </div>
                        {(booking.addonsCost ?? 0) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Add-ons:</span>
                            <span className="font-medium text-gray-900">
                              ${(booking.addonsCost ?? 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {(booking.addonsDeliveryCost ?? 0) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Add-ons Delivery:
                            </span>
                            <span className="font-medium text-gray-900">
                              ${(booking.addonsDeliveryCost ?? 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {(booking.climateControlCost ?? 0) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Climate Control:
                            </span>
                            <span className="font-medium text-gray-900">
                              ${(booking.climateControlCost ?? 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {(booking.protectionPlanCost ?? 0) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Protection Plan:
                            </span>
                            <span className="font-medium text-gray-900">
                              ${(booking.protectionPlanCost ?? 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {(booking.redeliveryFee ?? 0) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Redelivery Fee:
                            </span>
                            <span className="font-medium text-gray-900">
                              ${(booking.redeliveryFee ?? 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {(booking.zoneDeliveryCharges ?? 0) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Zone Delivery:
                            </span>
                            <span className="font-medium text-gray-900">
                              ${(booking.zoneDeliveryCharges ?? 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {(booking.savings ?? 0) > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Savings:</span>
                            <span className="font-medium">
                              -${(booking.savings ?? 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-gray-200 mt-1">
                          <span className="text-xs font-bold text-gray-900">
                            Total:
                          </span>
                          <span className="text-base font-bold text-[#f8992f]">
                            ${booking.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Fixed Action Buttons */}
            <div className="flex gap-x-8 m-4 justify-end">
              <button
                onClick={handleDownloadInvoice}
                disabled={isDownloadingInvoice || !booking.invoiceId}
                className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloadingInvoice ? "Downloading..." : "Download Invoice"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
