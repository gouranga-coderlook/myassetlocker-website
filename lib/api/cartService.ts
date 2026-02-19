// lib/api/cartService.ts
import { apiClient, type CommonResponse } from "./authService";
import type { BookingCart, DeliveryInformation } from "@/store/slices/cartSlice";
import type { Plan, Bundle, Addon, ProtectionPlan } from "@/store/slices/pricingSlice";

// Cart Item DTO (individual item in cart)
export interface CartItemDto {
  id: string;
  itemTotal: number;
  baseStorageCost: number;
  redeliveryFee: number;
  climateControlCost: number;
  addonsCost: number;
  addonsDeliveryCost: number;
  protectionPlanCost: number;
  savings: number;
  zoneDeliveryCharges: number;
  plan: {
    id: string;
    name: string;
    details: string;
    hasDiscount: boolean;
    discountPercentage: number | null;
    perBinPrice: number;
    enabled: boolean;
    status: string;
    createdAt: string;
  } | null;
  bundle: {
    id: string;
    name: string;
    description?: string;
    details?: string;
    fromMonth?: string;
    toMonth?: string;
    months?: number;
    bins?: number;
    extras?: string;
    price: number;
    enabled?: boolean;
    status?: string;
    createdAt?: string;
  } | null;
  protectionPlan: {
    id: string;
    name: string;
    price: number;
    displayPrice: string;
    limit: number;
    displayLimit: string;
    description: string;
    enabled: boolean;
    status: string;
  } | null;
  addons: Array<{
    id: string;
    name: string;
    description: string;
    chargeType: "fixed" | "percent";
    amount: number;
    recurrence: "monthly" | "one_time";
    reDeliveryFee: number;
    premiumFeatures: boolean;
    enabled: boolean;
    status: string;
  }>;
  durationMonths: number;
  durationBins: number;
  climateControl: boolean;
  deliveryInfo: {
    fullName: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// API Response Types (matching CART_API_DOCUMENTATION.md)
export interface CartDto {
  id: string;
  total: number;
  savings: number;
  status: string;
  cartItems: CartItemDto[]; // Array of cart items
  createdAt: string;
  updatedAt: string;
}

// Request DTOs
export interface AddCartItemDto {
  customerId?: string;
  total?: number;
  baseStorageCost?: number;
  redeliveryFee?: number;
  climateControlCost?: number;
  addonsCost?: number;
  addonsDeliveryCost?: number;
  protectionPlanCost?: number;
  savings?: number;
  planId?: string;
  bundleId?: string | null;
  protectionPlanId?: string;
  addonIds?: string[];
  durationMonths?: number;
  durationBins?: number;
  climateControl?: boolean;
  deliveryInfo?: {
    fullName: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    city: string;
    state: string;
    zipCode: string;
  };
  couponCode?: string | null;
  zoneDeliveryCharges?: number;
}

export interface ApplyCouponDto {
  code: string;
}

export interface CheckoutDto {
  paymentMethodId: string;
  shippingAddressId: string;
}

// Transform API CartItemDto to BookingCart
export function transformCartItemDtoToBookingCart(cartItemDto: CartItemDto, cartId: string, plans: Plan[] = [], bundles: Bundle[] = [], addons: Addon[] = [], protectionPlans: ProtectionPlan[] = []): BookingCart {
  // Find matching plan
  const plan = cartItemDto.plan
    ? plans.find((p) => p.id === cartItemDto.plan!.id) || null
    : null;

  // Find matching bundle, or create from API data if not found in pricing data
  let bundle: Bundle | null = null;
  if (cartItemDto.bundle) {
    const foundBundle = bundles.find((b) => b.id === cartItemDto.bundle!.id);
    // If bundle not found in pricing data, create from API response
    if (foundBundle) {
      // Preserve API fields even if bundle is found in pricing data
      bundle = {
        ...foundBundle,
        fromMonth: cartItemDto.bundle.fromMonth ?? foundBundle.fromMonth ?? "",
        toMonth: cartItemDto.bundle.toMonth ?? foundBundle.toMonth ?? "",
        months: cartItemDto.bundle.months ?? foundBundle.months ?? 0,
        extras: cartItemDto.bundle.extras ?? foundBundle.extras ?? "",
      };
    } else {
      bundle = {
        id: cartItemDto.bundle.id,
        bundle_name: cartItemDto.bundle.name,
        description: cartItemDto.bundle.description || cartItemDto.bundle.details || "",
        fromMonth: cartItemDto.bundle.fromMonth || "",
        toMonth: cartItemDto.bundle.toMonth || "",
        months: cartItemDto.bundle.months || 0,
        extras: cartItemDto.bundle.extras || "",
        price: cartItemDto.bundle.price,
      };
    }
  }

  // Find matching addons - try to match by ID first, then by name
  const matchedAddons = (cartItemDto.addons || [])
    .map((addonDto) => {
      // First try to match by ID if available
      let matched = addons.find((a) => {
        const addonWithId = a as Addon & { id?: string };
        return addonWithId.id === addonDto.id;
      });
      // If not found by ID, try by name
      if (!matched) {
        matched = addons.find((a) => a.name === addonDto.name);
      }
      // If found, preserve the ID from API response
      if (matched) {
        return { ...matched, id: addonDto.id } as Addon & { id: string };
      }
      return null;
    })
    .filter((a): a is Addon & { id: string } => a !== null);

  // Find matching protection plan - try to match by ID first, then by name
  let protectionPlan: (ProtectionPlan & { id?: string }) | null = null;
  if (cartItemDto.protectionPlan) {
    // First try to match by ID if available
    protectionPlan = protectionPlans.find((p) => {
      const planWithId = p as ProtectionPlan & { id?: string };
      return planWithId.id === cartItemDto.protectionPlan!.id;
    }) || null;
    // If not found by ID, try by name
    if (!protectionPlan) {
      protectionPlan = protectionPlans.find((p) => p.name === cartItemDto.protectionPlan!.name) || null;
    }
    // If found, preserve the ID from API response
    if (protectionPlan) {
      protectionPlan = { ...protectionPlan, id: cartItemDto.protectionPlan.id } as ProtectionPlan & { id: string };
    }
  }

  // Transform delivery info
  const deliveryInfo: DeliveryInformation = {
    fullName: cartItemDto.deliveryInfo?.fullName || "",
    email: cartItemDto.deliveryInfo?.email || "",
    phone: cartItemDto.deliveryInfo?.phone || "",
    deliveryAddress: cartItemDto.deliveryInfo?.deliveryAddress || "",
    city: cartItemDto.deliveryInfo?.city || "",
    state: cartItemDto.deliveryInfo?.state || "",
    zipCode: cartItemDto.deliveryInfo?.zipCode || "",
    deliveryNotes: "", // API doesn't include deliveryNotes
  };

  return {
    total: cartItemDto.itemTotal || 0,
    baseStorageCost: cartItemDto.baseStorageCost || 0,
    redeliveryFee: cartItemDto.redeliveryFee || 0,
    climateControlCost: cartItemDto.climateControlCost || 0,
    addonsCost: cartItemDto.addonsCost || 0,
    addonsDeliveryCost: cartItemDto.addonsDeliveryCost || 0,
    protectionPlanCost: cartItemDto.protectionPlanCost || 0,
    savings: cartItemDto.savings || 0,
    plan,
    bundles: bundle,
    addons: matchedAddons,
    protectionPlan,
    durationBins: {
      months: cartItemDto.durationMonths || null,
      bins: cartItemDto.durationBins || 0,
    },
    climateControl: cartItemDto.climateControl || false,
    deliveryInfo,
    locationData: null,
    couponCode: null, // Cart items don't have coupon code, it's at cart level
    zoneDeliveryCharges: cartItemDto.zoneDeliveryCharges ?? null,
    createdAt: cartItemDto.createdAt,
    updatedAt: cartItemDto.updatedAt,
    cartId: cartId,
    cartItemId: cartItemDto.id, // Store cart item ID for reference
  };
}

// Legacy function for backward compatibility - transforms CartDto (old structure) to BookingCart
export function transformCartDtoToBookingCart(cartDto: CartDto, plans: Plan[] = [], bundles: Bundle[] = [], addons: Addon[] = [], protectionPlans: ProtectionPlan[] = []): BookingCart {
  // If cart has items, use the most recently added item (last in array) for "Complete Booking" flow
  // This ensures we checkout only the newly added item, not all items
  if (cartDto.cartItems && cartDto.cartItems.length > 0) {
    // Sort by createdAt descending to get the most recent item first
    const sortedItems = [...cartDto.cartItems].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Most recent first
    });
    // Use the most recently added item (newly added from Complete Booking)
    return transformCartItemDtoToBookingCart(sortedItems[0], cartDto.id, plans, bundles, addons, protectionPlans);
  }
  // Fallback to empty cart
  return {
    total: cartDto.total || 0,
    baseStorageCost: 0,
    redeliveryFee: 0,
    climateControlCost: 0,
    addonsCost: 0,
    addonsDeliveryCost: 0,
    protectionPlanCost: 0,
    savings: cartDto.savings || 0,
    plan: null,
    bundles: null,
    addons: [],
    protectionPlan: null,
    durationBins: {
      months: null,
      bins: 0,
    },
    climateControl: false,
    deliveryInfo: {
      fullName: "",
      email: "",
      phone: "",
      deliveryAddress: "",
      city: "",
      state: "",
      zipCode: "",
      deliveryNotes: "",
    },
    locationData: null,
    couponCode: null,
    zoneDeliveryCharges: null,
    createdAt: cartDto.createdAt,
    updatedAt: cartDto.updatedAt,
    cartId: cartDto.id,
  };
}

