import { type Booking } from "@/lib/api/bookingService";

interface BookingStatusBadgeProps {
  status: Booking["status"];
  paymentStatus?: Booking["paymentStatus"];
}

export default function BookingStatusBadge({
  status,
  paymentStatus,
}: BookingStatusBadgeProps) {
  const getStatusColor = (status: Booking["status"]) => {
    // Normalize status to handle case variations
    const normalizedStatus = status?.toLowerCase() || "";
    
    // Completed/Delivered statuses - Green
    if (
      normalizedStatus === "completed" ||
      normalizedStatus === "delivered"
    ) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    
    // Confirmed/Active/Booked/Stored statuses - Purple
    if (
      normalizedStatus === "confirmed" ||
      normalizedStatus === "active" ||
      normalizedStatus === "booked" ||
      normalizedStatus === "stored"
    ) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    
    // Processing statuses - Blue
    if (
      normalizedStatus === "processing" ||
      normalizedStatus === "payment in progress" ||
      normalizedStatus === "picked up" ||
      normalizedStatus === "redelivery requested" ||
      normalizedStatus === "on hold"
    ) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    
    // Pending statuses - Yellow
    if (
      normalizedStatus === "pending" ||
      normalizedStatus === "pending payment" ||
      normalizedStatus === "draft"
    ) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    
    // Cancelled/Expired statuses - Red
    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "expired"
    ) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    
    // Default - Gray
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentStatusColor = (paymentStatus?: Booking["paymentStatus"]) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize border ${getStatusColor(
          status
        )}`}
      >
        {status}
      </span>
      {paymentStatus && (
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize border ${getPaymentStatusColor(
            paymentStatus
          )}`}
        >
          {paymentStatus}
        </span>
      )}
    </div>
  );
}

