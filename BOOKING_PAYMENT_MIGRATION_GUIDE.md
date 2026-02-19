# Booking & Payment Gateway Migration Guide

## Executive Summary

This document outlines the changes required to migrate from the current Payment Intent-based embedded checkout flow to a new booking-centric flow with UUID-based booking tracking, Stripe Checkout Sessions, Invoice support, and webhook reconciliation.

---

## Current State Analysis

### Current Flow
1. **Cart Creation**: User completes booking steps (1-4) → Cart saved to backend via `/cart/items`
2. **Payment Initiation**: User clicks "Pay Now" → Redirects to `/payment/[cartId]`
3. **Payment Processing**: 
   - `CheckoutPage.tsx` calls `/api/create-payment-intent` (creates Payment Intent)
   - Uses Stripe `PaymentElement` (embedded form)
   - Confirms payment via `stripe.confirmPayment()`
   - Redirects to `/payment-success?amount=X&cartId=Y`
4. **No Booking Tracking**: No UUID-based bookingId, no localStorage persistence, no webhook handling

### Current Files
- `app/payment/[cartId]/page.tsx` - Payment page
- `components/payment/CheckoutPage.tsx` - Embedded Stripe form
- `app/api/create-payment-intent/route.ts` - Creates Payment Intent (no metadata)
- `app/cart/page.tsx` - Cart listing
- `app/pricing/page.tsx` - Booking flow (Steps 1-4)
- `store/slices/cartSlice.ts` - Redux cart state
- `lib/api/cartService.ts` - Cart API service

### Current Limitations
- ❌ No `bookingId` (UUID) generation
- ❌ No cart lines structure for Stripe line items
- ❌ No localStorage persistence for booking drafts
- ❌ No mapping between bookingId and Stripe objects
- ❌ No Invoice creation endpoint
- ❌ No webhook handlers
- ❌ No database schema for bookings
- ❌ Payment Intent doesn't include metadata.bookingId

---

## Required Changes Overview

### 1. **Booking ID Generation & Tracking**
- Generate UUID v4 `bookingId` when user submits Step 4
- Store bookingId in cart/booking state
- Persist to localStorage as `valet_booking_draft`

### 2. **Cart Lines Structure**
- Transform cart selections into structured `cartLines` array
- Each line item: `{ sku, name, amount, quantity? }`
- Include: bins, bulky items, climate control, protection plan, addons

### 3. **Payment Method Options**
- **Pay Now**: Create Stripe Checkout Session (redirect flow)
- **Invoice Me**: Create Stripe Invoice (email invoice)

### 4. **LocalStorage Persistence**
- `localStorage['valet_booking_draft']`: Full booking payload
- `localStorage['valet_booking_mapping']`: `{ bookingId, checkoutSessionId/invoiceId, method }`

### 5. **New API Endpoints**
- `POST /api/create-checkout-session` - Creates Stripe Checkout Session
- `POST /api/create-invoice` - Creates Stripe Invoice
- `POST /api/webhooks/stripe` - Handles Stripe webhooks

### 6. **Webhook Handlers**
- `checkout.session.completed` → Mark booking as paid
- `payment_intent.succeeded` → Idempotent backup marking
- `invoice.paid` → Mark booking as paid

### 7. **Database Schema**
- New `bookings` table/document with booking tracking fields

---

## Detailed Implementation Plan

### Phase 1: Core Data Structures

#### 1.1 Add Cart Lines Interface
**File**: `store/slices/cartSlice.ts` or new `lib/types/booking.ts`

