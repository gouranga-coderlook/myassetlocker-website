"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";

// Mock Order Status Enum
enum OrderStatus {
  PICKUP_REQUEST = "pickup_request",
  PICKUP_CONFIRMED = "pickup_confirmed",
  PICKUP_TIME_CONFIRMED = "pickup_time_confirmed",
  PICKUP_SCHEDULED = "pickup_scheduled",
  PICKED_UP = "picked_up",
  STORED = "stored",
  DELIVERY_REQUEST = "delivery_request",
  DELIVERY_REQUEST_CONFIRMED = "delivery_request_confirmed",
  DELIVERY_SCHEDULED = "delivery_scheduled",
  DELIVERED = "delivered",
}

// Mock Order Interface
interface Order {
  id: string;
  userId: string;
  items: Array<{
    itemId: string;
    description: string;
    quantity: number;
  }>;
  type: "pickup" | "delivery";
  status: OrderStatus;
  scheduledAt: string | null;
  assignedDriverId: string | null;
  warehouseLocation: string | null;
  createdAt: string;
  updatedAt: string;
  bookingId?: string;
}

interface WorkflowStep {
  status: OrderStatus;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  canAction: boolean;
}

// Mock Data
const MOCK_ORDERS: Record<string, Order> = {
  scheduled: {
    id: "d8b8c9cf-7a17-4d4c-8b2a-2867ae63084c",
    userId: "user-123",
    items: [
      { itemId: "item-1", description: "3 boxes of books", quantity: 3 },
      { itemId: "item-2", description: "2 suitcases", quantity: 2 },
      { itemId: "item-3", description: "1 bicycle", quantity: 1 },
    ],
    type: "pickup",
    status: OrderStatus.PICKUP_SCHEDULED,
    scheduledAt: "2025-01-20T09:00:00",
    assignedDriverId: "driver-456",
    warehouseLocation: null,
    createdAt: "2025-01-15T10:00:00",
    updatedAt: "2025-01-18T14:30:00",
  },
  picked_up: {
    id: "d8b8c9cf-7a17-4d4c-8b2a-2867ae63084c",
    userId: "user-123",
    items: [
      { itemId: "item-1", description: "3 boxes of books", quantity: 3 },
      { itemId: "item-2", description: "2 suitcases", quantity: 2 },
      { itemId: "item-3", description: "1 bicycle", quantity: 1 },
    ],
    type: "pickup",
    status: OrderStatus.PICKED_UP,
    scheduledAt: "2025-01-20T09:00:00",
    assignedDriverId: "driver-456",
    warehouseLocation: null,
    createdAt: "2025-01-15T10:00:00",
    updatedAt: "2025-01-20T09:30:00",
  },
  stored: {
    id: "d8b8c9cf-7a17-4d4c-8b2a-2867ae63084c",
    userId: "user-123",
    items: [
      { itemId: "item-1", description: "3 boxes of books", quantity: 3 },
      { itemId: "item-2", description: "2 suitcases", quantity: 2 },
      { itemId: "item-3", description: "1 bicycle", quantity: 1 },
    ],
    type: "pickup",
    status: OrderStatus.STORED,
    scheduledAt: "2025-01-20T09:00:00",
    assignedDriverId: "driver-456",
    warehouseLocation: "Warehouse A, Section B, Shelf 3",
    createdAt: "2025-01-15T10:00:00",
    updatedAt: "2025-01-20T10:15:00",
  },
};

