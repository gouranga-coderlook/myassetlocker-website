"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import AuthLoadingView from "@/components/AuthLoadingView";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserBookings, type Booking } from "@/lib/api/bookingService";
import toast from "react-hot-toast";

const STORED_INVENTORY_STATUSES = new Set([
  "STORED",
  "DELIVERY_REQUEST",
  "DELIVERY_REQUEST_CONFIRMED",
  "DELIVERY_SCHEDULED",
]);

function isStoredInventoryStatus(orderStatus?: string): boolean {
  if (!orderStatus) return false;
  return STORED_INVENTORY_STATUSES.has(orderStatus.toUpperCase());
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, authHydrated, openAuthPopup, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await getUserBookings(1, 50);
      setBookings(response.bookings);
    } catch (error) {
      console.error("Error loading dashboard inventory:", error);
      toast.error("Failed to load dashboard inventory.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadBookings();
  }, [isAuthenticated, loadBookings]);

  const storedInventoryBookings = useMemo(
    () => bookings.filter((booking) => isStoredInventoryStatus(booking.orderStatus)),
    [bookings],
  );

  const storedAssetsCount = useMemo(
    () =>
      storedInventoryBookings.reduce((total, booking) => {
        const bookingItemCount = booking.items.reduce(
          (itemTotal, item) => itemTotal + (item.quantity || 0),
          0,
        );
        return total + bookingItemCount;
      }, 0),
    [storedInventoryBookings],
  );

  if (!authHydrated) {
    return (
      <AuthLoadingView
        headline="Dashboard"
        bodyText="Loading your inventory overview"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <Hero
          backgroundImage="/products-1.png"
          headline="Dashboard"
          bodyText="Sign in to view your stored inventory"
          height="compact"
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign in to view your dashboard
            </h2>
            <p className="text-gray-600 mb-8">
              Access your stored assets, inventory status, and booking actions.
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
        headline="Dashboard"
        bodyText="Your stored assets and quick actions"
        height="compact"
      />

      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Welcome back
                <span className="font-bold">{user?.firstName ? `, ${user.firstName}` : ""}.</span>
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#4c4946]">
                Stored Assets Overview
              </h2>
              <p className="text-gray-600 mt-2">
                Track your current inventory and create a new storage booking.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              <div className="rounded-xl border border-[#fbd7a5] bg-[#fef7ed] px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-[#8e9293]">
                  Active Inventory
                </p>
                {loading ? (
                  <div className="mt-1 h-8 w-14 animate-pulse rounded bg-[#fbd7a5]" />
                ) : (
                  <p className="text-2xl font-bold text-[#4c4946]">{storedAssetsCount}</p>
                )}
              </div>
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-[#8e9293]">
                  Inventory Orders
                </p>
                {loading ? (
                  <div className="mt-1 h-8 w-14 animate-pulse rounded bg-gray-200" />
                ) : (
                  <p className="text-2xl font-bold text-[#4c4946]">
                    {storedInventoryBookings.length}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/pricing")}
              className="px-5 py-2.5 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
            >
              Book Storage
            </button>
            <button
              onClick={() => router.push("/bookings")}
              className="px-5 py-2.5 border border-[#f8992f] text-[#f8992f] font-semibold rounded-lg hover:bg-[#f8992f]/5 transition-colors"
            >
              View All Orders
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto" />
            <p className="mt-4 text-gray-600">Loading inventory...</p>
          </div>
        ) : storedInventoryBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <h3 className="text-2xl font-bold text-[#4c4946] mb-3">
              No current inventory
            </h3>
            <p className="text-gray-600 mb-6">
              You do not have any stored assets right now. Start a booking to add
              items to your inventory.
            </p>
            <button
              onClick={() => router.push("/pricing")}
              className="px-6 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
            >
              Book Storage
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {storedInventoryBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-[#4c4946]">
                      {booking.bookingNumber}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {booking.items.length} item types • Total $
                      {booking.total.toFixed(2)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {booking.items.slice(0, 5).map((item) => (
                        <span
                          key={`${booking.id}-${item.id}`}
                          className="px-2.5 py-1 rounded-full text-xs bg-[#f7f7f7] text-[#4c4946]"
                        >
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/bookings/${booking.id}`)}
                    className="self-start px-4 py-2 text-sm font-medium text-[#f8992f] border border-[#f8992f] rounded-lg hover:bg-[#f8992f]/5 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

