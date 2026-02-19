import { type Booking } from "@/lib/api/bookingService";
import BookingBundleCard from "./BookingBundleCard";
import BookingPlanCard from "./BookingPlanCard";
import BookingAddonCard from "./BookingAddonCard";

interface BookingItemsListProps {
  booking: Booking;
}

export default function BookingItemsList({ booking }: BookingItemsListProps) {
  const otherItems = booking.items.filter(
    (item) => item.type !== "bundle" && item.type !== "plan"
  );

  return (
    <div className="space-y-4">
      {/* Bundle Section */}
      {booking.bundle && <BookingBundleCard bundle={booking.bundle} />}

      {/* Plan Section */}
      {booking.plan && !booking.bundle && (
        <BookingPlanCard plan={booking.plan} />
      )}

      {/* Other Items (Addons, Protection, etc.) */}
      {otherItems.length > 0 && (
        <div className="space-y-3">
          {otherItems.map((item) => (
            <BookingAddonCard key={item.id} item={item} plan={booking.plan} />
          ))}
        </div>
      )}
    </div>
  );
}

