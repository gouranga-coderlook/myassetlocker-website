import { type Booking } from "@/lib/api/bookingService";

interface PaymentSummaryCardProps {
  booking: Booking;
}

export default function PaymentSummaryCard({
  booking,
}: PaymentSummaryCardProps) {
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Payment & Summary
      </h3>
      {booking.paymentMethod && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Payment Method</p>
          <p className="text-base font-semibold text-gray-900 capitalize">
            {booking.paymentMethod.replace("_", " ")}
          </p>
        </div>
      )}
      <div className="space-y-2.5 text-sm">
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
            <span className="text-gray-600">Add-ons Delivery:</span>
            <span className="font-medium text-gray-900">
              ${(booking.addonsDeliveryCost ?? 0).toFixed(2)}
            </span>
          </div>
        )}
        {(booking.climateControlCost ?? 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Climate Control:</span>
            <span className="font-medium text-gray-900">
              ${(booking.climateControlCost ?? 0).toFixed(2)}
            </span>
          </div>
        )}
        {(booking.protectionPlanCost ?? 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Protection Plan:</span>
            <span className="font-medium text-gray-900">
              ${(booking.protectionPlanCost ?? 0).toFixed(2)}
            </span>
          </div>
        )}
        {(booking.redeliveryFee ?? 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Redelivery Fee:</span>
            <span className="font-medium text-gray-900">
              ${(booking.redeliveryFee ?? 0).toFixed(2)}
            </span>
          </div>
        )}
        {(booking.zoneDeliveryCharges ?? 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Zone Delivery:</span>
            <span className="font-medium text-gray-900">
              ${(booking.zoneDeliveryCharges ?? 0).toFixed(2)}
            </span>
          </div>
        )}
        {(booking.savings ?? 0) > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Savings:</span>
            <span>-${(booking.savings ?? 0).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-4 border-t-2 border-gray-300 mt-4">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-[#f8992f]">
            ${booking.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

