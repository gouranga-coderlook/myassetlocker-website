# Booking & Payment Migration - Quick Summary

## What's Changing

### Current Flow → New Flow

**Before:**
- Cart → Payment Intent → Embedded Stripe Form → Payment Success

**After:**
- Cart → **BookingId (UUID)** → **Checkout Session OR Invoice** → Payment Success
- **LocalStorage persistence** for booking drafts
- **Webhook reconciliation** for payment status

---

## Key Changes

### 1. **Booking ID (UUID v4)**
- Generated when user submits Step 4
- Stored in cart state and localStorage
- Used as primary key for all transactions

### 2. **Cart Lines Structure**
- Transform cart selections into structured line items
- Format: `{ sku, name, amount, quantity }`
- Used for Stripe Checkout Session and Invoice line items

### 3. **Two Payment Methods**
- **Pay Now**: Stripe Checkout Session (redirect flow)
- **Invoice Me**: Stripe Invoice (email invoice, 7 days due)

### 4. **LocalStorage**
- `valet_booking_draft`: Full booking payload
- `valet_booking_mapping`: Links bookingId to Stripe objects

### 5. **New API Endpoints**
- `POST /api/create-checkout-session` - Creates Checkout Session
- `POST /api/create-invoice` - Creates Invoice
- `POST /api/webhooks/stripe` - Handles webhooks

### 6. **Webhooks**
- `checkout.session.completed` → Mark paid
- `payment_intent.succeeded` → Mark paid (backup)
- `invoice.paid` → Mark paid

---

## Files to Create

1. `lib/types/booking.ts` - TypeScript interfaces
2. `lib/utils/cartLines.ts` - Cart lines generator
3. `app/api/create-checkout-session/route.ts` - Checkout endpoint
4. `app/api/create-invoice/route.ts` - Invoice endpoint
5. `app/api/webhooks/stripe/route.ts` - Webhook handler

## Files to Modify

1. `app/pricing/page.tsx` - Generate bookingId, persist to localStorage
2. `app/payment/[cartId]/page.tsx` - Replace PaymentElement with Checkout/Invoice buttons
3. `store/slices/cartSlice.ts` - Add bookingId and cartLines fields
4. `app/payment-success/page.tsx` - Handle new query params

## Files to Remove/Deprecate

1. `components/payment/CheckoutPage.tsx` - No longer needed (or keep for future)
2. `app/api/create-payment-intent/route.ts` - Deprecate (or keep as fallback)

---

## Database Schema

```typescript
bookings: {
  booking_id (PK, UUID),
  status: 'draft' | 'pending' | 'paid' | 'fulfillment' | 'closed' | 'canceled',
  customer: { name, email, phone, address },
  cart: [{ sku, name, amount }],
  totals: { base, delivery, climate, binsCharge, addons, protection },
  gateway: 'stripe',
  stripe_checkout_session_id,
  stripe_payment_intent_id,
  stripe_invoice_id,
  created_at, updated_at, paid_at
}
```

---

## Installation

```bash
npm install uuid
npm install --save-dev @types/uuid
```

---

## Environment Variables

```env
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Testing Checklist

- [ ] BookingId generation works
- [ ] LocalStorage persistence works
- [ ] Checkout Session creation and redirect
- [ ] Invoice creation
- [ ] Webhook handlers (use Stripe CLI)
- [ ] Payment success flow
- [ ] Reconciliation via webhooks

---

## Migration Order

1. Generate bookingId (non-breaking)
2. Add localStorage persistence
3. Create Checkout Session endpoint
4. Create Invoice endpoint
5. Update payment page UI
6. Implement webhooks
7. Remove old Payment Intent flow

---

See `BOOKING_PAYMENT_MIGRATION_GUIDE.md` for detailed implementation.

