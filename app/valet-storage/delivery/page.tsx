"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { valetStorageService, type CreateDeliveryRequest } from "@/lib/api/valetStorageService";
import type { Booking, BookingItem } from "@/lib/api/bookingService";
import toast from "react-hot-toast";
import AuthLoadingView from "@/components/AuthLoadingView";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";

interface DeliveryFormValues {
  selectedBookingId: string;
  deliveryAddress: string;
  notes: string;
}

export default function CreateDeliveryRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authHydrated } = useAuth();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const hasRedirectedForAuth = useRef(false);

  const [loading, setLoading] = useState(false);
  const [storedBookings, setStoredBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DeliveryFormValues>({
    defaultValues: {
      selectedBookingId: "",
      deliveryAddress: "",
      notes: "",
    },
    mode: "onChange",
  });

  const selectedBookingId = watch("selectedBookingId");
  const deliveryAddress = watch("deliveryAddress");

  useEffect(() => {
    if (!authHydrated || userId) return;
    if (hasRedirectedForAuth.current) return;
    hasRedirectedForAuth.current = true;
    toast.error("Please sign in to create a delivery request");
    sessionStorage.setItem("authReturnUrl", "/valet-storage/delivery");
    sessionStorage.setItem("openAuthPopup", "true");
    router.replace("/");
  }, [authHydrated, userId, router]);

  useEffect(() => {
    if (!authHydrated || !userId) return;
    loadStoredBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHydrated, userId, searchParams]);

  const loadStoredBookings = async () => {
    if (!userId) return;

    setLoadingBookings(true);
    try {
      // Get user bookings and filter for STORED status
      const { getUserBookings } = await import("@/lib/api/bookingService");
      const response = await getUserBookings(1, 100);
      const stored = response.bookings.filter(
        (booking) => booking.orderStatus?.toUpperCase() === "STORED"
      );
      setStoredBookings(stored);
      
      // Pre-select booking if bookingId is provided in query params
      const bookingIdFromQuery = searchParams?.get("bookingId");
      if (bookingIdFromQuery) {
        const bookingExists = stored.find((b) => b.id === bookingIdFromQuery);
        if (bookingExists) {
          setValue("selectedBookingId", bookingIdFromQuery, { shouldValidate: true });
          // Pre-fill delivery address from booking if available
          if (bookingExists.deliveryInfo?.address) {
            const addressParts = [
              bookingExists.deliveryInfo.address,
              bookingExists.deliveryInfo.city,
              bookingExists.deliveryInfo.state,
              bookingExists.deliveryInfo.zipCode,
            ].filter(Boolean);
            setValue("deliveryAddress", addressParts.join(", "), { shouldValidate: true });
          }
        } else {
          toast.error("Selected booking not found or not stored yet.");
        }
      }
      
      if (stored.length === 0) {
        toast.error("No stored items found. Items must be stored before delivery.");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load stored bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const onSubmit = async (values: DeliveryFormValues) => {
    if (!userId) {
      toast.error("Please login to create a delivery request");
      return;
    }

    if (!values.selectedBookingId) {
      toast.error("Please select a stored booking to deliver");
      return;
    }

    if (!values.deliveryAddress.trim()) {
      toast.error("Please provide a delivery address");
      return;
    }

    setLoading(true);

    try {
      const request: CreateDeliveryRequest = {
        userId,
        parentBookingId: values.selectedBookingId,
        address: values.deliveryAddress,
        notes: values.notes?.trim() ? values.notes : undefined,
      };

      const response = await valetStorageService.createDeliveryRequest(request);
      
      toast.success("Delivery request created successfully!");
      // Navigate to bookings page or the new delivery booking
      router.push(`/bookings/${response.orderId || values.selectedBookingId}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create delivery request");
    } finally {
      setLoading(false);
    }
  };

  if (!authHydrated) {
    return (
      <AuthLoadingView
        headline="Request Delivery"
        bodyText="Request delivery for your stored items"
      />
    );
  }
  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Delivery</h1>
          <p className="text-gray-600">
            Request delivery for your stored items. We&apos;ll bring them back to your location.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Select Stored Booking */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Stored Booking <span className="text-red-500">*</span>
            </label>
            
            {loadingBookings ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-sm text-gray-600">Loading stored bookings...</p>
              </div>
            ) : storedBookings.length === 0 ? (
              <div className="border border-gray-200 rounded-lg p-6 text-center bg-gray-50">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-600 mb-2">No stored items found</p>
                <p className="text-sm text-gray-500 mb-4">
                  Items must be picked up and stored before you can request delivery.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/valet-storage/pickup")}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Create Pickup Request →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {storedBookings.map((booking) => (
                  <label
                    key={booking.id}
                    className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedBookingId === booking.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="bookingId"
                        value={booking.id}
                        checked={selectedBookingId === booking.id}
                        onChange={(e) =>
                          setValue("selectedBookingId", e.target.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">Booking #{booking.id.slice(0, 8)}</h4>
                            <p className="text-sm text-gray-500">
                              Stored on {new Date(booking.createdAt || booking.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Stored
                          </span>
                        </div>
                        {booking.items && booking.items.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 font-medium mb-1">Items:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {booking.items.map((item: BookingItem, idx: number) => (
                                <li key={idx}>
                                  • {item.description || item.name || `Item ${idx + 1}`} 
                                  {item.quantity && ` (Qty: ${item.quantity})`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {errors.selectedBookingId?.message && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {errors.selectedBookingId.message}
              </p>
            )}
            <input
              type="hidden"
              {...register("selectedBookingId", {
                required: "Please select a stored booking to deliver.",
              })}
            />
          </div>

          {/* Delivery Address */}
          <div className="mb-6">
            <Input
              id="delivery-address"
              type="text"
              label="Delivery Address"
              required
              placeholder="Enter the delivery address..."
              error={errors.deliveryAddress?.message}
              {...register("deliveryAddress", {
                required: "Please provide a delivery address.",
                minLength: {
                  value: 5,
                  message: "Delivery address is too short.",
                },
              })}
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Any special instructions or notes..."
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">What happens next?</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• We&apos;ll review your delivery request and confirm</li>
                  <li>• You&apos;ll receive a confirmation with the scheduled delivery time</li>
                  <li>• Our team will deliver your items to your specified location</li>
                  <li>• You can track the delivery status in real-time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isValid || storedBookings.length === 0 || loadingBookings}
              className="px-6 py-3 border border-gray-300 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Delivery Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

