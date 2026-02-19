// lib/api/stripeService.ts

// Types based on API documentation
export interface CartLineItem {
  sku: string;
  name: string;
  description: string;
  amount: number; // In dollars
  quantity: number;
}

export interface Address {
  id?: string; // UUID
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export interface Customer {
  email: string;
  name: string;
  phone?: string;
  address?: Address;
}

export interface Totals {
  base?: number;
  delivery?: number;
  climate?: number;
  binsCharge?: number;
  subtotal?: number;
  tax?: number;
  total?: number;
}

export interface CheckoutSessionRequest {
  bookingId: string; // UUID
  customer: Customer;
  cartLines: CartLineItem[];
  totals?: Totals;
  meta?: Record<string, unknown>;
}

export interface CheckoutSessionResponseData {
  checkoutUrl: string;
  checkoutSessionId: string;
  paymentIntentId: string | null;
}

export interface CheckoutSessionResponse {
  message: string;
  data: CheckoutSessionResponseData | null;
  success: boolean;
}

/**
 * Create Stripe Checkout Session
 * POST /api/create-checkout-session
 * TODO: Replace with actual API call to your backend
 * Example: const response = await apiClient.post("/create-checkout-session", request);
 */
export async function createCheckoutSession(
  request: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  void request; // Intentionally unused - will be passed to API when implemented
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Dummy data for testing
  // Replace this with actual API call:
  // const response = await apiClient.post<CommonResponse<CheckoutSessionResponseData>>("/create-checkout-session", request);
  // if (!response.data.success || !response.data.data) {
  //   throw new Error(response.data.message || "Failed to create checkout session");
  // }
  // return response.data;

  const dummyCheckoutSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const dummyCheckoutUrl = `https://checkout.stripe.com/demo/session/${dummyCheckoutSessionId}`;

  return {
    message: "Checkout session created successfully",
    data: {
      checkoutUrl: dummyCheckoutUrl,
      checkoutSessionId: dummyCheckoutSessionId,
      paymentIntentId: `pi_test_${Date.now()}`,
    },
    success: true,
  };
}

