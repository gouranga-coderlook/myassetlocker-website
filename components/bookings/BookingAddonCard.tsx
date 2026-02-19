import { type BookingItem } from "@/lib/api/bookingService";
import { type Booking } from "@/lib/api/bookingService";

interface BookingAddonCardProps {
  item: BookingItem;
  plan?: Booking["plan"];
}

export default function BookingAddonCard({
  item,
  plan,
}: BookingAddonCardProps) {
  const isMonthlyAddon =
    item.type === "addon" &&
    plan?.durationMonths &&
    plan.durationMonths > 0;
  const unitPrice =
    isMonthlyAddon && item.quantity > 0
      ? item.price / (item.quantity * (plan?.durationMonths || 1))
      : item.price / (item.quantity || 1);

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-base font-semibold text-gray-900">
              {item.name}
            </h4>
            <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600 capitalize flex-shrink-0">
              {item.type}
            </span>
          </div>
          {item.description && (
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {isMonthlyAddon && plan?.durationMonths ? (
              <>
                <span className="font-medium">Qty: {item.quantity}</span>
                <span>${unitPrice.toFixed(2)}/month</span>
                <span>× {plan.durationMonths} months</span>
              </>
            ) : (
              <>
                <span className="font-medium">Qty: {item.quantity}</span>
                <span>${unitPrice.toFixed(2)} per unit</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