```typescript
export interface CartLine {
  sku: string;           // e.g., "BIN-001", "CLIMATE-CTRL", "PROTECTION-PREMIUM"
  name: string;          // Display name
  amount: number;        // Price in dollars (will be converted to cents)
  quantity?: number;     // Optional quantity (default: 1)
  type?: 'plan' | 'bundle' | 'addon' | 'protection' | 'service';
}

export interface BookingDraft {
  bookingId: string;     // UUID v4
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  planType: 'plan' | 'bundle' | null;
  months: number | null;
  bins: number;
  addons: Addon[];
  climate: boolean;
  protectionPlan: ProtectionPlan | null;
  totals: {
    base: number;
    delivery: number;
    climate: number;
    binsCharge: number;
    addons: number;
    protection: number;
    total: number;
  };
  cartLines: CartLine[];
  meta: {
    cartId?: string;
    locationData?: LocationData;
    deliveryNotes?: string;
    createdAt: string;
  };
}

export interface BookingMapping {
  bookingId: string;
  checkoutSessionId?: string;
  paymentIntentId?: string;
  invoiceId?: string;
  method: 'checkout' | 'invoice';
  createdAt: string;
}
```

#### 1.2 Update BookingCart Interface
**File**: `store/slices/cartSlice.ts`

Add to `BookingCart`:
```typescript
bookingId?: string;  // UUID v4 generated on Step 4 submit
cartLines?: CartLine[];  // Derived from selections
```

---

### Phase 2: Cart Lines Generation

#### 2.1 Create Cart Lines Utility
**New File**: `lib/utils/cartLines.ts`

```typescript
import type { BookingCart } from "@/store/slices/cartSlice";
import type { CartLine } from "@/lib/types/booking";

export function generateCartLines(cart: BookingCart): CartLine[] {
  const lines: CartLine[] = [];

  // Base storage (plan or bundle)
  if (cart.bundles) {
    lines.push({
      sku: `BUNDLE-${cart.bundles.id}`,
      name: cart.bundles.bundle_name,
      amount: cart.baseStorageCost,
      quantity: 1,
      type: 'bundle',
    });
  } else if (cart.plan) {
    const description = cart.durationBins.months && cart.durationBins.bins > 0
      ? `${cart.durationBins.bins} bins × ${cart.durationBins.months} months`
      : `${cart.durationBins.bins} bins`;
    
    lines.push({
      sku: `PLAN-${cart.plan.id}`,
      name: `${cart.plan.plan_name} (${description})`,
      amount: cart.baseStorageCost,
      quantity: 1,
      type: 'plan',
    });
  }

  // Climate control
  if (cart.climateControl && cart.climateControlCost > 0) {
    lines.push({
      sku: 'CLIMATE-CTRL',
      name: 'Climate Control',
      amount: cart.climateControlCost,
      quantity: 1,
      type: 'service',
    });
  }

  // Protection plan
  if (cart.protectionPlan && cart.protectionPlanCost > 0) {
    lines.push({
      sku: `PROTECTION-${cart.protectionPlan.name.toUpperCase().replace(/\s+/g, '-')}`,
      name: cart.protectionPlan.name,
      amount: cart.protectionPlanCost,
      quantity: 1,
      type: 'protection',
    });
  }

  // Addons
  cart.addons.forEach((addon) => {
    if (cart.addonsCost > 0) {
      lines.push({
        sku: `ADDON-${addon.id || addon.name.toUpperCase().replace(/\s+/g, '-')}`,
        name: addon.name,
        amount: addon.amount || 0,
        quantity: 1,
        type: 'addon',
      });
    }
  });

  // Delivery charges (if separate line item needed)
  if (cart.zoneDeliveryCharges && cart.zoneDeliveryCharges > 0) {
    lines.push({
      sku: 'DELIVERY-FEE',
      name: 'Delivery Fee',
      amount: cart.zoneDeliveryCharges,
      quantity: 1,
      type: 'service',
    });
  }

  return lines;
}
```

---

### Phase 3: Booking ID Generation & LocalStorage

#### 3.1 Generate Booking ID on Step 4 Submit
**File**: `app/pricing/page.tsx`

**Location**: In `proceedWithCartSave()` function (around line 487)