// Transform BookingCart to AddCartItemDto
// Note: The API expects IDs for addons and protection plans
export function transformBookingCartToAddCartItemDto(cart: BookingCart): AddCartItemDto {
  // Extract IDs from addons - prioritize ID from API response, fallback to name
  const addonIds = cart.addons
    .map((addon) => {
      // Check if addon has an id property (from API response)
      const addonWithId = addon as Addon & { id?: string };
      if (addonWithId.id && typeof addonWithId.id === 'string') {
        return addonWithId.id;
      }
      // If no ID, try to find the addon in pricing data to get its ID
      // For now, return name as fallback (backend should handle mapping)
      return addon.name;
    })
    .filter((id): id is string => !!id);

  // Extract protection plan ID if available
  let protectionPlanId: string | undefined = undefined;
  if (cart.protectionPlan) {
    // Check if protection plan has an id property (from API response)
    const planWithId = cart.protectionPlan as ProtectionPlan & { id?: string };
    if (planWithId.id && typeof planWithId.id === 'string') {
      protectionPlanId = planWithId.id;
    } else {
      // Fallback to name (backend should handle mapping)
      protectionPlanId = cart.protectionPlan.name;
    }
  }

  return {
    total: cart.total,
    baseStorageCost: cart.baseStorageCost,
    redeliveryFee: cart.redeliveryFee,
    climateControlCost: cart.climateControlCost,
    addonsCost: cart.addonsCost,
    addonsDeliveryCost: cart.addonsDeliveryCost,
    protectionPlanCost: cart.protectionPlanCost,
    savings: cart.savings,
    zoneDeliveryCharges: cart.zoneDeliveryCharges ?? undefined,
    planId: cart.plan?.id,
    bundleId: cart.bundles?.id || null,
    protectionPlanId,
    addonIds: addonIds.length > 0 ? addonIds : undefined,
    durationMonths: cart.durationBins.months || undefined,
    durationBins: cart.durationBins.bins,
    climateControl: cart.climateControl,
    deliveryInfo: cart.deliveryInfo.deliveryAddress
      ? {
          fullName: cart.deliveryInfo.fullName,
          email: cart.deliveryInfo.email,
          phone: cart.deliveryInfo.phone,
          deliveryAddress: cart.deliveryInfo.deliveryAddress,
          city: cart.deliveryInfo.city,
          state: cart.deliveryInfo.state,
          zipCode: cart.deliveryInfo.zipCode,
        }
      : undefined,
    couponCode: cart.couponCode || null,
  };
}

