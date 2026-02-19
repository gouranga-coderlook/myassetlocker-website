"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  valetStorageService,
  type Order,
  getStatusDisplayName,
  getStatusColor,
} from "@/lib/api/valetStorageService";
import toast from "react-hot-toast";
import AuthLoadingView from "@/components/AuthLoadingView";
import { useAuth } from "@/lib/hooks/useAuth";

export default function OrdersListPage() {
  const router = useRouter();
  const { authHydrated } = useAuth();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const hasRedirectedForAuth = useRef(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pickup" | "delivery">("all");

  useEffect(() => {
    if (!authHydrated || userId) return;
    if (hasRedirectedForAuth.current) return;
    hasRedirectedForAuth.current = true;
    toast.error("Please sign in to view your orders");
    sessionStorage.setItem("authReturnUrl", "/valet-storage/orders");
    sessionStorage.setItem("openAuthPopup", "true");
    router.replace("/");
  }, [authHydrated, userId, router]);

  useEffect(() => {
    if (!authHydrated || !userId) return;
    loadOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHydrated, userId]);

  const loadOrders = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const userOrders = await valetStorageService.getUserOrders(userId);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.type === filter;
  });

  if (!authHydrated) {
    return (
      <AuthLoadingView
        headline="My Orders"
        bodyText="Track your pickup and delivery requests"
      />
    );
  }
  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">Track your pickup and delivery requests</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/valet-storage/pickup")}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
              >
                New Pickup
              </button>
              <button
                onClick={() => router.push("/valet-storage/delivery")}
                className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg font-medium"
              >
                Request Delivery
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter("pickup")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "pickup"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Pickups
            </button>
            <button
              onClick={() => setFilter("delivery")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "delivery"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Deliveries
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't created any pickup or delivery requests yet."
                : `You haven't created any ${filter} requests yet.`}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push("/valet-storage/pickup")}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
              >
                Create Pickup Request
              </button>
              <button
                onClick={() => router.push("/valet-storage/delivery")}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Request Delivery
              </button>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/valet-storage/orders/${order.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.type === "pickup" ? "Pickup" : "Delivery"} Order
                      </h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusDisplayName(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Order ID: {order.id.slice(0, 8)}...</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Items</p>
                    <div className="space-y-1">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-900">
                          • {item.description} (Qty: {item.quantity})
                        </p>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{order.items.length - 3} more item(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {order.scheduledAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Scheduled</p>
                      <p className="text-sm text-gray-900">
                        {new Date(order.scheduledAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {order.warehouseLocation && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-gray-900">{order.warehouseLocation}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/valet-storage/orders/${order.id}`);
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    View Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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

