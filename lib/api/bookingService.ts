// lib/api/bookingService.ts
import { apiClient, type CommonResponse } from "./authService";

export interface BookingItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  type: "plan" | "bundle" | "addon" | "protection" | "service";
}

export interface ShipmentDetails {
  type: string;
  scheduledAt?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  timeSlotId?: string;
  preferredTimeSlotId?: string;
  notes?: string;
  requestedAt?: string;
  confirmedAt?: string;
  scheduledAtTimestamp?: string | null;
  deliveredAt?: string | null;
  deliveryAddress?: string | null;
  driver?: {
    id: string;
    name: string;
    phone: string;
    active?: boolean;
    vehicleInfo?: {
      make?: string;
      year?: number;
      color?: string;
      model?: string;
      licensePlate?: string;
    };
  };
  warehouse?: {
    id: string;
    name: string;
    address: string;
    geo?: Record<string, unknown>;
    createdAt?: string;
  };
}

export interface Booking {
  id: string;
  invoiceId: string;
  bookingNumber: string;
  status: string;
  orderStatus?: string; // Order status for valet storage workflow
  startTime?: string; // From /bookings/self (derived from booking.created_at)
  createdAt: string;
  updatedAt: string;
  items: BookingItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  shipmentDetails?: ShipmentDetails;
  // Additional info for display
  bundle?: {
    id: string;
    name: string;
    description: string;
    fromMonth?: string;
    toMonth?: string;
    months?: number;
    bins?: number;
    price: number;
    extras?: string;
  };
  plan?: {
    id: string;
    name: string;
    details?: string;
    durationBins?: number;
    durationMonths?: number;
    price: number;
  };
  savings?: number;
  redeliveryFee?: number;
  zoneDeliveryCharges?: number;
  addonsDeliveryCost?: number;
  addonsCost?: number;
  climateControlCost?: number;
  protectionPlanCost?: number;
}

// API Response Types
interface ApiBookingQuoteSnapshot {
  cartId: string;
  subtotal: number;
  grandTotal: number;
  addonsTotal: number;
  climateTotal: number;
  deliveryTotal: number;
  discountsTotal: number;
  protectionPlanCost: number;
}

interface ApiPlan {
  id: string;
  name: string;
  details: string;
  hasDiscount: boolean;
  discountPercentage: number;
  perBinPrice: number;
}

interface ApiBundle {
  id: string;
  name: string;
  description: string;
  fromMonth: string;
  toMonth: string;
  months: number;
  bins: number;
  price: number;
  extras: string;
}

interface ApiAddon {
  id?: string;
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  amount?: number;
  chargeType?: string;
  recurrence?: string;
  reDeliveryFee?: number;
  premiumFeatures?: boolean;
}

interface ApiProtectionPlan {
  id?: string;
  name?: string;
  description?: string;
}

interface ApiDeliveryInfo {
  city: string;
  email: string;
  phone: string;
  state: string;
  zipCode: string;
  fullName: string;
  deliveryAddress?: string;
  address?: string;
}

interface ApiCart {
  id: string;
  total: number;
  baseStorageCost: number;
  redeliveryFee: number;
  climateControlCost: number;
  addonsCost: number;
  addonsDeliveryCost: number;
  protectionPlanCost: number;
  savings: number;
  zoneDeliveryCharges?: number;
  addons: ApiAddon[];
  bundle: ApiBundle | null;
  plan: ApiPlan;
  protectionPlan: ApiProtectionPlan | null;
  durationMonths: number;
  durationBins: number;
  climateControl: boolean;
  deliveryInfo: ApiDeliveryInfo;
  couponCode: string | null;
}

interface ApiInvoice {
  id: string;
  invoiceDate: string;
  status: string;
  total: number;
  currency: string;
}

interface ApiPayment {
  paymentId: string;
  paymentMethod: string;
  gateway: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string | null;
  paidAt?: string;
}