**Changes**:
```typescript
import { v4 as uuidv4 } from 'uuid';

const proceedWithCartSave = async () => {
  // ... existing validation ...

  // Generate bookingId (UUID v4)
  const bookingId = uuidv4();

  // Build cart payload with bookingId
  const localCart: BookingCart = {
    // ... existing fields ...
    bookingId,  // ADD THIS
    cartLines: generateCartLines(localCart),  // ADD THIS (after cart is built)
  };

  // ... existing API call ...

  // After successful cart save, persist to localStorage
  if (typeof window !== 'undefined') {
    const bookingDraft: BookingDraft = {
      bookingId,
      customer: {
        name: fullName,
        email: email,
        phone: phone,
        address: deliveryAddress,
      },
      planType: selectedBundle ? 'bundle' : (plan ? 'plan' : null),
      months: selectedMonths,
      bins: selectedBins,
      addons: selectedAddons,
      climate: climateControl,
      protectionPlan,
      totals: {
        base: pricingBreakdown.baseStorageCost,
        delivery: pricingBreakdown.redeliveryFee || 0,
        climate: pricingBreakdown.climateControlCost,
        binsCharge: 0, // Calculate if needed
        addons: pricingBreakdown.addonsCost,
        protection: pricingBreakdown.protectionPlanCost,
        total: calculatedTotal,
      },
      cartLines: generateCartLines(localCart),
      meta: {
        cartId: updatedCart.cartId,
        locationData,
        deliveryNotes,
        createdAt: new Date().toISOString(),
      },
    };

    localStorage.setItem('valet_booking_draft', JSON.stringify(bookingDraft));
  }
};
```

**Install UUID package**:
```bash
npm install uuid
npm install --save-dev @types/uuid
```

---

### Phase 4: New API Endpoints