/**
 * Get user's cart from API
 * GET /cart
 * Note: API now returns a single cart object (one cart per user) with multiple cart items
 * Pricing data (plans, bundles, addons, protectionPlans) should be passed
 * to properly transform API response to BookingCart format
 * Returns an array of BookingCart, one for each cart item
 */
export async function getUserCart(
  plans: Plan[] = [],
  bundles: Bundle[] = [],
  addons: Addon[] = [],
  protectionPlans: ProtectionPlan[] = []
): Promise<BookingCart[]> {
  try {
    // API now returns a single cart object wrapped in CommonResponse
    const response = await apiClient.get<CommonResponse<CartDto>>("/cart");
    
    // Extract cart data from CommonResponse
    let cartData: CartDto | null = null;
    
    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data && response.data.data) {
        // Wrapped in CommonResponse
        const commonResponse = response.data as CommonResponse<CartDto>;
        if (commonResponse.success && commonResponse.data) {
          cartData = commonResponse.data;
        }
      } else if ('id' in response.data && 'cartItems' in response.data) {
        // Direct cart object (shouldn't happen but handle it)
        cartData = response.data as unknown as CartDto;
      }
    }

    if (!cartData || !cartData.cartItems || cartData.cartItems.length === 0) {
      return [];
    }

    // Transform each cart item to a BookingCart
    return cartData.cartItems.map((cartItem) => {
      // If we have pricing data, transform properly
      if (plans.length > 0 || bundles.length > 0 || addons.length > 0 || protectionPlans.length > 0) {
        return transformCartItemDtoToBookingCart(
          cartItem,
          cartData!.id,
          plans,
          bundles,
          addons,
          protectionPlans
        );
      } else {
        // Return a simplified cart structure if no pricing data available
        // This allows the cart to be loaded even without pricing data
        return {
          total: cartItem.itemTotal || 0,
          baseStorageCost: cartItem.baseStorageCost || 0,
          redeliveryFee: cartItem.redeliveryFee || 0,
          climateControlCost: cartItem.climateControlCost || 0,
          addonsCost: cartItem.addonsCost || 0,
          addonsDeliveryCost: cartItem.addonsDeliveryCost || 0,
          protectionPlanCost: cartItem.protectionPlanCost || 0,
          savings: cartItem.savings || 0,
          plan: cartItem.plan ? { 
            id: cartItem.plan.id, 
            plan_name: cartItem.plan.name, 
            description: cartItem.plan.details, 
            hasDiscount: cartItem.plan.hasDiscount, 
            discount_value: cartItem.plan.discountPercentage || 0, 
            discount_type: "percent", 
            perBinPrice: cartItem.plan.perBinPrice, 
            pricing: {} 
          } as Plan : null,
          bundles: cartItem.bundle ? { 
            id: cartItem.bundle.id, 
            bundle_name: cartItem.bundle.name, 
            description: cartItem.bundle.description || cartItem.bundle.details || "", 
            fromMonth: cartItem.bundle.fromMonth || "", 
            toMonth: cartItem.bundle.toMonth || "", 
            months: cartItem.bundle.months || 0, 
            extras: cartItem.bundle.extras || "", 
            price: cartItem.bundle.price 
          } as Bundle : null,
          addons: cartItem.addons.map(a => ({ 
            id: a.id, 
            name: a.name, 
            description: a.description, 
            chargeType: a.chargeType, 
            amount: a.amount, 
            reDeliveryFee: a.reDeliveryFee, 
            recurrence: a.recurrence, 
            premiumFeatures: a.premiumFeatures 
          } as Addon)),
          protectionPlan: cartItem.protectionPlan ? { 
            name: cartItem.protectionPlan.name, 
            price: cartItem.protectionPlan.price, 
            displayPrice: cartItem.protectionPlan.displayPrice, 
            limit: cartItem.protectionPlan.limit, 
            displayLimit: cartItem.protectionPlan.displayLimit, 
            description: cartItem.protectionPlan.description 
          } as ProtectionPlan : null,
          durationBins: {
            months: cartItem.durationMonths || null,
            bins: cartItem.durationBins || 0,
          },
          climateControl: cartItem.climateControl || false,
          deliveryInfo: {
            fullName: cartItem.deliveryInfo?.fullName || "",
            email: cartItem.deliveryInfo?.email || "",
            phone: cartItem.deliveryInfo?.phone || "",
            deliveryAddress: cartItem.deliveryInfo?.deliveryAddress || "",
            city: cartItem.deliveryInfo?.city || "",
            state: cartItem.deliveryInfo?.state || "",
            zipCode: cartItem.deliveryInfo?.zipCode || "",
            deliveryNotes: "",
          },
          locationData: null,
          couponCode: null, // Cart items don't have coupon code
          zoneDeliveryCharges: cartItem.zoneDeliveryCharges ?? null,
          createdAt: cartItem.createdAt,
          updatedAt: cartItem.updatedAt,
          cartId: cartData.id,
          cartItemId: cartItem.id, // Store cart item ID for reference
        } as BookingCart;
      }
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

/**
 * Filter out undefined and null values from payload
 */
function filterPayload(payload: AddCartItemDto): Partial<AddCartItemDto> {
  const filtered: Partial<AddCartItemDto> = {};
  
  for (const [key, value] of Object.entries(payload)) {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      continue;
    }
    
    // Handle nested objects (like deliveryInfo)
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Filter nested object
      const filteredNested: Record<string, unknown> = {};
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (nestedValue !== undefined && nestedValue !== null) {
          filteredNested[nestedKey] = nestedValue;
        }
      }
      // Only add nested object if it has at least one property
      if (Object.keys(filteredNested).length > 0) {
        (filtered as Record<string, unknown>)[key] = filteredNested;
      }
    } else {
      // Handle arrays, primitives, etc.
      (filtered as Record<string, unknown>)[key] = value;
    }
  }
  
  return filtered;
}

