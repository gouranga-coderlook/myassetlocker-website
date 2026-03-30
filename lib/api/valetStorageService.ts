// lib/api/valetStorageService.ts
import { apiClient, type CommonResponse } from "./authService";

// Order Status Enum (matching backend)
export enum OrderStatus {
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

// Order Type
export type OrderType = "pickup" | "delivery";

// Order Item
export interface OrderItem {
  itemId: string;
  description: string;
  quantity: number;
}

// Order
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  type: OrderType;
  status: OrderStatus;
  scheduledAt: string | null;
  assignedDriverId: string | null;
  warehouseLocation: string | null;
  createdAt: string;
  updatedAt: string;
  bookingId?: string; // Link to booking if applicable
}

// Workflow Log
export interface WorkflowLog {
  id: string;
  orderId: string;
  status: OrderStatus;
  changedBy: string;
  timestamp: string;
  note: string | null;
}

// Create Pickup Request
export interface CreatePickupRequest {
  // userId is now extracted from authentication token, not required in request
  bookingId: string; // Required: link to existing booking
  address?: string; // Optional: pickup address
  notes?: string; // Optional: notes
  slotId?: string; // Optional: time slot ID (will be set on booking table)
  preferredTimeSlotId?: string; // Deprecated: use slotId instead (kept for backward compatibility)
}

// Create Delivery Request
export interface CreateDeliveryRequest {
  userId: string;
  parentBookingId: string; // The stored booking ID (pickup booking that reached 'stored' status)
  address?: string; // Delivery address
  notes?: string; // Optional notes
  preferredTimeSlotId?: string; // Optional preferred time slot ID
}

// Confirm Pickup Time Request
export interface ConfirmPickupTimeRequest {
  scheduledAt: string; // ISO date string
}

// Time Slot
export interface TimeSlot {
  id: string;
  slotDate: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  slotType: "pickup" | "delivery" | "all";
  available: boolean;
  bookedCount: number;
  maxCapacity: number;
  createdAt: string;
  updatedAt: string;
}

/** Minimal shape of booking in pickup/delivery API responses */
interface BookingResponse {
  id?: string;
  bookingId?: string;
}

interface OrderResponse {
  id: string;
  userId: string;
  items: OrderItem[];
  type: OrderType;
  status: string;
  scheduledAt: string | null;
  assignedDriverId: string | null;
  warehouseLocation: string | null;
  createdAt: string;
  updatedAt: string;
  bookingId?: string;
}

interface WorkflowLogResponse {
  id: string;
  orderId: string;
  status: string;
  changedBy: string;
  timestamp: string;
  note: string | null;
}

// Some backend responses may return an address *object* here instead of a string.
// React will throw at runtime if we try to render that object directly.
const formatAddressToLine = (address: unknown): string => {
  if (!address) return "";
  if (typeof address === "string") return address;

  if (typeof address === "object") {
    const a = address as Partial<{
      streetAddress1: string;
      streetAddress2: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    }>;

    const street = [a.streetAddress1, a.streetAddress2]
      .filter(Boolean)
      .map((s) => s?.trim())
      .filter(Boolean)
      .join(" ");

    const cityStateZip = [a.city, [a.state, a.zipCode].filter(Boolean).join(" ")]
      .filter(Boolean)
      .map((s) => s?.trim())
      .filter(Boolean)
      .join(", ");

    const country = a.country?.trim();

    return [street, cityStateZip, country].filter(Boolean).join(" ");
  }

  return "";
};

const normalizeWarehouseLocation = (value: unknown): string | null => {
  const line = formatAddressToLine(value);
  return line ? line : null;
};

/**
 * Valet Storage Service
 * Handles pickup and delivery requests for valet storage
 */
