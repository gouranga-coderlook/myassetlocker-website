"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  valetStorageService,
  type Order,
  type WorkflowLog,
  OrderStatus,
  getStatusDisplayName,
  getStatusColor,
} from "@/lib/api/valetStorageService";
import toast from "react-hot-toast";
import AuthLoadingView from "@/components/AuthLoadingView";
import { useAuth } from "@/lib/hooks/useAuth";

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { authHydrated } = useAuth();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const hasRedirectedForAuth = useRef(false);

  const [order, setOrder] = useState<Order | null>(null);
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingTime, setConfirmingTime] = useState(false);
  const [timeToConfirm, setTimeToConfirm] = useState("");

  useEffect(() => {
    if (!authHydrated || userId) return;
    if (hasRedirectedForAuth.current) return;
    hasRedirectedForAuth.current = true;
    toast.error("Please sign in to view order status");
    sessionStorage.setItem("authReturnUrl", `/valet-storage/orders/${orderId}`);
    sessionStorage.setItem("openAuthPopup", "true");
    router.replace("/");
  }, [authHydrated, userId, router, orderId]);

  useEffect(() => {
    if (!authHydrated || !userId) return;
    loadOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHydrated, userId, orderId]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      // Try to determine order type from status or try both
      const pickupOrder = await valetStorageService.getOrderById(orderId, "pickup");
      const deliveryOrder = await valetStorageService.getOrderById(orderId, "delivery");

      const foundOrder = pickupOrder || deliveryOrder;
      
      if (!foundOrder) {
        toast.error("Order not found");
        router.push("/valet-storage/orders");
        return;
      }

      setOrder(foundOrder);

      // Load workflow logs
      const orderLogs = await valetStorageService.getOrderLogs(orderId, foundOrder.type);
      setLogs(orderLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPickupTime = async () => {
    if (!timeToConfirm) {
      toast.error("Please select a pickup time");
      return;
    }

    setConfirmingTime(true);
    try {
      await valetStorageService.confirmPickupTime(orderId, {
        scheduledAt: new Date(timeToConfirm).toISOString(),
      });
      toast.success("Pickup time confirmed!");
      loadOrder(); // Reload order to get updated status
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to confirm pickup time");
    } finally {
      setConfirmingTime(false);
    }
  };

  const getWorkflowSteps = () => {
    if (!order) return [];

    const isPickup = order.type === "pickup";
    
    if (isPickup) {
      return [
        { status: OrderStatus.PICKUP_REQUEST, label: "Request Submitted", icon: "📝" },
        { status: OrderStatus.PICKUP_CONFIRMED, label: "Request Confirmed", icon: "✅" },
        { status: OrderStatus.PICKUP_TIME_CONFIRMED, label: "Time Confirmed", icon: "🕐" },
        { status: OrderStatus.PICKUP_SCHEDULED, label: "Scheduled", icon: "📅" },
        { status: OrderStatus.PICKED_UP, label: "Picked Up", icon: "🚚" },
        { status: OrderStatus.STORED, label: "Stored", icon: "📦" },
      ];
    } else {
      return [
        { status: OrderStatus.DELIVERY_REQUEST, label: "Request Submitted", icon: "📝" },
        { status: OrderStatus.DELIVERY_REQUEST_CONFIRMED, label: "Request Confirmed", icon: "✅" },
        { status: OrderStatus.DELIVERY_SCHEDULED, label: "Scheduled", icon: "📅" },
        { status: OrderStatus.DELIVERED, label: "Delivered", icon: "🎉" },
      ];
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    const steps = getWorkflowSteps();
    return steps.findIndex((step) => step.status === order.status);
  };

  if (!authHydrated) {
    return (
      <AuthLoadingView
        headline="Order Status"
        bodyText="View your order details"
      />
    );
  }
  if (!userId) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const steps = getWorkflowSteps();
  const currentStepIndex = getCurrentStepIndex();
  const canConfirmTime = order.status === OrderStatus.PICKUP_CONFIRMED && order.type === "pickup";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/valet-storage/orders")}
            className="text-primary-600 hover:text-primary-700 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {order.type === "pickup" ? "Pickup" : "Delivery"} Order Status
              </h1>
              <p className="text-gray-600">Order ID: {order.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusDisplayName(order.status)}
            </span>
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Progress</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200">
              <div
                className="absolute top-0 w-0.5 bg-primary-600 transition-all duration-500"
                style={{
                  height: currentStepIndex >= 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : "0%",
                }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isCompleted = currentStepIndex > index;
                const isCurrent = currentStepIndex === index;

                return (
                  <div key={step.status} className="relative flex items-start">
                    <div
                      className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                        isCompleted
                          ? "bg-primary-600 border-primary-600 text-white"
                          : isCurrent
                          ? "bg-white border-primary-600 text-primary-600 ring-4 ring-primary-100"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      <span className="text-xl">{step.icon}</span>
                    </div>
                    <div className="ml-4 flex-1 pt-2">
                      <h3
                        className={`text-base font-medium ${
                          isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </h3>
                      {isCurrent && order.scheduledAt && (
                        <p className="text-sm text-gray-600 mt-1">
                          Scheduled: {new Date(order.scheduledAt).toLocaleString()}
                        </p>
                      )}
                      {isCurrent && order.assignedDriverId && (
                        <p className="text-sm text-gray-600 mt-1">
                          Driver assigned
                        </p>
                      )}
                      {isCompleted && logs.find((log) => log.status === step.status) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(
                            logs.find((log) => log.status === step.status)!.timestamp
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Confirm Pickup Time (if applicable) */}
        {canConfirmTime && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Pickup Time</h2>
            <div className="flex gap-4">
              <input
                type="datetime-local"
                value={timeToConfirm}
                onChange={(e) => setTimeToConfirm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min={new Date().toISOString().slice(0, 16)}
              />
              <button
                onClick={handleConfirmPickupTime}
                disabled={confirmingTime || !timeToConfirm}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {confirmingTime ? "Confirming..." : "Confirm Time"}
              </button>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Order Type</h3>
              <p className="text-gray-900 capitalize">{order.type}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
              <p className="text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            {order.scheduledAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Scheduled</h3>
                <p className="text-gray-900">{new Date(order.scheduledAt).toLocaleString()}</p>
              </div>
            )}

            {order.warehouseLocation && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Warehouse Location</h3>
                <p className="text-gray-900">{order.warehouseLocation}</p>
              </div>
            )}

            {order.bookingId && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Related Booking</h3>
                <button
                  onClick={() => router.push(`/bookings/${order.bookingId}`)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  View Booking #{order.bookingId.slice(0, 8)}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900 font-medium">{item.description}</p>
                    {item.itemId && (
                      <p className="text-sm text-gray-500">ID: {item.itemId}</p>
                    )}
                  </div>
                  <span className="text-gray-600">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Request Delivery Button (if stored) */}
        {order.status === OrderStatus.STORED && order.type === "pickup" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready for Delivery</h3>
                <p className="text-sm text-gray-600">Your items are stored and ready to be delivered back to you.</p>
              </div>
              <button
                onClick={() => router.push(`/valet-storage/delivery?orderId=${order.id}`)}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
              >
                Request Delivery
              </button>
            </div>
          </div>
        )}

        {/* Activity Log */}
        {logs.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Log</h2>
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start border-l-2 border-gray-200 pl-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(log.status)}`}>
                        {getStatusDisplayName(log.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {log.note && (
                      <p className="text-sm text-gray-600 mt-1">{log.note}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Changed by: {log.changedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