/**
 * Add or update cart items
 * POST /cart/items
 */
export async function addCartItem(
  payload: AddCartItemDto
): Promise<CartDto> {
  try {
    // Filter out undefined and null values from payload
    const filteredPayload = filterPayload(payload);
    
    const response = await apiClient.post<CommonResponse<CartDto>>(
      "/cart/items",
      filteredPayload
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error("Failed to add cart item: Invalid response");
  } catch (error) {
    throw error;
  }
}

/**
 * Update cart item
 * PUT /cart/items/{id}
 */
export async function updateCartItem(
  itemId: string,
  cart: BookingCart
): Promise<BookingCart | null> {
  try {
    const requestDto = transformBookingCartToAddCartItemDto(cart);

    const response = await apiClient.put<CommonResponse<CartDto>>(
      `/cart/items/${itemId}`,
      requestDto
    );

    if (response.data.success && response.data.data) {
      return cart; // Return original cart since transformation needs pricing data
    }

    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Remove item from cart (clears entire cart)
 * DELETE /cart/items/{id}
 */
export async function removeCartItem(itemId: string): Promise<boolean> {
  try {
    const response = await apiClient.delete<CommonResponse>(`/cart/items/${itemId}`);

    if (response.data.success) {
      return true;
    }

    return false;
  } catch (error: unknown) {
    console.error("Error removing cart item:", error);
    return false;
  }
}

/**
 * Apply coupon code to cart
 * POST /cart/apply-coupon
 */
export async function applyCoupon(
  code: string,
  plans: Plan[] = [],
  bundles: Bundle[] = [],
  addons: Addon[] = [],
  protectionPlans: ProtectionPlan[] = []
): Promise<BookingCart | null> {
  try {
    const response = await apiClient.post<CommonResponse<CartDto>>(
      "/cart/apply-coupon",
      { code }
    );

    if (response.data.success && response.data.data) {
      const bookingCart = transformCartDtoToBookingCart(
        response.data.data,
        plans,
        bundles,
        addons,
        protectionPlans
      );
      return bookingCart;
    }

    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Checkout cart
 * POST /cart/checkout
 */
export async function checkoutCart(
  paymentMethodId: string,
  shippingAddressId: string
): Promise<boolean> {
  try {
    const response = await apiClient.post<CommonResponse>(
      "/cart/checkout",
      {
        paymentMethodId,
        shippingAddressId,
      }
    );

    if (response.data.success) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
}

// Legacy function for backward compatibility
// Note: This function should receive pricing data for proper transformation
export async function saveUserCart(
  cart: BookingCart,
): Promise<boolean> {
  try {
    // Transform cart to payload format
    const payload = transformBookingCartToAddCartItemDto(cart);
    await addCartItem(payload);
    return true;
  } catch (error: unknown) {
    console.error("Error saving user cart:", error);
    return false;
  }
}

export async function clearUserCart(): Promise<boolean> {
  // Note: API requires an itemId, but we don't have it
  // This might need to be handled differently
  // For now, we'll try to get the cart first to get the ID
  try {
    const response = await apiClient.get<CommonResponse<CartDto>>("/cart");
    if (response.data.success && response.data.data?.id) {
      return await removeCartItem(response.data.data.id);
    }
    return false;
  } catch (error: unknown) {
    console.error("Error clearing user cart:", error);
    return false;
  }
}