#### 4.1 Create Checkout Session Endpoint
**New File**: `app/api/create-checkout-session/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingId,
      customer,
      cartLines,
      totals,
    } = body;

    if (!bookingId || !customer || !cartLines || !totals) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build line items for Stripe
    const lineItems = cartLines.map((line: any) => ({
      quantity: line.quantity || 1,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(line.amount * 100), // Convert to cents
        product_data: {
          name: line.name,
          metadata: {
            sku: line.sku,
            bookingId: bookingId,
          },
        },
      },
    }));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer.email,
      line_items: lineItems,
      metadata: {
        bookingId: bookingId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-cancel?bookingId=${bookingId}`,
    });

    // TODO: Upsert booking in database with session.id and payment_intent
    // await upsertBooking({
    //   bookingId,
    //   status: 'pending',
    //   stripe_checkout_session_id: session.id,
    //   stripe_payment_intent_id: session.payment_intent || null,
    //   // ... other fields
    // });

    return NextResponse.json({
      checkoutUrl: session.url,
      checkoutSessionId: session.id,
      paymentIntentId: session.payment_intent || null,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
```

#### 4.2 Create Invoice Endpoint
**New File**: `app/api/create-invoice/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

async function ensureStripeCustomer(customer: {
  email: string;
  name: string;
  phone?: string;
}): Promise<string> {
  // Check if customer exists by email
  const customers = await stripe.customers.list({
    email: customer.email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0].id;
  }

  // Create new customer
  const newCustomer = await stripe.customers.create({
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
  });

  // TODO: Store customer.id in your database keyed by email
  return newCustomer.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingId,
      customer,
      cartLines,
    } = body;

    if (!bookingId || !customer || !cartLines) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure Stripe customer exists
    const customerId = await ensureStripeCustomer(customer);

    // Create invoice items
    for (const line of cartLines) {
      await stripe.invoiceItems.create({
        customer: customerId,
        currency: 'usd',
        unit_amount: Math.round(line.amount * 100), // Convert to cents
        description: line.name,
        metadata: {
          bookingId: bookingId,
          sku: line.sku,
        },
      });
    }

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice',
      days_until_due: 7,
      metadata: {
        bookingId: bookingId,
      },
    });

    // Send invoice
    const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);

    // TODO: Save invoice.id to booking row in database
    // await upsertBooking({
    //   bookingId,
    //   status: 'pending',
    //   stripe_invoice_id: invoice.id,
    //   // ... other fields
    // });

    return NextResponse.json({
      invoiceId: invoice.id,
      hostedInvoiceUrl: sentInvoice.hosted_invoice_url || null,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
```

#### 4.3 Webhook Handler
**New File**: `app/api/webhooks/stripe/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        // TODO: Update booking status to 'paid'
        // await updateBookingStatus(bookingId, {
        //   status: 'paid',
        //   stripe_checkout_session_id: session.id,
        //   stripe_payment_intent_id: session.payment_intent as string || null,
        //   paidAt: new Date().toISOString(),
        // });
        console.log(`Booking ${bookingId} marked as paid via checkout session ${session.id}`);
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata?.bookingId;

      if (bookingId) {
        // Idempotent backup marking
        // await updateBookingStatus(bookingId, {
        //   status: 'paid',
        //   stripe_payment_intent_id: paymentIntent.id,
        //   paidAt: new Date().toISOString(),
        // });
        console.log(`Booking ${bookingId} marked as paid via payment intent ${paymentIntent.id}`);
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      const bookingId = invoice.metadata?.bookingId;

      if (bookingId) {
        // TODO: Update booking status to 'paid'
        // await updateBookingStatus(bookingId, {
        //   status: 'paid',
        //   stripe_invoice_id: invoice.id,
        //   paidAt: new Date().toISOString(),
        // });
        console.log(`Booking ${bookingId} marked as paid via invoice ${invoice.id}`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing for webhooks (Stripe needs raw body)
export const runtime = 'nodejs';
```

**Environment Variable**:
Add to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### Phase 5: Update Payment Flow

#### 5.1 Update Payment Page
**File**: `app/payment/[cartId]/page.tsx`

**Changes**:
1. Load bookingId from cart or localStorage
2. Add "Pay Now" and "Invoice Me" buttons
3. Remove embedded PaymentElement (will redirect to Checkout Session)

```typescript
// Add state for payment method selection
const [paymentMethod, setPaymentMethod] = useState<'checkout' | 'invoice' | null>(null);
const [processing, setProcessing] = useState(false);

// Load bookingId from cart or localStorage
useEffect(() => {
  if (cart?.bookingId) {
    // BookingId already in cart
  } else if (typeof window !== 'undefined') {
    // Try to load from localStorage
    const draft = localStorage.getItem('valet_booking_draft');
    if (draft) {
      const parsed = JSON.parse(draft);
      // Update cart with bookingId if missing
    }
  }
}, [cart]);

// Handle Pay Now (Checkout Session)
const handlePayNow = async () => {
  setProcessing(true);
  try {
    const cartLines = generateCartLines(cart);
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: cart.bookingId,
        customer: {
          name: cart.deliveryInfo.fullName,
          email: cart.deliveryInfo.email,
          phone: cart.deliveryInfo.phone,
        },
        cartLines,
        totals: {
          base: cart.baseStorageCost,
          delivery: cart.redeliveryFee,
          climate: cart.climateControlCost,
          addons: cart.addonsCost,
          protection: cart.protectionPlanCost,
          total: cart.total,
        },
      }),
    });

    const data = await response.json();
    
    if (data.checkoutUrl) {
      // Save mapping to localStorage
      if (typeof window !== 'undefined') {
        const mapping: BookingMapping = {
          bookingId: cart.bookingId!,
          checkoutSessionId: data.checkoutSessionId,
          paymentIntentId: data.paymentIntentId || undefined,
          method: 'checkout',
          createdAt: new Date().toISOString(),
        };
        
        const existingMappings = JSON.parse(
          localStorage.getItem('valet_booking_mapping') || '[]'
        );
        existingMappings.push(mapping);
        localStorage.setItem('valet_booking_mapping', JSON.stringify(existingMappings));
      }
      
      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl;
    }
  } catch (error) {
    toast.error('Failed to create checkout session');
    setProcessing(false);
  }
};

// Handle Invoice Me
const handleInvoiceMe = async () => {
  setProcessing(true);
  try {
    const cartLines = generateCartLines(cart);
    
    const response = await fetch('/api/create-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: cart.bookingId,
        customer: {
          name: cart.deliveryInfo.fullName,
          email: cart.deliveryInfo.email,
          phone: cart.deliveryInfo.phone,
        },
        cartLines,
      }),
    });

    const data = await response.json();
    
    if (data.invoiceId) {
      // Save mapping to localStorage
      if (typeof window !== 'undefined') {
        const mapping: BookingMapping = {
          bookingId: cart.bookingId!,
          invoiceId: data.invoiceId,
          method: 'invoice',
          createdAt: new Date().toISOString(),
        };
        
        const existingMappings = JSON.parse(
          localStorage.getItem('valet_booking_mapping') || '[]'
        );
        existingMappings.push(mapping);
        localStorage.setItem('valet_booking_mapping', JSON.stringify(existingMappings));
      }
      
      if (data.hostedInvoiceUrl) {
        // Redirect to hosted invoice
        window.location.href = data.hostedInvoiceUrl;
      } else {
        toast.success('Invoice sent to your email');
        setProcessing(false);
      }
    }
  } catch (error) {
    toast.error('Failed to create invoice');
    setProcessing(false);
  }
};
```

**Remove**: The `<Elements>` and `<CheckoutPage>` components (lines 152-161)

**Replace with**: Payment method selection buttons

#### 5.2 Delete/Update CheckoutPage Component
**File**: `components/payment/CheckoutPage.tsx`

**Option A**: Delete this file (if not using embedded checkout)
**Option B**: Keep for future use but mark as deprecated

#### 5.3 Update Payment Success Page
**File**: `app/payment-success/page.tsx`

**Changes**: Handle `session_id` and `bookingId` query params

```typescript
const sessionId = searchParams.get("session_id");
const bookingId = searchParams.get("bookingId");
```

---

### Phase 6: Database Schema

#### 6.1 Bookings Table/Document Structure

```typescript
interface Booking {
  booking_id: string;              // UUID v4 (PK)
  status: 'draft' | 'pending' | 'paid' | 'fulfillment' | 'closed' | 'canceled';
  