interface ApiShipmentDetails {
  type: string;
  scheduledAt?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  timeSlotId?: string;
  preferredTimeSlotId?: string;
  notes?: string;
  requestedAt?: string;
  confirmedAt?: string;
  scheduledAtTimestamp?: string | null;
  deliveredAt?: string | null;
  deliveryAddress?: string | null;
  driver?: {
    id: string;
    name: string;
    phone: string;
    active?: boolean;
    vehicleInfo?: {
      make?: string;
      year?: number;
      color?: string;
      model?: string;
      licensePlate?: string;
    };
  };
  warehouse?: {
    id: string;
    name: string;
    address: string;
    geo?: Record<string, unknown>;
    createdAt?: string;
  };
}

interface ApiBooking {
  id: string;
  bookingNumber?: string;
  status?: string;
  orderStatus?: string; // Order status for valet storage workflow
  startTime?: string;
  paymentStatus: string;
  startDate?: string;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  cart: ApiCart;
  invoice?: ApiInvoice;
  invoiceId?: string; // For backward compatibility with list endpoint
  payment?: ApiPayment;
  paymentId?: string; // For backward compatibility
  plan: ApiPlan;
  deliveryInfo?: ApiDeliveryInfo;
  quoteSnapshot: ApiBookingQuoteSnapshot;
  shipmentDetails?: ApiShipmentDetails;
}

export interface BookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Map API payment status to component payment status
 */
function mapPaymentStatus(apiPaymentStatus: string): Booking["paymentStatus"] {
  const paymentStatusMap: Record<string, Booking["paymentStatus"]> = {
    PAID: "paid",
    PENDING: "pending",
    FAILED: "failed",
    REFUNDED: "refunded",
  };
  return paymentStatusMap[apiPaymentStatus.toUpperCase()] || "pending";
}

/**
 * Generate booking number from ID
 */
function generateBookingNumber(id: string): string {
  // Use first 8 characters of UUID and format as BK-XXXX-XXXX
  const shortId = id.replaceAll("-", "")?.substring(0, 8)?.toUpperCase();
  return `BK-${shortId.substring(0, 4)}-${shortId.substring(4, 8)}`;
}

/**
 * Map API status to component status
 */
function mapBookingStatus(apiStatus: string | undefined): Booking["status"] {
  if (!apiStatus) return "pending";
  
  const statusMap: Record<string, Booking["status"]> = {
    DRAFT: "Draft",
    PENDING_PAYMENT: "Pending Payment",
    PAYMENT_IN_PROGRESS: "Payment In Progress",
    ACTIVE: "Active",
    ON_HOLD: "On Hold",
    EXPIRED: "Expired",
    COMPLETED: "Completed",
    BOOKED: "Booked",
    CONFIRMED: "Confirmed",
    PICKED_UP: "Picked Up",
    STORED: "Stored",
    REDELIVERY_REQUESTED: "Redelivery Requested",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    // Legacy lowercase mappings (for backward compatibility)
    active: "confirmed",
    confirmed: "confirmed",
    processing: "processing",
    completed: "completed",
    pending: "pending",
    cancelled: "cancelled",
  };
  
  // Try uppercase first (backend format), then lowercase (legacy)
  return statusMap[apiStatus.toUpperCase()] || statusMap[apiStatus.toLowerCase()] || "pending";
}

/**
 * Transform API booking to component Booking format
 */
