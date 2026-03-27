"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { valetStorageService, type CreateDeliveryRequest, type TimeSlot } from "@/lib/api/valetStorageService";
import { getBookingById, type Booking } from "@/lib/api/bookingService";
import toast from "react-hot-toast";
import Hero from "@/components/Hero";
import AuthLoadingView from "@/components/AuthLoadingView";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";

interface RedeliveryFormValues {
  selectedDate: string;
  selectedTimeSlotId: string;
  deliveryAddress: string;
  notes: string;
}

export default function CreateRedeliveryRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authHydrated } = useAuth();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const hasRedirectedForAuth = useRef(false);
  const hasRedirectedForBooking = useRef(false);

  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RedeliveryFormValues>({
    defaultValues: {
      selectedDate: "",
      selectedTimeSlotId: "",
      deliveryAddress: "",
      notes: "",
    },
    mode: "onChange",
  });

  const selectedDate = watch("selectedDate");
  const selectedTimeSlotId = watch("selectedTimeSlotId");

  useEffect(() => {
    if (!authHydrated || userId) return;
    if (hasRedirectedForAuth.current) return;
    hasRedirectedForAuth.current = true;
    toast.error("Please sign in to create a redelivery request");
    sessionStorage.setItem("authReturnUrl", "/valet-storage/redelivery");
    sessionStorage.setItem("openAuthPopup", "true");
    router.replace("/");
  }, [authHydrated, userId, router]);

  useEffect(() => {
    if (!authHydrated || !userId) return;
    const bookingIdParam = searchParams?.get("bookingId");
    if (bookingIdParam) {
      setBookingId(bookingIdParam);
      fetchBookingDetails(bookingIdParam);
    } else {
      if (hasRedirectedForBooking.current) return;
      hasRedirectedForBooking.current = true;
      router.replace("/bookings");
    }
  }, [authHydrated, userId, searchParams, router]);

  const fetchBookingDetails = async (id: string) => {
    try {
      setLoadingBooking(true);
      const bookingData = await getBookingById(id);
      if (bookingData) {
        setBooking(bookingData);
        // Pre-fill delivery address from booking delivery info if available
        if (bookingData.deliveryInfo?.address) {
          const addressParts = [
            bookingData.deliveryInfo.address,
            bookingData.deliveryInfo.city,
            bookingData.deliveryInfo.state,
            bookingData.deliveryInfo.zipCode,
          ].filter(Boolean);
          setValue("deliveryAddress", addressParts.join(", "), { shouldValidate: true });
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoadingBooking(false);
    }
  };

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate);
    } else {
      setAvailableTimeSlots([]);
      setValue("selectedTimeSlotId", "", { shouldValidate: true });
    }
  }, [selectedDate, setValue]);

  const fetchAvailableTimeSlots = async (date: string) => {
    try {
      setLoadingSlots(true);
      const slots = await valetStorageService.getAvailableTimeSlots(date, "delivery", true);
      setAvailableTimeSlots(slots);
      if (slots.length === 0) {
        toast.error("No available time slots for the selected date. Please choose another date.");
      }
    } catch (error: unknown) {
      console.error("Error fetching time slots:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load available time slots");
      setAvailableTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    // Format time to HH:mm (remove seconds if present)
    const formatTime = (time: string) => {
      // Handle both "HH:mm:ss" and "HH:mm" formats
      const parts = time.split(":");
      return `${parts[0]}:${parts[1]}`;
    };
    return `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Check if a time slot has expired based on current time
  const isSlotExpired = (slot: TimeSlot) => {
    if (!slot.startTime || !slot.slotDate) return false;
    
    const now = new Date();
    const todayDateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    
    // If slot is for a past date, it's expired
    if (slot.slotDate < todayDateStr) {
      return true;
    }
    
    // If the slot is for today, check if start time has passed
    if (slot.slotDate === todayDateStr) {
      // Parse startTime (format: "HH:mm:ss" or "HH:mm")
      const timeParts = slot.startTime.split(":");
      const slotHours = parseInt(timeParts[0], 10);
      const slotMinutes = parseInt(timeParts[1] || "0", 10);
      
      // Get current hours and minutes
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      // Compare hours first, then minutes
      if (currentHours > slotHours) {
        return true; // Current time is past the slot start time
      }
      if (currentHours === slotHours && currentMinutes >= slotMinutes) {
        return true; // Current time is at or past the slot start time
      }
      
      return false; // Slot hasn't started yet
    }
    
    return false;
  };

  const onSubmit = async (values: RedeliveryFormValues) => {
    if (!userId) {
      toast.error("Please login to create a redelivery request");
      return;
    }

    if (!bookingId) {
      toast.error("Booking ID is required. Please select a booking first.");
      router.push("/bookings");
      return;
    }

    // Validate date and time slot
    if (!values.selectedDate) {
      toast.error("Please select a preferred delivery date");
      return;
    }

    if (!values.selectedTimeSlotId) {
      toast.error("Please select a preferred delivery time slot");
      return;
    }

    // Find selected time slot
    const selectedSlot = availableTimeSlots.find(slot => slot.id === values.selectedTimeSlotId);
    if (!selectedSlot) {
      toast.error("Selected time slot is no longer available. Please select another.");
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
        parentBookingId: bookingId,
        address: values.deliveryAddress.trim(),
        notes: values.notes || undefined,
        preferredTimeSlotId: values.selectedTimeSlotId,
      };

      const response = await valetStorageService.createDeliveryRequest(request);
      
      toast.success("Redelivery request created successfully! Admin will confirm your time slot.");
      // Navigate to booking details page
      router.push(`/bookings/${response.bookingId || bookingId}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create redelivery request");
    } finally {
      setLoading(false);
    }
  };

  if (!authHydrated) {
    return (
      <AuthLoadingView
        headline="Request Redelivery"
        bodyText="Schedule a delivery for your stored items"
        backgroundImage="/household-storage-service.webp"
      />
    );
  }
  if (!userId) {
    return null;
  }
  if (!searchParams?.get("bookingId")) {
    return (
      <AuthLoadingView
        headline="Request Redelivery"
        bodyText="Taking you to your bookings..."
        backgroundImage="/household-storage-service.webp"
      />
    );
  }

  // Show loading state while fetching booking details
  if (loadingBooking && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <Hero
          backgroundImage="/household-storage-service.webp"
          headline="Request Redelivery"
          bodyText="Schedule a delivery for your stored items"
          height="compact"
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading booking details...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your booking information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
      <Hero
        backgroundImage="/household-storage-service.webp"
        headline="Request Redelivery"
        bodyText="Schedule a delivery for your stored items"
        height="compact"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
          {/* Booking ID (Required) */}
          {bookingId && (
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Booking Information</h4>
                    {loadingBooking ? (
                      <p className="text-sm text-blue-800">Loading booking details...</p>
                    ) : booking ? (
                      <>
                        <p className="text-sm text-blue-800 mb-2">
                          Booking: <span className="font-mono font-semibold">{booking.bookingNumber}</span>
                        </p>
                        <p className="text-xs text-blue-700 mb-2">
                          Status: <span className="capitalize">{booking.status}</span>
                          {booking.orderStatus && (
                            <> • Order Status: <span className="capitalize">{booking.orderStatus.replace(/_/g, " ")}</span></>
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => router.push("/bookings")}
                          className="text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                          Select different booking
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-blue-800">
                        Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Items */}
          {booking && booking.items && booking.items.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items to be Delivered
              </label>
              <div className="space-y-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                {booking.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-900">{item.name}</span>
                    <span className="text-gray-600">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Delivery Date - Mandatory */}
          <div className="mb-6">
            <Input
              id="preferred-delivery-date"
              type="date"
              label="Preferred Delivery Date"
              required
              min={getMinDate()}
              error={errors.selectedDate?.message}
              {...register("selectedDate", {
                required: "Please select a preferred delivery date.",
              })}
            />
            <p className="mt-1 text-sm text-gray-500">
              Select your preferred delivery date. Available time slots will be shown below.
            </p>
          </div>

          {/* Available Time Slots - Mandatory */}
          {selectedDate && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Delivery Time <span className="text-red-500">*</span>
              </label>
              {loadingSlots ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border-2 border-gray-200 bg-white animate-pulse"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              ) : availableTimeSlots.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    No available time slots for the selected date. Please choose another date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {availableTimeSlots.map((slot) => {
                    const isSelected = selectedTimeSlotId === slot.id;
                    const isFull = slot.bookedCount >= slot.maxCapacity;
                    const isExpired = isSlotExpired(slot);
                    const isDisabled = isFull || isExpired;
                    
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() =>
                          !isDisabled &&
                          setValue("selectedTimeSlotId", slot.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        disabled={isDisabled}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? "border-[#f8992f] bg-[#fef7ed] shadow-md"
                            : isDisabled
                            ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                            : "border-gray-200 hover:border-[#f8992f] hover:bg-[#fef7ed]/50 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${isSelected ? "text-[#f8992f]" : isDisabled ? "text-gray-400" : "text-gray-900"}`}>
                            {formatTimeSlot(slot)}
                          </span>
                          {isSelected && (
                            <svg className="w-5 h-5 text-[#f8992f]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          {isExpired ? (
                            <span className="text-red-600 font-medium">Expired</span>
                          ) : isFull ? (
                            <span className="text-red-600 font-medium">Fully Booked</span>
                          ) : (
                            <span>{slot.maxCapacity - slot.bookedCount} slots available</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedTimeSlotId && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Time slot selected: {formatTimeSlot(availableTimeSlots.find(s => s.id === selectedTimeSlotId)!)}
                </p>
              )}
              {errors.selectedTimeSlotId?.message && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.selectedTimeSlotId.message}
                </p>
              )}
              <input
                type="hidden"
                {...register("selectedTimeSlotId", {
                  required: "Please select a preferred delivery time slot.",
                })}
              />
            </div>
          )}

          {/* Delivery Address */}
          <div className="mb-6">
            <Input
              id="delivery-address"
              type="text"
              label="Delivery Address *"
              placeholder="Enter the address where items should be delivered"
              error={errors.deliveryAddress?.message}
              {...register("deliveryAddress", {
                required: "Please provide a delivery address.",
                validate: (value) => value.trim().length > 0 || "Please provide a delivery address.",
              })}
            />
            <p className="mt-1 text-sm text-gray-500">
              Please provide the complete delivery address
            </p>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f]"
              placeholder="Any special instructions or notes for the delivery team"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">What happens next?</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• We&apos;ll review your request and confirm the delivery time slot</li>
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
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isValid}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Redelivery Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