  // Customer info
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  
  // Cart/Booking details
  cart: Array<{
    sku: string;
    name: string;
    amount: number;
  }>;
  
  totals: {
    base: number;
    delivery: number;
    climate: number;
    binsCharge: number;
    addons: number;
    protection: number;
    total: number;
  };
  
  // Gateway info
  gateway: 'stripe';
  stripe_checkout_session_id?: string;
  stripe_payment_intent_id?: string;
  stripe_invoice_id?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
  paid_at?: string;
}
```

**SQL Example** (if using SQL database):
```sql
CREATE TABLE bookings (
  booking_id VARCHAR(36) PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT,
  cart JSONB NOT NULL,
  totals JSONB NOT NULL,
  gateway VARCHAR(20) DEFAULT 'stripe',
  stripe_checkout_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  stripe_invoice_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP,
  INDEX idx_customer_email (customer_email),
  INDEX idx_status (status),
  INDEX idx_stripe_session (stripe_checkout_session_id),
  INDEX idx_stripe_payment_intent (stripe_payment_intent_id),
  INDEX idx_stripe_invoice (stripe_invoice_id)
);
```

---

### Phase 7: Update Cart Page

#### 7.1 Add Booking ID Display
**File**: `app/cart/page.tsx`

**Changes**: Show bookingId in cart card if available

```typescript
{cart.bookingId && (
  <div className="text-xs text-gray-500 mt-2">
    Booking ID: {cart.bookingId}
  </div>
)}
```

---

## Migration Checklist

### Frontend Changes
- [ ] Install `uuid` and `@types/uuid` packages
- [ ] Create `lib/types/booking.ts` with interfaces
- [ ] Create `lib/utils/cartLines.ts` utility
- [ ] Update `store/slices/cartSlice.ts` to include `bookingId` and `cartLines`
- [ ] Update `app/pricing/page.tsx` to generate bookingId and persist to localStorage
- [ ] Update `app/payment/[cartId]/page.tsx` to use Checkout Session/Invoice flow
- [ ] Update `app/payment-success/page.tsx` to handle new query params
- [ ] Update `app/cart/page.tsx` to display bookingId
- [ ] Remove or deprecate `components/payment/CheckoutPage.tsx`

### Backend/API Changes
- [ ] Create `app/api/create-checkout-session/route.ts`
- [ ] Create `app/api/create-invoice/route.ts`
- [ ] Create `app/api/webhooks/stripe/route.ts`
- [ ] Update or remove `app/api/create-payment-intent/route.ts` (deprecate if not needed)
- [ ] Add `STRIPE_WEBHOOK_SECRET` to environment variables

### Database Changes
- [ ] Create `bookings` table/document schema
- [ ] Implement `upsertBooking()` function
- [ ] Implement `updateBookingStatus()` function
- [ ] Add database indexes for performance

### Testing
- [ ] Test bookingId generation
- [ ] Test localStorage persistence
- [ ] Test Checkout Session creation and redirect
- [ ] Test Invoice creation
- [ ] Test webhook handlers (use Stripe CLI for local testing)
- [ ] Test payment success flow
- [ ] Test reconciliation via webhooks

### Documentation
- [ ] Update API documentation
- [ ] Update payment flow diagrams
- [ ] Document webhook setup in Stripe Dashboard

---

## Environment Variables

Add to `.env.local`:
```env
# Existing
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# New
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # or your production URL
```

---

## Stripe Dashboard Setup

1. **Webhook Endpoint**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `invoice.paid`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

2. **Test Mode**:
   - Use test mode keys for development
   - Test with Stripe test cards

---

## Testing Webhooks Locally

Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will give you a webhook signing secret for local testing.

---

## Rollout Strategy

1. **Phase 1**: Implement bookingId generation and localStorage (non-breaking)
2. **Phase 2**: Add Checkout Session endpoint (keep Payment Intent as fallback)
3. **Phase 3**: Add Invoice endpoint
4. **Phase 4**: Implement webhook handlers
5. **Phase 5**: Update UI to use new flow
6. **Phase 6**: Migrate existing carts (if needed)
7. **Phase 7**: Remove old Payment Intent flow

---

## Notes

- **Backward Compatibility**: Consider keeping Payment Intent flow as fallback during migration
- **Error Handling**: Add comprehensive error handling for all new endpoints
- **Logging**: Add logging for bookingId tracking and webhook events
- **Idempotency**: Ensure webhook handlers are idempotent (handle duplicate events)
- **Security**: Validate all inputs, especially bookingId format (UUID v4)

---

## Questions to Resolve

1. **Database Choice**: SQL (PostgreSQL/MySQL) or NoSQL (MongoDB/Firestore)?
2. **Customer Storage**: Store Stripe customer IDs in your database or fetch on-demand?
3. **Invoice Due Date**: Is 7 days the correct default, or should it be configurable?
4. **Cart Migration**: How to handle existing carts without bookingId?
5. **Success Page**: Should success page show bookingId to user?

---

## Estimated Effort

- **Frontend Changes**: 8-12 hours
- **Backend/API Changes**: 6-8 hours
- **Database Setup**: 2-4 hours
- **Testing**: 4-6 hours
- **Documentation**: 2-3 hours
- **Total**: ~22-33 hours

---

## Support

For questions or clarifications, refer to:
- Stripe Checkout Sessions: https://stripe.com/docs/payments/checkout
- Stripe Invoices: https://stripe.com/docs/billing/invoices/overview
- Stripe Webhooks: https://stripe.com/docs/webhooks