function transformApiBooking(apiBooking: ApiBooking): Booking {
  const quote = apiBooking.quoteSnapshot;
  const cart = apiBooking.cart;
  const deliveryInfo = cart.deliveryInfo;
  
  // Calculate tax: grandTotal - (subtotal + addonsTotal + climateTotal + deliveryTotal + protectionPlanCost - discountsTotal)
  // discountsTotal is typically positive (the discount amount), so we subtract it
  const baseAmount = quote.subtotal + quote.addonsTotal + quote.climateTotal + quote.deliveryTotal + quote.protectionPlanCost;
  const discountedAmount = baseAmount - quote.discountsTotal;
  const tax = Math.max(0, quote.grandTotal - discountedAmount);

  // Build items array from cart 0
  const items: BookingItem[] = [];
  
  // Add bundle as an item if present (bundle takes priority over plan)
  if (cart.bundle) {
    items.push({
      id: cart.bundle.id,
      name: cart.bundle.name,
      description: cart.bundle.description,
      quantity: 1,
      price: cart.bundle.price,
      type: "bundle",
    });
  } else if (cart.plan) {
    // Only add plan if no bundle exists
    items.push({
      id: cart.plan.id,
      name: cart.plan.name,
      description: cart.plan.details,
      quantity: cart.durationBins,
      price: cart.baseStorageCost / cart.durationBins,
      type: "plan",
    });
  }

  // Add protection plan as an item if present
  if (cart.protectionPlan) {
    items.push({
      id: cart.protectionPlan.id || "protection",
      name: cart.protectionPlan.name || "Protection Plan",
      description: cart.protectionPlan.description,
      quantity: 1,
      price: cart.protectionPlanCost,
      type: "protection",
    });
  }

  // Add addons as items
  if (cart.addons && cart.addons.length > 0) {
    for (const addon of cart.addons) {
      // Calculate addon price: if monthly recurrence, multiply by duration
      let addonPrice = addon.price || addon.amount || 0;
      if (addon.recurrence === "monthly" && cart.durationMonths > 0) {
        addonPrice = (addon.amount || addon.price || 0) * cart.durationMonths;
      }
      
      items.push({
        id: addon.id || `addon-${items.length}`,
        name: addon.name || "Addon",
        description: addon.description,
        quantity: addon.quantity || 1,
        price: addonPrice,
        type: "addon",
      });
    }
  }

  return {
    id: apiBooking.id,
    invoiceId: apiBooking.invoice?.id || apiBooking.invoiceId || "",
    bookingNumber: generateBookingNumber(apiBooking.id),
    status: mapBookingStatus(apiBooking.status),
    orderStatus: apiBooking.orderStatus || undefined,
    startTime: apiBooking.startTime || undefined,
    createdAt: apiBooking.createdAt || apiBooking.startDate || new Date().toISOString(),
    updatedAt: apiBooking.updatedAt || apiBooking.startDate || new Date().toISOString(),
    items: items,
    subtotal: quote.subtotal,
    tax: tax,
    deliveryFee: cart.redeliveryFee, // Use redeliveryFee from cart
    total: quote.grandTotal,
    deliveryInfo: {
      fullName: deliveryInfo.fullName || "",
      email: deliveryInfo.email || "",
      phone: deliveryInfo.phone || "",
      address: deliveryInfo.address || deliveryInfo.deliveryAddress || "",
      city: deliveryInfo.city || "",
      state: deliveryInfo.state || "",
      zipCode: deliveryInfo.zipCode || "",
    },
    paymentMethod: apiBooking.payment?.paymentMethod,
    paymentStatus: mapPaymentStatus(apiBooking.paymentStatus),
    // Add bundle info if present
    bundle: cart.bundle ? {
      id: cart.bundle.id,
      name: cart.bundle.name,
      description: cart.bundle.description,
      fromMonth: cart.bundle.fromMonth,
      toMonth: cart.bundle.toMonth,
      months: cart.bundle.months,
      bins: cart.bundle.bins,
      price: cart.bundle.price,
      extras: cart.bundle.extras,
    } : undefined,
    // Add plan info
    plan: cart.plan ? {
      id: cart.plan.id,
      name: cart.plan.name,
      details: cart.plan.details,
      durationBins: cart.durationBins,
      durationMonths: cart.durationMonths,
      price: cart.baseStorageCost,
    } : undefined,
    savings: cart.savings ?? 0,
    redeliveryFee: cart.redeliveryFee ?? 0,
    zoneDeliveryCharges: cart.zoneDeliveryCharges ?? 0,
    addonsDeliveryCost: cart.addonsDeliveryCost ?? 0,
    addonsCost: cart.addonsCost ?? 0,
    climateControlCost: cart.climateControlCost ?? 0,
    protectionPlanCost: cart.protectionPlanCost != null ? Number(cart.protectionPlanCost) : 0,
    shipmentDetails: apiBooking.shipmentDetails || undefined,
  };
}

/**
 * Get user's bookings from API
 * GET /bookings/self
 */