const getStatusDisplayName = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PICKUP_REQUEST]: "Pickup Requested",
    [OrderStatus.PICKUP_CONFIRMED]: "Pickup Confirmed",
    [OrderStatus.PICKUP_TIME_CONFIRMED]: "Pickup Time Confirmed",
    [OrderStatus.PICKUP_SCHEDULED]: "Pickup Scheduled",
    [OrderStatus.PICKED_UP]: "Picked Up",
    [OrderStatus.STORED]: "Stored",
    [OrderStatus.DELIVERY_REQUEST]: "Delivery Requested",
    [OrderStatus.DELIVERY_REQUEST_CONFIRMED]: "Delivery Confirmed",
    [OrderStatus.DELIVERY_SCHEDULED]: "Delivery Scheduled",
    [OrderStatus.DELIVERED]: "Delivered",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    [OrderStatus.PICKUP_REQUEST]: "bg-yellow-100 text-yellow-800",
    [OrderStatus.PICKUP_CONFIRMED]: "bg-blue-100 text-blue-800",
    [OrderStatus.PICKUP_TIME_CONFIRMED]: "bg-blue-100 text-blue-800",
    [OrderStatus.PICKUP_SCHEDULED]: "bg-purple-100 text-purple-800",
    [OrderStatus.PICKED_UP]: "bg-indigo-100 text-indigo-800",
    [OrderStatus.STORED]: "bg-green-100 text-green-800",
    [OrderStatus.DELIVERY_REQUEST]: "bg-yellow-100 text-yellow-800",
    [OrderStatus.DELIVERY_REQUEST_CONFIRMED]: "bg-blue-100 text-blue-800",
    [OrderStatus.DELIVERY_SCHEDULED]: "bg-purple-100 text-purple-800",
    [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

export default function PickupWorkflowDemoPage() {
  const router = useRouter();
  
  // Demo mode selector
  const [demoMode, setDemoMode] = useState<"scheduled" | "picked_up" | "stored">("scheduled");
  const [order, setOrder] = useState<Order>(MOCK_ORDERS[demoMode]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Helper function to normalize status (lowercase, no underscores)
  // Maps PICKED_UP -> pickedup (lowercase, no underscore)
  const normalizeStatus = (status: OrderStatus | string | undefined): string => {
    if (!status) return '';
    // Normalize: convert to lowercase and remove underscores
    // Example: PICKED_UP -> picked_up -> pickedup
    return status.toString().toLowerCase().replace(/_/g, '');
  };

  // Helper function to compare statuses (case-insensitive, handles underscores)
  const isStatusEqual = (status1: OrderStatus | string | undefined, status2: OrderStatus): boolean => {
    if (!status1) return false;
    return normalizeStatus(status1) === normalizeStatus(status2);
  };

  // Show notification
  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Update order when demo mode changes
  React.useEffect(() => {
    setOrder(MOCK_ORDERS[demoMode]);
  }, [demoMode]);

  const getWorkflowSteps = (): WorkflowStep[] => {
    if (!order) return [];

    const currentStatus = order.status;
    
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
        ].includes(currentStatus),
        current: currentStatus === OrderStatus.PICKUP_REQUEST,
        canAction: false,
      },
      {
        status: OrderStatus.PICKUP_CONFIRMED,
        label: "Pickup Confirmed",
        description: "Admin has confirmed your pickup request",
        completed: [
          OrderStatus.PICKUP_TIME_CONFIRMED,
          OrderStatus.PICKUP_SCHEDULED,
          OrderStatus.PICKED_UP,
          OrderStatus.STORED,
        ].includes(currentStatus),
        current: currentStatus === OrderStatus.PICKUP_CONFIRMED,
        canAction: false,
      },
      {
        status: OrderStatus.PICKUP_TIME_CONFIRMED,
        label: "Time Confirmed",
        description: "Pickup time slot has been confirmed",
        completed: [
          OrderStatus.PICKUP_SCHEDULED,
          OrderStatus.PICKED_UP,
          OrderStatus.STORED,
        ].includes(currentStatus),
        current: currentStatus === OrderStatus.PICKUP_TIME_CONFIRMED,
        canAction: false,
      },
      {
        status: OrderStatus.PICKUP_SCHEDULED,
        label: "Pickup Scheduled",
        description: "Pickup has been scheduled with driver",
        completed: [
          OrderStatus.PICKED_UP,
          OrderStatus.STORED,
        ].includes(currentStatus),
        current: currentStatus === OrderStatus.PICKUP_SCHEDULED,
        canAction: currentStatus === OrderStatus.PICKUP_SCHEDULED,
      },
      {
        status: OrderStatus.PICKED_UP,
        label: "Picked Up",
        description: "Items have been collected from your location",
        completed: OrderStatus.STORED === currentStatus,
        current: currentStatus === OrderStatus.PICKED_UP,
        canAction: false, // Users can only view, admin will mark as stored
      },
      {
        status: OrderStatus.STORED,
        label: "Stored in Warehouse",
        description: "Items are safely stored in our warehouse",
        completed: true,
        current: currentStatus === OrderStatus.STORED,
        canAction: false,
      },
    ];

    return steps;
  };

  const handleCompletePickup = () => {
    // Hardcoded update - no API call, no delay
    const updatedOrder: Order = {
      ...order,
      status: OrderStatus.PICKED_UP,
      updatedAt: new Date().toISOString(),
    };
    
    setOrder(updatedOrder);
    setShowCompleteModal(false);
    setDemoMode("picked_up");
    showNotification("Pickup marked as completed!", "success");
  };

  // Note: handleStorePickup removed - only admin can mark items as stored
  // Users can only view the status

  const steps = getWorkflowSteps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
      <Hero
        backgroundImage="/household-storage-service.webp"
        headline="Pickup Workflow Demo"
        bodyText="Interactive demo - No API calls required"
        height="compact"
      />

      {/* Demo Mode Selector */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">🎨 Demo Mode</h3>
              <p className="text-sm text-yellow-800">Select a status to see different workflow states</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDemoMode("scheduled")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  demoMode === "scheduled"
                    ? "bg-yellow-600 text-white shadow-md"
                    : "bg-white text-yellow-800 border border-yellow-300 hover:bg-yellow-100"
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setDemoMode("picked_up")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  demoMode === "picked_up"
                    ? "bg-yellow-600 text-white shadow-md"
                    : "bg-white text-yellow-800 border border-yellow-300 hover:bg-yellow-100"
                }`}
              >
                Picked Up
              </button>
              <button
                onClick={() => setDemoMode("stored")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  demoMode === "stored"
                    ? "bg-yellow-600 text-white shadow-md"
                    : "bg-white text-yellow-800 border border-yellow-300 hover:bg-yellow-100"
                }`}
              >
                Stored
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {notification.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup Order</h2>
              <p className="text-sm text-gray-600">Order ID: {order.id.slice(0, 8)}...</p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusDisplayName(order.status)}
            </span>
          </div>

          {/* Items List */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Items:</h3>
            <ul className="space-y-1">
              {order.items.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  • {item.description} (Qty: {item.quantity})
                </li>
              ))}
            </ul>
          </div>

          {order.scheduledAt && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Scheduled:</span>{" "}
                {new Date(order.scheduledAt).toLocaleString()}
              </p>
            </div>
          )}

          {order.warehouseLocation && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                <span className="font-semibold">Warehouse Location:</span> {order.warehouseLocation}
              </p>
            </div>
          )}
        </div>

        {/* Workflow Steps */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Workflow Progress</h3>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.status} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-6 top-12 w-0.5 h-full ${
                      step.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                    style={{ height: "calc(100% + 1.5rem)" }}
                  />
                )}

                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      step.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : step.current
                        ? "bg-[#f8992f] border-[#f8992f] text-white"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4
                          className={`text-lg font-semibold ${
                            step.completed || step.current ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>

                      {/* Action Button - Only for driver actions */}
                      {step.canAction && (
                        <button
                          onClick={() => {
                            if (step.status === OrderStatus.PICKUP_SCHEDULED) {
                              setShowCompleteModal(true);
                            }
                            // Note: "Mark as Stored" removed - only admin can do this
                          }}
                          className="px-4 py-2 bg-[#f8992f] hover:bg-[#d8852a] text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          {step.status === OrderStatus.PICKUP_SCHEDULED
                            ? "Mark as Picked Up"
                            : "Action"}
                        </button>
                      )}
                      
                      {/* Info message for PICKED_UP status */}
                      {isStatusEqual(step.status, OrderStatus.PICKED_UP) && 
                       isStatusEqual(order.status, OrderStatus.PICKED_UP) && (
                        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                          <p className="text-xs text-blue-800">
                            <span className="font-semibold">Note:</span> Items are being transported to warehouse. Admin will mark as stored once items are received.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complete Pickup Modal */}
        {showCompleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Pickup</h3>
              <p className="text-gray-600 mb-6">
                Mark this pickup as completed. This will update the status to &quot;Picked Up&quot;.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompletePickup}
                  className="flex-1 px-4 py-2 bg-[#f8992f] hover:bg-[#d8852f] text-white rounded-lg font-medium transition-colors"
                >
                  Complete Pickup
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            ← Back
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

