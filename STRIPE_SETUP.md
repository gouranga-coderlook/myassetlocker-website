# Stripe Payment Gateway Integration

This document explains how to set up and use the Stripe payment gateway integration in the application.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Stripe API keys (Publishable Key and Secret Key)

## Setup Instructions

### 1. Install Dependencies

The required Stripe packages are already installed:
- `@stripe/stripe-js` - Client-side Stripe library
- `@stripe/react-stripe-js` - React components for Stripe
- `stripe` - Server-side Stripe library

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Stripe keys:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8089/api
```

**Important:**
- Use `pk_test_...` and `sk_test_...` for testing/development
- Use `pk_live_...` and `sk_live_...` for production
- Never commit your `.env.local` file to version control

### 3. Get Your Stripe Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
4. Add them to your `.env.local` file

## How It Works

### Payment Flow

1. **User completes booking form** → Clicks "Complete Booking"
2. **Authentication check** → If not logged in, shows login popup
3. **After login** → Redirects to `/payment` page
4. **Payment page** → Creates Stripe Payment Intent via API
5. **Stripe Elements** → User enters payment details
6. **Payment confirmation** → Stripe processes payment
7. **Order completion** → Backend creates order, cart is cleared
8. **Success page** → User sees confirmation

### API Routes

#### 1. Create Payment Intent
**POST** `/api/payments/create-intent`

Creates a Stripe Payment Intent with the booking data.

**Request Body:**
```json
{
  "amount": 10000,  // Amount in cents (e.g., $100.00 = 10000)
  "currency": "usd",
  "bookingData": {
    "plan": {...},
    "selectedMonths": 6,
    "selectedBins": 5,
    "selectedAddons": [...],
    "climateControl": false,
    "protectionPlan": {...},
    "total": 100.00,
    "contactDetails": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "deliveryAddress": {
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "notes": "Ring doorbell"
    }
  }
}
```

**Response:**
```json
{
  "message": "Payment intent created successfully",
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  },
  "success": true
}
```

#### 2. Confirm Payment
**POST** `/api/payments/confirm/[paymentIntentId]`

Confirms payment and creates order in backend.

**Response:**
```json
{
  "message": "Order confirmed successfully",
  "data": {
    "orderId": "order_xxx",
    "paymentIntentId": "pi_xxx"
  },
  "success": true
}
```

## Backend Integration

The payment confirmation endpoint (`/api/payments/confirm/[paymentIntentId]`) calls your backend API to create the order:

**Endpoint:** `POST /orders/create`

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "amount": 100.00,
  "currency": "usd",
  "status": "completed",
  "bookingData": {...}
}
```

Make sure your backend has this endpoint implemented to create orders after successful payment.

## Testing

### Test Cards

Use these test card numbers in Stripe test mode:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

### Test Mode vs Live Mode

- **Test Mode:** Use `pk_test_...` and `sk_test_...` keys
- **Live Mode:** Use `pk_live_...` and `sk_live_...` keys

Switch between modes in your Stripe Dashboard.

## Security Notes

1. **Never expose your Secret Key** - Only use it in server-side code (API routes)
2. **Use HTTPS in production** - Stripe requires HTTPS for live payments
3. **Validate amounts server-side** - Always verify payment amounts on your backend
4. **Handle webhooks** - Set up Stripe webhooks for payment status updates (optional but recommended)

## Files Created

- `lib/api/stripeService.ts` - Stripe service functions
- `app/payment/page.tsx` - Payment page component
- `components/payment/PaymentForm.tsx` - Stripe payment form
- `app/payment/success/page.tsx` - Payment success page
- `app/api/payments/create-intent/route.ts` - API route for creating payment intent
- `app/api/payments/confirm/[paymentIntentId]/route.ts` - API route for confirming payment

## Troubleshooting

### Payment Intent Creation Fails
- Check that `STRIPE_SECRET_KEY` is set correctly
- Verify the amount is in cents (multiply dollars by 100)
- Check browser console for errors

### Payment Form Not Loading
- Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check that Stripe Elements are properly initialized
- Verify the client secret is received from the API

### Payment Succeeds But Order Not Created
- Check backend API endpoint `/orders/create` exists
- Verify API authentication tokens are being sent
- Check server logs for errors