export async function getUserBookings(page: number = 1, pageSize: number = 10): Promise<BookingsResponse> {
  try {
    const response = await apiClient.get<ApiBooking[] | CommonResponse<ApiBooking[]>>("/bookings/self");
    
    let bookingsArray: ApiBooking[] = [];
    
    // Handle both direct array response and CommonResponse wrapper
    if (Array.isArray(response.data)) {
      // Direct array response
      bookingsArray = response.data;
    } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      // CommonResponse wrapper
      const commonResponse = response.data as CommonResponse<ApiBooking[]>;
      if (commonResponse.success && Array.isArray(commonResponse.data)) {
        bookingsArray = commonResponse.data;
      } else {
        return { bookings: [], total: 0, page, pageSize };
      }
    } else {
      return { bookings: [], total: 0, page, pageSize };
    }
    
    // Transform and paginate
    const allBookings = bookingsArray
      .map((apiBooking) => {
        try {
          return transformApiBooking(apiBooking);
        } catch (error: unknown) {
          console.error("Error transforming API booking:", error);
          return null;
        }
      })
      .filter((booking) => booking !== null) as Booking[];
    
    // Apply client-side pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedBookings = allBookings.slice(startIndex, endIndex);

    return {
      bookings: paginatedBookings,
      total: allBookings.length,
      page,
      pageSize,
    };
  } catch (error: unknown) {
    console.error("Error fetching user bookings:", error);
    return { bookings: [], total: 0, page, pageSize };
  }
}

/**
 * Transform API booking detail response to component Booking format
 */
function transformApiBookingDetail(apiBooking: ApiBooking): Booking {
  const quote = apiBooking.quoteSnapshot;
  const cart = apiBooking.cart;
  const deliveryInfo = apiBooking.deliveryInfo || cart.deliveryInfo;
  
  // Calculate tax: grandTotal - (subtotal + addonsTotal + climateTotal + deliveryTotal + protectionPlanCost - discountsTotal)
  const baseAmount = quote.subtotal + quote.addonsTotal + quote.climateTotal + quote.deliveryTotal + quote.protectionPlanCost;
  const discountedAmount = baseAmount - quote.discountsTotal;
  const tax = Math.max(0, quote.grandTotal - discountedAmount);

  // Build items array from cart
  const items: BookingItem[] = [];
  
  // Add bundle as an item if present (bundle takes priority over plan)
  if (cart.bundle) {
    items.push({
      id: cart.bundle.id,
      name: cart.bundle.name,
      description: cart.bundle.description,
      quantity: 1,
      price: cart.bundle.price,
      type: "bundle",
    });
  } else if (apiBooking.plan) {
    // Only add plan if no bundle exists
    items.push({
      id: apiBooking.plan.id,
      name: apiBooking.plan.name,
      description: apiBooking.plan.details,
      quantity: cart.durationBins,
      price: cart.baseStorageCost / (cart.durationBins || 1),
      type: "plan",
    });
  }

  // Add protection plan as an item if present
  if (cart.protectionPlan) {
    items.push({
      id: cart.protectionPlan.id || "protection",
      name: cart.protectionPlan.name || "Protection Plan",
      description: cart.protectionPlan.description,
      quantity: 1,
      price: cart.protectionPlanCost,
      type: "protection",
    });
  }

  // Add addons as items
  if (cart.addons && cart.addons.length > 0) {
    for (const addon of cart.addons) {
      // Calculate addon price: if monthly recurrence, multiply by duration
      let addonPrice = addon.price || addon.amount || 0;
      if (addon.recurrence === "monthly" && cart.durationMonths > 0) {
        addonPrice = (addon.amount || addon.price || 0) * cart.durationMonths;
      }
      
      items.push({
        id: addon.id || `addon-${items.length}`,
        name: addon.name || "Addon",
        description: addon.description,
        quantity: addon.quantity || 1,
        price: addonPrice,
        type: "addon",
      });
    }
  }

  if (!apiBooking.invoice?.id && !apiBooking.invoiceId) {
    throw new Error("Invoice ID is required");
  }

  return {
    id: apiBooking.id,
    invoiceId: apiBooking.invoice?.id || apiBooking.invoiceId || "",
    bookingNumber: apiBooking.bookingNumber || generateBookingNumber(apiBooking.id),
    status: mapBookingStatus(apiBooking.status),
    orderStatus: apiBooking.orderStatus || undefined,
    startTime: apiBooking.startTime || undefined,
    createdAt: apiBooking.createdAt || apiBooking.startDate || new Date().toISOString(),
    updatedAt: apiBooking.updatedAt || apiBooking.startDate || new Date().toISOString(),
    items: items,
    subtotal: quote.subtotal,
    tax: tax,
    deliveryFee: cart.redeliveryFee,
    total: quote.grandTotal,
    deliveryInfo: {
      fullName: deliveryInfo.fullName || "",
      email: deliveryInfo.email || "",
      phone: deliveryInfo.phone || "",
      address: deliveryInfo.address || deliveryInfo.deliveryAddress || "",
      city: deliveryInfo.city || "",
      state: deliveryInfo.state || "",
      zipCode: deliveryInfo.zipCode || "",
    },
    paymentMethod: apiBooking.payment?.paymentMethod,
    paymentStatus: mapPaymentStatus(apiBooking.paymentStatus),
    // Add bundle info if present
    bundle: cart.bundle ? {
      id: cart.bundle.id,
      name: cart.bundle.name,
      description: cart.bundle.description,
      fromMonth: cart.bundle.fromMonth,
      toMonth: cart.bundle.toMonth,
      months: cart.bundle.months,
      bins: cart.bundle.bins,
      price: cart.bundle.price,
      extras: cart.bundle.extras,
    } : undefined,
    // Add plan info
    plan: apiBooking.plan ? {
      id: apiBooking.plan.id,
      name: apiBooking.plan.name,
      details: apiBooking.plan.details,
      durationBins: cart.durationBins,
      durationMonths: cart.durationMonths,
      price: cart.baseStorageCost,
    } : undefined,
    savings: cart.savings ?? 0,
    redeliveryFee: cart.redeliveryFee ?? 0,
    zoneDeliveryCharges: cart.zoneDeliveryCharges ?? 0,
    addonsDeliveryCost: cart.addonsDeliveryCost ?? 0,
    addonsCost: cart.addonsCost ?? 0,
    climateControlCost: cart.climateControlCost ?? 0,
    protectionPlanCost: cart.protectionPlanCost != null ? Number(cart.protectionPlanCost) : 0,
    shipmentDetails: apiBooking.shipmentDetails || undefined,
  };
}

