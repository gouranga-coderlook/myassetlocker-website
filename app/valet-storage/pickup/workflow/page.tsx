"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { 
  type Order, 
  OrderStatus,
  getStatusDisplayName,
  getStatusColor,
  canTransitionTo,
  valetStorageService
} from "@/lib/api/valetStorageService";
import { getBookingById, type Booking, type BookingItem } from "@/lib/api/bookingService";
import { getAccessToken } from "@/lib/utils/tokenStorage";
import toast from "react-hot-toast";
import Hero from "@/components/Hero";

interface WorkflowStep {
  status: OrderStatus;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  canAction: boolean;
}

interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicleInfo?: {
    make?: string;
    model?: string;
    licensePlate?: string;
  };
}

interface WarehouseInfo {
  id: string;
  name: string;
  address: string;
  location?: string; // Specific location within warehouse (shelf, section, etc.)
}

export default function PickupWorkflowPage() {
  const searchParams = useSearchParams();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [pickupId, setPickupId] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [warehouseInfo, setWarehouseInfo] = useState<WarehouseInfo | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent body scroll when Complete Pickup modal is open
  useEffect(() => {
    if (showCompleteModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [showCompleteModal]);

  // Extract driver info from shipmentDetails
  const extractDriverInfo = (shipmentDetails: Booking['shipmentDetails']): DriverInfo | null => {
    if (!shipmentDetails?.driver) return null;
    
    return {
      id: shipmentDetails.driver.id,
      name: shipmentDetails.driver.name,
      phone: shipmentDetails.driver.phone,
      vehicleInfo: shipmentDetails.driver.vehicleInfo ? {
        make: shipmentDetails.driver.vehicleInfo.make,
        model: shipmentDetails.driver.vehicleInfo.model,
        licensePlate: shipmentDetails.driver.vehicleInfo.licensePlate,
      } : undefined,
    };
  };

  // Extract warehouse info from shipmentDetails
  const extractWarehouseInfo = (shipmentDetails: Booking['shipmentDetails']): WarehouseInfo | null => {
    if (!shipmentDetails?.warehouse) return null;
    
    return {
      id: shipmentDetails.warehouse.id,
      name: shipmentDetails.warehouse.name,
      address: shipmentDetails.warehouse.address,
      location: undefined, // Can be added if available in API response
    };
  };

  // Normalize backend status (uppercase) to frontend enum (lowercase)
  const normalizeOrderStatus = (status: string | OrderStatus): OrderStatus => {
    if (!status) return OrderStatus.PICKUP_REQUEST;
    
    // If already lowercase, return as-is
    if (Object.values(OrderStatus).includes(status as OrderStatus)) {
      return status as OrderStatus;
    }
    
    // Convert uppercase to lowercase with underscores
    const normalized = status.toUpperCase().replace(/\s+/g, "_");
    const statusMap: Record<string, OrderStatus> = {
      "PICKUP_REQUEST": OrderStatus.PICKUP_REQUEST,
      "PICKUP_CONFIRMED": OrderStatus.PICKUP_CONFIRMED,
      "PICKUP_TIME_CONFIRMED": OrderStatus.PICKUP_TIME_CONFIRMED,
      "PICKUP_SCHEDULED": OrderStatus.PICKUP_SCHEDULED,
      "PICKED_UP": OrderStatus.PICKED_UP,
      "STORED": OrderStatus.STORED,
      "DELIVERY_REQUEST": OrderStatus.DELIVERY_REQUEST,
      "DELIVERY_REQUEST_CONFIRMED": OrderStatus.DELIVERY_REQUEST_CONFIRMED,
      "DELIVERY_SCHEDULED": OrderStatus.DELIVERY_SCHEDULED,
      "DELIVERED": OrderStatus.DELIVERED,
    };
    
    return statusMap[normalized] || OrderStatus.PICKUP_REQUEST;
  };

  // Helper function to normalize status (lowercase, no underscores)
  const normalizeStatus = (status: string | OrderStatus | undefined): string => {
    if (!status) return '';
    return status.toString().toLowerCase().replace(/_/g, '');
  };

  // Helper function to check if status matches any of the given statuses
  const isStatusIn = (status: string | OrderStatus | undefined, statuses: OrderStatus[]): boolean => {
    if (!status) return false;
    const normalized = normalizeStatus(status);
    return statuses.some(s => normalizeStatus(s) === normalized);
  };

  // Convert booking to order format
  const convertBookingToOrder = (booking: Booking): Order | null => {
    if (!booking) return null;

    // Get order status from booking's orderStatus field
    const orderStatus = booking.orderStatus 
      ? normalizeOrderStatus(booking.orderStatus)
      : OrderStatus.PICKUP_REQUEST;

    // Convert booking items to order items
    const orderItems = booking.items?.map((item: BookingItem) => ({
      itemId: item.id || `item-${Math.random()}`,
      description: item.name || item.description || "Item",
      quantity: item.quantity || 1,
    })) || [];

    // Extract scheduled time, driver, and warehouse from shipmentDetails
    const scheduledAt = booking.shipmentDetails?.scheduledAt || null;
    const assignedDriverId = booking.shipmentDetails?.driver?.id || null;
    const warehouseLocation = booking.shipmentDetails?.warehouse?.address || null;

    return {
      id: booking.id,
      userId: booking.deliveryInfo?.email || userId || "",
      items: orderItems,
      type: "pickup" as const,
      status: orderStatus,
      scheduledAt: scheduledAt,
      assignedDriverId: assignedDriverId,
      warehouseLocation: warehouseLocation,
      createdAt: booking.createdAt || new Date().toISOString(),
      updatedAt: booking.updatedAt || new Date().toISOString(),
      bookingId: booking.id,
    };
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !userId || !getAccessToken()) {
      if (!mounted) return;
      if (!userId) setLoading(false);
      return;
    }

    const loadBookingData = async () => {
      const id = searchParams?.get("id");
      if (!id) {
        toast.error("Pickup ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setPickupId(id);
        
        // Load booking from API
        const booking = await getBookingById(id);
        if (!booking) {
          toast.error("Booking not found");
          setLoading(false);
          return;
        }

        // Convert booking to order format
        const orderData = convertBookingToOrder(booking);
        if (!orderData) {
          toast.error("Failed to process booking data");
          setLoading(false);
          return;
        }

        // Store booking for direct orderStatus access
        setBooking(booking);
        setOrder(orderData);

        // Load driver info from shipmentDetails if available
        if (booking.shipmentDetails?.driver) {
          const driver = extractDriverInfo(booking.shipmentDetails);
          if (driver) {
            setDriverInfo(driver);
          }
        }

        // Load warehouse info from shipmentDetails if available
        if (booking.shipmentDetails?.warehouse) {
          const warehouse = extractWarehouseInfo(booking.shipmentDetails);
          if (warehouse) {
            setWarehouseInfo(warehouse);
          }
        }
      } catch (error) {
        console.error("Error loading booking:", error);
        toast.error("Failed to load booking data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();

    // Refresh booking data every 30 seconds to get status updates from admin
    const refreshInterval = setInterval(() => {
      const id = searchParams?.get("id");
      if (id) {
        getBookingById(id)
          .then((updatedBooking) => {
            if (updatedBooking) {
              setBooking(updatedBooking);
              const convertedOrder = convertBookingToOrder(updatedBooking);
              if (convertedOrder) {
                setOrder(convertedOrder);
              }
              
              // Update driver info from shipmentDetails if available
              if (updatedBooking.shipmentDetails?.driver) {
                const driver = extractDriverInfo(updatedBooking.shipmentDetails);
                if (driver) {
                  setDriverInfo(driver);
                }
              }
              
              // Update warehouse info from shipmentDetails if available
              if (updatedBooking.shipmentDetails?.warehouse) {
                const warehouse = extractWarehouseInfo(updatedBooking.shipmentDetails);
                if (warehouse) {
                  setWarehouseInfo(warehouse);
                }
              }
            }
          })
          .catch((error) => {
            console.error("Error refreshing booking:", error);
          });
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, userId, searchParams]);

  // Helper function to compare statuses (case-insensitive, handles underscores)
  const isStatusEqual = (status1: string | OrderStatus | undefined, status2: OrderStatus): boolean => {
    if (!status1) return false;
    return normalizeStatus(status1) === normalizeStatus(status2);
  };

  const getWorkflowSteps = (): WorkflowStep[] => {
    if (!order && !booking) return [];

    // Use booking's orderStatus directly if available, otherwise use order status
    const rawStatus = booking?.orderStatus || order?.status;
    if (!rawStatus) return [];

    // Normalize the status to ensure it matches our enum
    const currentStatus = normalizeOrderStatus(rawStatus);
    
    const steps: WorkflowStep[] = [
      {
        status: OrderStatus.PICKUP_REQUEST,
        label: "Pickup Requested",
        description: "Your pickup request has been submitted",
        completed: [
          OrderStatus.PICKUP_CONFIRMED,
          OrderStatus.PICKUP_TIME_CONFIRMED,
          OrderStatus.PICKUP_SCHEDULED,
          OrderStatus.PICKED_UP,
          OrderStatus.STORED,
        ].some(s => isStatusEqual(currentStatus, s)),
        current: isStatusEqual(currentStatus, OrderStatus.PICKUP_REQUEST),
        canAction: false,
      },
      {
        status: OrderStatus.PICKUP_CONFIRMED,
        label: "Pickup Confirmed",
        description: "Admin has confirmed your pickup request",
        completed: [
          OrderStatus.PICKUP_CONFIRMED,
          OrderStatus.PICKUP_TIME_CONFIRMED,
          OrderStatus.PICKUP_SCHEDULED,
          OrderStatus.PICKED_UP,
          OrderStatus.STORED,
        ].some(s => isStatusEqual(currentStatus, s)),
        current: isStatusEqual(currentStatus, OrderStatus.PICKUP_CONFIRMED) && !isStatusEqual(currentStatus, OrderStatus.PICKUP_TIME_CONFIRMED) && !isStatusEqual(currentStatus, OrderStatus.PICKUP_SCHEDULED) && !isStatusEqual(currentStatus, OrderStatus.PICKED_UP) && !isStatusEqual(currentStatus, OrderStatus.STORED),
        canAction: false,
      },
      {
        status: OrderStatus.PICKUP_TIME_CONFIRMED,
        label: "Time Confirmed",
        description: "Pickup time slot has been confirmed",
        completed: [
          OrderStatus.PICKUP_TIME_CONFIRMED,
          OrderStatus.PICKUP_SCHEDULED,
          OrderStatus.PICKED_UP,
          OrderStatus.STORED,
        ].some(s => isStatusEqual(currentStatus, s)),
        current: isStatusEqual(currentStatus, OrderStatus.PICKUP_TIME_CONFIRMED) && !isStatusEqual(currentStatus, OrderStatus.PICKUP_SCHEDULED) && !isStatusEqual(currentStatus, OrderStatus.PICKED_UP) && !isStatusEqual(currentStatus, OrderStatus.STORED),
        canAction: false,
      },
      {
        status: OrderStatus.PICKUP_SCHEDULED,
        label: "Pickup Scheduled",
        description: "Pickup has been scheduled with driver",
        completed: [
          OrderStatus.PICKUP_SCHEDULED,
          OrderStatus.PICKED_UP,
          OrderStatus.STORED,
        ].some(s => isStatusEqual(currentStatus, s)),
        current: isStatusEqual(currentStatus, OrderStatus.PICKUP_SCHEDULED) && !isStatusEqual(currentStatus, OrderStatus.PICKED_UP) && !isStatusEqual(currentStatus, OrderStatus.STORED),
        canAction: canTransitionTo(normalizeOrderStatus(currentStatus), OrderStatus.PICKED_UP),
      },
      {
        status: OrderStatus.PICKED_UP,
        label: "Picked Up",
        description: "Items have been collected from your location",
        completed: isStatusEqual(currentStatus, OrderStatus.PICKED_UP) || isStatusEqual(currentStatus, OrderStatus.STORED),
        current: isStatusEqual(currentStatus, OrderStatus.PICKED_UP) && !isStatusEqual(currentStatus, OrderStatus.STORED),
        canAction: false, // Users can only view, admin will mark as stored
      },
      {
        status: OrderStatus.STORED,
        label: "Stored in Warehouse",
        description: "Items are safely stored in our warehouse",
        completed: isStatusEqual(currentStatus, OrderStatus.STORED),
        current: isStatusEqual(currentStatus, OrderStatus.STORED),
        canAction: false,
      },
    ];

    return steps;
  };

  const handleCompletePickup = async () => {
    if (!order || !pickupId) return;

    try {
      setIsCompleting(true);
      
      // Call API to complete pickup - use booking ID as pickupId
      const updatedOrder = await valetStorageService.completePickup(pickupId);
      
      // Reload booking to get updated status
      const updatedBooking = await getBookingById(pickupId);
      if (updatedBooking) {
        setBooking(updatedBooking);
        const convertedOrder = convertBookingToOrder(updatedBooking);
        if (convertedOrder) {
          setOrder(convertedOrder);
        } else {
          // Fallback to API response
          setOrder(updatedOrder);
        }
      } else {
        // Fallback to API response
        setOrder(updatedOrder);
      }
      
      setShowCompleteModal(false);
      toast.success("Pickup marked as completed!");
    } catch (error: unknown) {
      console.error("Error completing pickup:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (error as { message?: string })?.message || "Failed to complete pickup. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsCompleting(false);
    }
  };

  // Note: handleStorePickup removed - only admin can mark items as stored
  // Users can only view the status

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <Hero
          backgroundImage="/household-storage-service.webp"
          headline="Pickup Workflow"
          bodyText="Track your pickup progress"
          height="compact"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f8992f] mb-4"></div>
              <p className="text-gray-600 text-sm font-medium">Loading pickup details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = getWorkflowSteps();
  // Use booking's orderStatus directly for display, fallback to order status
  const displayStatus = booking?.orderStatus 
    ? normalizeOrderStatus(booking.orderStatus)
    : order.status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
      <Hero
        backgroundImage="/household-storage-service.webp"
        headline="Pickup Workflow"
        bodyText="Track your pickup progress from scheduled to stored"
        height="compact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Order Info Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pickup Order #{order.id.slice(0, 8)}</h2>
              <p className="text-xs text-gray-600">
                {order.items && order.items.length > 0 && (
                  <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                )}
                {order.scheduledAt && (
                  <span className="ml-2">• {new Date(order.scheduledAt).toLocaleDateString()}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(displayStatus)}`}>
                {getStatusDisplayName(displayStatus)}
              </span>
              {/* Action Button - Show when status is PICKUP_SCHEDULED */}
              {isStatusEqual(displayStatus, OrderStatus.PICKUP_SCHEDULED) && (
                <button
                  onClick={() => setShowCompleteModal(true)}
                  disabled={isCompleting}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#f8992f] to-[#FB9A2D] hover:from-[#d8852a] hover:to-[#e88a25] text-white rounded text-xs font-semibold transition-all shadow-sm hover:shadow flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompleting ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Picked Up
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Workflow Progress */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900 mb-0.5">Workflow Progress</h3>
          </div>

          {/* Horizontal Timeline - Desktop */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 rounded-full">
                {(() => {
                  const completedCount = steps.filter(s => s.completed).length;
                  const currentIndex = steps.findIndex(s => s.current);
                  const progress = currentIndex >= 0 && !steps[currentIndex]?.completed
                    ? ((completedCount + 0.5) / steps.length) * 100
                    : (completedCount / steps.length) * 100;
                  return (
                    <div 
                      className="h-0.5 bg-gradient-to-r from-green-500 to-[#f8992f] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  );
                })()}
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    {/* Step Circle */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.completed
                          ? "bg-green-500 border-green-500 text-white shadow"
                          : step.current
                          ? "bg-[#f8992f] border-[#f8992f] text-white shadow ring-2 ring-[#f8992f]/20"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="mt-2 text-center max-w-[100px]">
                      <h4
                        className={`text-xs font-semibold mb-0.5 ${
                          step.completed || step.current ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className={`text-[10px] leading-tight ${step.completed || step.current ? "text-gray-600" : "text-gray-400"}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vertical Timeline - Mobile/Tablet */}
          <div className="lg:hidden space-y-3">
            {steps.map((step, index) => (
              <div key={step.status} className="relative flex items-start gap-2">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 ${
                      step.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                    style={{ height: "calc(100% + 0.75rem)", bottom: "-0.75rem" }}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.completed
                      ? "bg-green-500 border-green-500 text-white shadow"
                      : step.current
                      ? "bg-[#f8992f] border-[#f8992f] text-white shadow ring-1 ring-[#f8992f]/20"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-0.5">
                  <h4
                    className={`text-xs font-semibold mb-0.5 ${
                      step.completed || step.current ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className={`text-[10px] ${step.completed || step.current ? "text-gray-600" : "text-gray-400"}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Order Items Card */}
          {order.items && order.items.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
              <h3 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#f8992f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Items
              </h3>
              <ul className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#f8992f] text-xs mt-0.5">•</span>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{item.description}</p>
                      <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Driver Details Card */}
          {driverInfo && isStatusIn(displayStatus, [OrderStatus.PICKUP_SCHEDULED, OrderStatus.PICKED_UP, OrderStatus.STORED]) && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
              <h3 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Driver
              </h3>
              <div className="space-y-1.5">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Name</p>
                  <p className="text-xs font-medium text-gray-900">{driverInfo.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Phone</p>
                  <a href={`tel:${driverInfo.phone}`} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                    {driverInfo.phone}
                  </a>
                </div>
                {driverInfo.vehicleInfo && (
                  <div className="pt-1.5 border-t border-gray-200">
                    <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Vehicle</p>
                    {driverInfo.vehicleInfo.make && driverInfo.vehicleInfo.model && (
                      <p className="text-xs text-gray-700 mb-0.5">{driverInfo.vehicleInfo.make} {driverInfo.vehicleInfo.model}</p>
                    )}
                    {driverInfo.vehicleInfo.licensePlate && (
                      <p className="text-xs text-gray-700">Plate: {driverInfo.vehicleInfo.licensePlate}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warehouse Information Card */}
          {warehouseInfo && isStatusIn(displayStatus, [OrderStatus.PICKUP_SCHEDULED, OrderStatus.PICKED_UP, OrderStatus.STORED]) && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
              <h3 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Warehouse
              </h3>
              <div className="space-y-1.5">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Name</p>
                  <p className="text-xs font-medium text-gray-900 mb-0.5">{warehouseInfo.name}</p>
                  <p className="text-[10px] text-gray-600">{warehouseInfo.address}</p>
                </div>
                {warehouseInfo.location && (
                  <div className="pt-1.5 border-t border-gray-200">
                    <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Location</p>
                    <p className="text-xs font-medium text-gray-900">{warehouseInfo.location}</p>
                    {order.warehouseLocation && (
                      <p className="text-[10px] text-gray-600 mt-0.5">{order.warehouseLocation}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scheduled Time Card */}
          {(order.scheduledAt || booking?.shipmentDetails?.scheduledDate) && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-3">
              <h3 className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Scheduled
              </h3>
              {order.scheduledAt ? (
                <>
                  <p className="text-xs font-semibold text-blue-900">
                    {new Date(order.scheduledAt).toLocaleDateString()}
                  </p>
                  {booking?.shipmentDetails?.startTime && booking?.shipmentDetails?.endTime ? (
                    <p className="text-[10px] text-blue-700 mt-0.5">
                      {booking.shipmentDetails.startTime} - {booking.shipmentDetails.endTime}
                    </p>
                  ) : (
                    <p className="text-[10px] text-blue-700 mt-0.5">
                      {new Date(order.scheduledAt).toLocaleTimeString()}
                    </p>
                  )}
                </>
              ) : booking?.shipmentDetails?.scheduledDate ? (
                <>
                  <p className="text-xs font-semibold text-blue-900">
                    {new Date(booking.shipmentDetails.scheduledDate).toLocaleDateString()}
                  </p>
                  {booking.shipmentDetails.startTime && booking.shipmentDetails.endTime && (
                    <p className="text-[10px] text-blue-700 mt-0.5">
                      {booking.shipmentDetails.startTime} - {booking.shipmentDetails.endTime}
                    </p>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Complete Pickup Modal */}
        {showCompleteModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setShowCompleteModal(false)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-4 transform transition-all shrink-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900">Complete Pickup</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 ml-10">
                Mark this pickup as completed. This will update the status to &quot;Picked Up&quot;.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompletePickup}
                  disabled={isCompleting}
                  className="flex-1 px-3 py-1.5 bg-[#f8992f] hover:bg-[#d8852a] text-white rounded text-xs font-medium transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCompleting ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Complete Pickup"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}