export const valetStorageService = {
  /**
   * Create a pickup request
   * POST /pickup/request
   * Returns BookingDto from backend
   */
  async createPickupRequest(
    request: CreatePickupRequest
  ): Promise<{ bookingId: string }> {
    try {
      const response = await apiClient.post<CommonResponse<BookingResponse>>(
        "/pickup/request",
        request
      );

      if (response.data.success && response.data.data) {
        // Backend returns BookingDto, extract the ID
        const booking = response.data.data;
        return { bookingId: booking.id ?? booking.bookingId ?? request.bookingId };
      }

      throw new Error(response.data.message || "Failed to create pickup request");
    } catch (error) {
      console.error("Error creating pickup request:", error);
      throw error;
    }
  },

  /**
   * Create a delivery request
   * POST /delivery/request
   */
  async createDeliveryRequest(
    request: CreateDeliveryRequest
  ): Promise<{ orderId: string; bookingId: string }> {
    try {
      const response = await apiClient.post<CommonResponse<BookingResponse>>(
        "/delivery/request",
        request
      );

      if (response.data.success && response.data.data) {
        // Backend returns BookingDto, extract the ID
        const booking = response.data.data;
        const id = booking.id ?? booking.bookingId ?? request.parentBookingId;
        return { orderId: id, bookingId: id };
      }

      throw new Error(response.data.message || "Failed to create delivery request");
    } catch (error) {
      console.error("Error creating delivery request:", error);
      throw error;
    }
  },

  /**
   * Confirm pickup time (user confirms or adjusts scheduled time)
   * PATCH /pickup/:id/time-confirm
   */
  async confirmPickupTime(
    pickupId: string,
    request: ConfirmPickupTimeRequest
  ): Promise<{ status: OrderStatus }> {
    try {
      const response = await apiClient.patch<CommonResponse<{ status: string }>>(
        `/pickup/${pickupId}/time-confirm`,
        request
      );

      if (response.data.success && response.data.data) {
        return {
          status: response.data.data.status as OrderStatus,
        };
      }

      throw new Error(response.data.message || "Failed to confirm pickup time");
    } catch (error) {
      console.error("Error confirming pickup time:", error);
      throw error;
    }
  },

  /**
   * Get user's orders (pickup and delivery)
   * GET /pickup/user/:userId or GET /orders/user/:userId
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      // Assuming there's an endpoint to get all user orders
      // If not, we might need separate calls for pickup and delivery
      const response = await apiClient.get<CommonResponse<OrderResponse[]>>(
        `/orders/user/${userId}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data.map((order) => ({
          ...order,
          warehouseLocation: normalizeWarehouseLocation(order.warehouseLocation),
          status: order.status as OrderStatus,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching user orders:", error);
      // Fallback: try separate endpoints if combined endpoint doesn't exist
      try {
        const [pickupResponse, deliveryResponse] = await Promise.all([
          apiClient.get<CommonResponse<OrderResponse[]>>(`/pickup/user/${userId}`).catch(() => ({ data: { success: false, data: [] } })),
          apiClient.get<CommonResponse<OrderResponse[]>>(`/delivery/user/${userId}`).catch(() => ({ data: { success: false, data: [] } })),
        ]);

        const orders: Order[] = [];

        if (pickupResponse.data.success && pickupResponse.data.data) {
          orders.push(...pickupResponse.data.data.map((o) => ({
            ...o,
            warehouseLocation: normalizeWarehouseLocation(o.warehouseLocation),
            status: o.status as OrderStatus,
            type: "pickup" as OrderType,
          })));
        }

        if (deliveryResponse.data.success && deliveryResponse.data.data) {
          orders.push(...deliveryResponse.data.data.map((o) => ({
            ...o,
            warehouseLocation: normalizeWarehouseLocation(o.warehouseLocation),
            status: o.status as OrderStatus,
            type: "delivery" as OrderType,
          })));
        }

        return orders;
      } catch (fallbackError) {
        console.error("Error in fallback order fetch:", fallbackError);
        return [];
      }
    }
  },

  /**
   * Get order by ID
   * GET /pickup/:id or GET /delivery/:id
   */
  async getOrderById(orderId: string, type: OrderType): Promise<Order | null> {
    try {
      const endpoint = type === "pickup" ? `/pickup/${orderId}` : `/delivery/${orderId}`;
      const response = await apiClient.get<CommonResponse<OrderResponse>>(endpoint);

      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          warehouseLocation: normalizeWarehouseLocation(response.data.data.warehouseLocation),
          status: response.data.data.status as OrderStatus,
          type,
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },

  /**
   * Get workflow logs for an order
   * GET /orders/:id/logs or GET /pickup/:id/logs
   */
  async getOrderLogs(orderId: string, type: OrderType): Promise<WorkflowLog[]> {
    try {
      const endpoint = type === "pickup" 
        ? `/pickup/${orderId}/logs` 
        : `/delivery/${orderId}/logs`;
      
      const response = await apiClient.get<CommonResponse<WorkflowLogResponse[]>>(
        endpoint
      );

      if (response.data.success && response.data.data) {
        return response.data.data.map((log) => ({
          ...log,
          status: log.status as OrderStatus,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching order logs:", error);
      return [];
    }
  },

  /**
   * Get stored orders (orders that can be delivered)
   * GET /pickup/user/:userId?status=stored
   */
  async getStoredOrders(userId: string): Promise<Order[]> {
    try {
      const response = await apiClient.get<CommonResponse<OrderResponse[]>>(
        `/pickup/user/${userId}?status=stored`
      );

      if (response.data.success && response.data.data) {
        return response.data.data.map((order) => ({
          ...order,
          status: order.status as OrderStatus,
          type: "pickup" as OrderType,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching stored orders:", error);
      return [];
    }
  },

  /**
   * Get available time slots
   * GET /time-slots?slotDate=YYYY-MM-DD&slotType=pickup&available=true
   */
  async getAvailableTimeSlots(
    slotDate?: string,
    slotType: "pickup" | "delivery" | "all" = "pickup",
    available: boolean = true
  ): Promise<TimeSlot[]> {
    try {
      const params = new URLSearchParams();
      if (slotDate) params.append("slotDate", slotDate);
      params.append("slotType", slotType);
      params.append("available", available.toString());

      const response = await apiClient.get<CommonResponse<TimeSlot[]>>(
        `/time-slots?${params.toString()}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || "Failed to fetch available time slots");
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      throw error;
    }
  },

  /**
   * Complete pickup - Driver marks items as picked up
   * PATCH /pickup/{id}/complete
   * Transitions status from PICKUP_SCHEDULED to PICKED_UP
   */
  async completePickup(
    pickupId: string,
    completedBy?: string
  ): Promise<Order> {
    try {
      const requestBody = completedBy ? { completedBy } : {};
      const response = await apiClient.patch<CommonResponse<OrderResponse>>(
        `/pickup/${pickupId}/complete`,
        requestBody
      );

      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          status: response.data.data.status as OrderStatus,
        };
      }

      throw new Error(response.data.message || "Failed to complete pickup");
    } catch (error) {
      console.error("Error completing pickup:", error);
      throw error;
    }
  },

  /**
   * Store pickup - Warehouse/admin marks items as stored
   * PATCH /pickup/{id}/store
   * Transitions status from PICKED_UP to STORED
   */
  async storePickup(
    pickupId: string,
    warehouseLocation: string,
    storedBy?: string
  ): Promise<Order> {
    try {
      const requestBody: { warehouseLocation: string; storedBy?: string } = {
        warehouseLocation,
      };
      if (storedBy) {
        requestBody.storedBy = storedBy;
      }

      const response = await apiClient.patch<CommonResponse<OrderResponse>>(
        `/pickup/${pickupId}/store`,
        requestBody
      );

      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          status: response.data.data.status as OrderStatus,
        };
      }

      throw new Error(response.data.message || "Failed to store pickup");
    } catch (error) {
      console.error("Error storing pickup:", error);
      throw error;
    }
  },

  /**
   * Get delivery by ID
   * GET /delivery/{id} or GET /bookings/{id} (if delivery is a booking)
   */
  async getDeliveryById(deliveryId: string): Promise<Order | null> {
    try {
      const response = await apiClient.get<CommonResponse<OrderResponse>>(
        `/delivery/${deliveryId}`
      );

      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          status: response.data.data.status as OrderStatus,
          type: "delivery",
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching delivery:", error);
      return null;
    }
  },

  /**
   * Confirm delivery request - Admin confirms delivery request
   * PATCH /delivery/{bookingId}/confirm
   */
  async confirmDelivery(deliveryId: string, confirmedBy?: string): Promise<Order> {
    try {
      const requestBody = confirmedBy ? { confirmedBy } : {};
      const response = await apiClient.patch<CommonResponse<OrderResponse>>(
        `/delivery/${deliveryId}/confirm`,
        requestBody
      );

      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          status: response.data.data.status as OrderStatus,
        };
      }

      throw new Error(response.data.message || "Failed to confirm delivery");
    } catch (error) {
      console.error("Error confirming delivery:", error);
      throw error;
    }
  },

  /**
   * Schedule delivery - Admin schedules delivery with driver
   * PATCH /delivery/{bookingId}/schedule
   */
  async scheduleDelivery(
    deliveryId: string,
    request: {
      timeSlotId?: string;
      driverId?: string;
      warehouseId?: string;
      scheduledAt?: string;
      notes?: string;
    }
  ): Promise<Order> {
    try {
      const response = await apiClient.patch<CommonResponse<OrderResponse>>(
        `/delivery/${deliveryId}/schedule`,
        request
      );

      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          status: response.data.data.status as OrderStatus,
        };
      }

      throw new Error(response.data.message || "Failed to schedule delivery");
    } catch (error) {
      console.error("Error scheduling delivery:", error);
      throw error;
    }
  },

  /**
   * Complete delivery - Driver marks delivery as completed
   * PATCH /delivery/{bookingId}/complete
   */
  async completeDelivery(deliveryId: string, deliveredBy?: string): Promise<Order> {
    try {
      const requestBody = deliveredBy ? { deliveredBy } : {};
      const response = await apiClient.patch<CommonResponse<OrderResponse>>(
        `/delivery/${deliveryId}/complete`,
        requestBody
      );

      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          status: response.data.data.status as OrderStatus,
        };
      }

      throw new Error(response.data.message || "Failed to complete delivery");
    } catch (error) {
      console.error("Error completing delivery:", error);
      throw error;
    }
  },
};

/**
 * Helper function to get status display name
 */
export function getStatusDisplayName(status: OrderStatus): string {
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
}

/**
 * Helper function to get status color
 */
export function getStatusColor(status: OrderStatus): string {
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
}

/**
 * Helper function to check if order can transition to next status
 */
export function canTransitionTo(status: OrderStatus, nextStatus: OrderStatus): boolean {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PICKUP_REQUEST]: [OrderStatus.PICKUP_CONFIRMED],
    [OrderStatus.PICKUP_CONFIRMED]: [OrderStatus.PICKUP_TIME_CONFIRMED],
    [OrderStatus.PICKUP_TIME_CONFIRMED]: [OrderStatus.PICKUP_SCHEDULED],
    [OrderStatus.PICKUP_SCHEDULED]: [OrderStatus.PICKED_UP],
    [OrderStatus.PICKED_UP]: [OrderStatus.STORED],
    [OrderStatus.STORED]: [OrderStatus.DELIVERY_REQUEST],
    [OrderStatus.DELIVERY_REQUEST]: [OrderStatus.DELIVERY_REQUEST_CONFIRMED],
    [OrderStatus.DELIVERY_REQUEST_CONFIRMED]: [OrderStatus.DELIVERY_SCHEDULED],
    [OrderStatus.DELIVERY_SCHEDULED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
  };

  return transitions[status]?.includes(nextStatus) || false;
}