/**
 * Get a single booking by ID
 * GET /bookings/{id}
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const response = await apiClient.get<CommonResponse<ApiBooking> | ApiBooking>(
      `/bookings/${bookingId}`
    );
    
    // Handle both CommonResponse wrapper and direct response
    let apiBooking: ApiBooking;
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const commonResponse = response.data as CommonResponse<ApiBooking>;
      if (!commonResponse.success || !commonResponse.data) {
        return null;
      }
      apiBooking = commonResponse.data;
    } else {
      apiBooking = response.data as ApiBooking;
    }
    
    return transformApiBookingDetail(apiBooking);
  } catch (error) {
    console.error("Failed to get booking:", error);
    return null;
  }
}

// Checkout Session Response Types
export interface CheckoutSessionData {
  checkoutUrl: string;
  checkoutSessionId: string;
  paymentIntentId: string | null;
}

export interface CheckoutSessionResponse extends CommonResponse<CheckoutSessionData> {
  message: string;
  data: CheckoutSessionData | null;
  success: boolean;
}

// Checkout Session Request Type
export interface CheckoutSessionRequest {
  cartId: string; // Required: The cart ID containing one or more cart items
  cartItemIds?: string[]; // Optional: List of specific cart item IDs to checkout.
  // If null/empty/undefined, all items in the cart are included.
  // If provided, only the specified items are included in checkout.
}

// This function calls the `/api/create-checkout-session` endpoint and sends the request payload.
// It returns the result as received from the API.
export async function createCheckoutSession(
  request: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  try {
    const res = await apiClient.post<CheckoutSessionResponse>('/create-checkout-session', request);

    // Axios response has the data in res.data
    return res.data;
  } catch (error) {
    throw error;
  }
}