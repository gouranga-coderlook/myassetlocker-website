import { type Booking } from "@/lib/api/bookingService";

interface DeliveryInfoCardProps {
  deliveryInfo: Booking["deliveryInfo"];
}

export default function DeliveryInfoCard({
  deliveryInfo,
}: DeliveryInfoCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-[#f8992f]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Delivery Information
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="font-semibold text-gray-700 min-w-[80px]">Name:</span>
          <span className="text-gray-900">{deliveryInfo.fullName}</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-semibold text-gray-700 min-w-[80px]">Email:</span>
          <span className="text-gray-900 break-all">{deliveryInfo.email}</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-semibold text-gray-700 min-w-[80px]">Phone:</span>
          <span className="text-gray-900">{deliveryInfo.phone}</span>
        </div>
        <div className="pt-3 border-t border-gray-200 mt-3">
          <p className="font-semibold text-gray-700 mb-2">Address:</p>
          <p className="text-gray-900 leading-relaxed">
            {deliveryInfo.address}
            <br />
            {deliveryInfo.city}, {deliveryInfo.state} {deliveryInfo.zipCode}
          </p>
        </div>
      </div>
    </div>
  );
}

