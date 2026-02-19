import { type Booking } from "@/lib/api/bookingService";

interface BookingBundleCardProps {
  bundle: NonNullable<Booking["bundle"]>;
}

export default function BookingBundleCard({ bundle }: BookingBundleCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#ea9637]/10 via-[#FB9A2D]/5 to-[#ea9637]/10 rounded-xl p-5 border-2 border-[#ea9637]/30 hover:border-[#ea9637]/50 transition-all hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ea9637] to-[#FB9A2D] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
          {bundle.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xl font-bold text-gray-900 mb-1">
            {bundle.name}
          </h4>
          {bundle.description && (
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {bundle.description}
            </p>
          )}
          <div className="space-y-2">
            {(bundle.fromMonth || bundle.toMonth) && (
              <p className="text-sm text-gray-700 font-medium">
                <span className="text-gray-500">Period:</span>{" "}
                {bundle.fromMonth && bundle.toMonth
                  ? `${bundle.fromMonth} - ${bundle.toMonth}`
                  : bundle.fromMonth || bundle.toMonth}
                {bundle.months &&
                  bundle.months > 0 &&
                  ` (${bundle.months} ${
                    bundle.months === 1 ? "month" : "months"
                  })`}
              </p>
            )}
            {bundle.extras && (
              <p className="text-sm text-gray-700">
                <span className="text-gray-500">Extras:</span> {bundle.extras}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#ea9637]/30">
        <span className="text-sm font-semibold text-gray-700">
          Bundle Price:
        </span>
        <span className="text-xl font-bold text-[#f8992f]">
          ${bundle.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

