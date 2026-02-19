# Frontend Payment API Call Examples

This document provides TypeScript examples for calling the payment APIs from the frontend, including:
- **Next.js with Redux Store** (Redux Toolkit)
- **Angular/Ionic** examples

Choose the framework that matches your project.

## Configuration

### Base URL
```typescript
const BASE_URL = 'http://localhost:8089/api';
```

---

## Next.js with Redux Store Integration

### Prerequisites

Install required packages:
```bash
npm install @reduxjs/toolkit react-redux axios
# or
yarn add @reduxjs/toolkit react-redux axios
```

### TypeScript Interfaces

Create `types/payment.types.ts`:
```typescript
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
  meta?: Record<string, any>;
}

export interface InvoiceRequest {
  bookingId: string; // UUID
  customer: Customer;
  cartLines: CartLineItem[];
  totals?: Totals;
  meta?: Record<string, any>;
}

export interface CheckoutSessionResponse {
  message: string;
  data: {
    checkoutUrl: string;
    checkoutSessionId: string;
    paymentIntentId: string | null;
  };
  success: boolean;
}

export interface InvoiceResponse {
  message: string;
  data: {
    invoiceId: string;
    hostedInvoiceUrl: string | null;
  };
  success: boolean;
}

export interface PaymentState {
  checkoutSession: {
    loading: boolean;
    data: CheckoutSessionResponse | null;
    error: string | null;
  };
  invoice: {
    loading: boolean;
    data: InvoiceResponse | null;
    error: string | null;
  };
}
```

### API Service

Create `services/paymentApi.ts`:
```typescript
import axios from 'axios';
import {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  InvoiceRequest,
  InvoiceResponse,
} from '@/types/payment.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8089/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add Authorization header if you have a token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export const paymentApi = {
  /**
   * Create Stripe Checkout Session (Pay Now)
   */
  createCheckoutSession: async (
    request: CheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> => {
    const response = await apiClient.post<CheckoutSessionResponse>(
      '/create-checkout-session',
      request
    );
    return response.data;
  },

  /**
   * Create Stripe Invoice (Invoice Me)
   */
  createInvoice: async (request: InvoiceRequest): Promise<InvoiceResponse> => {
    const response = await apiClient.post<InvoiceResponse>('/create-invoice', request);
    return response.data;
  },
};
```

### Redux Store Setup

Create `store/index.ts`:
```typescript
import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Redux Slice

Create `store/slices/paymentSlice.ts`:
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { paymentApi } from '@/services/paymentApi';
import {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  InvoiceRequest,
  InvoiceResponse,
  PaymentState,
} from '@/types/payment.types';

const initialState: PaymentState = {
  checkoutSession: {
    loading: false,
    data: null,
    error: null,
  },
  invoice: {
    loading: false,
    data: null,
    error: null,
  },
};

// Async Thunk for Checkout Session
export const createCheckoutSession = createAsyncThunk(
  'payment/createCheckoutSession',
  async (request: CheckoutSessionRequest, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createCheckoutSession(request);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create checkout session');
    }
  }
);

// Async Thunk for Invoice
export const createInvoice = createAsyncThunk(
  'payment/createInvoice',
  async (request: InvoiceRequest, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createInvoice(request);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create invoice');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearCheckoutSession: (state) => {
      state.checkoutSession = {
        loading: false,
        data: null,
        error: null,
      };
    },
    clearInvoice: (state) => {
      state.invoice = {
        loading: false,
        data: null,
        error: null,
      };
    },
    clearAll: (state) => {
      state.checkoutSession = initialState.checkoutSession;
      state.invoice = initialState.invoice;
    },
  },
  extraReducers: (builder) => {
    // Checkout Session reducers
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.checkoutSession.loading = true;
        state.checkoutSession.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action: PayloadAction<CheckoutSessionResponse>) => {
        state.checkoutSession.loading = false;
        state.checkoutSession.data = action.payload;
        state.checkoutSession.error = null;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.checkoutSession.loading = false;
        state.checkoutSession.error = action.payload as string;
        state.checkoutSession.data = null;
      });

    // Invoice reducers
    builder
      .addCase(createInvoice.pending, (state) => {
        state.invoice.loading = true;
        state.invoice.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action: PayloadAction<InvoiceResponse>) => {
        state.invoice.loading = false;
        state.invoice.data = action.payload;
        state.invoice.error = null;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.invoice.loading = false;
        state.invoice.error = action.payload as string;
        state.invoice.data = null;
      });
  },
});

export const { clearCheckoutSession, clearInvoice, clearAll } = paymentSlice.actions;
export default paymentSlice.reducer;
```

### Redux Hooks

Create `store/hooks.ts`:
```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Provider Setup

Update `pages/_app.tsx` or `app/layout.tsx` (depending on Next.js version):
```typescript
import { Provider } from 'react-redux';
import { store } from '@/store';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
```

### Component Usage Example

Create `components/PaymentCheckout.tsx`:
```typescript
'use client'; // For Next.js 13+ App Router

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCheckoutSession, clearCheckoutSession } from '@/store/slices/paymentSlice';
import { CheckoutSessionRequest } from '@/types/payment.types';

interface PaymentCheckoutProps {
  bookingId: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  cartLines: Array<{
    sku: string;
    name: string;
    description: string;
    amount: number;
    quantity: number;
  }>;
  totals?: {
    subtotal?: number;
    tax?: number;
    total?: number;
  };
}

export default function PaymentCheckout({
  bookingId,
  customer,
  cartLines,
  totals,
}: PaymentCheckoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, data, error } = useAppSelector((state) => state.payment.checkoutSession);

  const handleProceedToCheckout = () => {
    const request: CheckoutSessionRequest = {
      bookingId,
      customer,
      cartLines,
      totals,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    dispatch(createCheckoutSession(request));
  };

  useEffect(() => {
    if (data?.success && data.data?.checkoutUrl) {
      // Redirect to Stripe Checkout
      window.location.href = data.data.checkoutUrl;
    }
  }, [data]);

  useEffect(() => {
    // Clear state when component unmounts
    return () => {
      dispatch(clearCheckoutSession());
    };
  }, [dispatch]);

  return (
    <div className="payment-checkout">
      <button
        onClick={handleProceedToCheckout}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {data && !data.success && (
        <div className="error-message" role="alert">
          {data.message}
        </div>
      )}
    </div>
  );
}
```

### Invoice Component Example

Create `components/PaymentInvoice.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createInvoice, clearInvoice } from '@/store/slices/paymentSlice';
import { InvoiceRequest } from '@/types/payment.types';

interface PaymentInvoiceProps {
  bookingId: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  cartLines: Array<{
    sku: string;
    name: string;
    description: string;
    amount: number;
    quantity: number;
  }>;
  totals?: {
    subtotal?: number;
    tax?: number;
    total?: number;
  };
}

export default function PaymentInvoice({
  bookingId,
  customer,
  cartLines,
  totals,
}: PaymentInvoiceProps) {
  const dispatch = useAppDispatch();
  const { loading, data, error } = useAppSelector((state) => state.payment.invoice);

  const handleCreateInvoice = () => {
    const request: InvoiceRequest = {
      bookingId,
      customer,
      cartLines,
      totals,
    };

    dispatch(createInvoice(request));
  };

  useEffect(() => {
    // Clear state when component unmounts
    return () => {
      dispatch(clearInvoice());
    };
  }, [dispatch]);

  return (
    <div className="payment-invoice">
      <button
        onClick={handleCreateInvoice}
        disabled={loading}
        className="btn btn-secondary"
      >
        {loading ? 'Creating Invoice...' : 'Create Invoice'}
      </button>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {data?.success && (
        <div className="success-message">
          <p>Invoice created successfully!</p>
          {data.data.hostedInvoiceUrl && (
            <a
              href={data.data.hostedInvoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="invoice-link"
            >
              View Invoice
            </a>
          )}
        </div>
      )}
    </div>
  );
}
```

### Complete Example with Custom Hook

Create `hooks/usePayment.ts`:
```typescript
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createCheckoutSession,
  createInvoice,
  clearCheckoutSession,
  clearInvoice,
} from '@/store/slices/paymentSlice';
import {
  CheckoutSessionRequest,
  InvoiceRequest,
} from '@/types/payment.types';

export const usePayment = () => {
  const dispatch = useAppDispatch();
  const checkoutState = useAppSelector((state) => state.payment.checkoutSession);
  const invoiceState = useAppSelector((state) => state.payment.invoice);

  const handleCheckout = useCallback(
    (request: CheckoutSessionRequest) => {
      dispatch(createCheckoutSession(request));
    },
    [dispatch]
  );

  const handleCreateInvoice = useCallback(
    (request: InvoiceRequest) => {
      dispatch(createInvoice(request));
    },
    [dispatch]
  );

  const clearCheckout = useCallback(() => {
    dispatch(clearCheckoutSession());
  }, [dispatch]);

  const clearInvoiceData = useCallback(() => {
    dispatch(clearInvoice());
  }, [dispatch]);

  return {
    // Checkout
    checkoutLoading: checkoutState.loading,
    checkoutData: checkoutState.data,
    checkoutError: checkoutState.error,
    handleCheckout,
    clearCheckout,

    // Invoice
    invoiceLoading: invoiceState.loading,
    invoiceData: invoiceState.data,
    invoiceError: invoiceState.error,
    handleCreateInvoice,
    clearInvoiceData,
  };
};
```

### Usage with Custom Hook

```typescript
'use client';

import { useEffect } from 'react';
import { usePayment } from '@/hooks/usePayment';
import { CheckoutSessionRequest } from '@/types/payment.types';

export default function PaymentPage() {
  const {
    checkoutLoading,
    checkoutData,
    checkoutError,
    handleCheckout,
    clearCheckout,
  } = usePayment();

  const bookingId = '123e4567-e89b-12d3-a456-426614174000';

  const handleProceedToCheckout = () => {
    const request: CheckoutSessionRequest = {
      bookingId,
      customer: {
        email: 'customer@example.com',
        name: 'John Doe',
        phone: '+1234567890',
      },
      cartLines: [
        {
          sku: 'bin-001',
          name: 'Storage Bin',
          description: 'Standard storage bin',
          amount: 29.99,
          quantity: 2,
        },
      ],
      totals: {
        subtotal: 59.98,
        tax: 4.80,
        total: 64.78,
      },
    };

    handleCheckout(request);
  };

  useEffect(() => {
    if (checkoutData?.success && checkoutData.data?.checkoutUrl) {
      window.location.href = checkoutData.data.checkoutUrl;
    }
  }, [checkoutData]);

  useEffect(() => {
    return () => clearCheckout();
  }, [clearCheckout]);

  return (
    <div>
      <button onClick={handleProceedToCheckout} disabled={checkoutLoading}>
        {checkoutLoading ? 'Processing...' : 'Pay Now'}
      </button>
      {checkoutError && <p className="error">{checkoutError}</p>}
    </div>
  );
}
```

---

## Angular/Ionic Examples

## API Endpoints

### 1. Create Checkout Session (Pay Now)

**Endpoint:** `POST /api/create-checkout-session`

**TypeScript Interface:**
```typescript
interface CartLineItem {
  sku: string;
  name: string;
  description: string;
  amount: number; // In dollars
  quantity: number;
}

interface Address {
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

interface Customer {
  email: string;
  name: string;
  phone?: string;
  address?: Address;
}

interface Totals {
  base?: number;
  delivery?: number;
  climate?: number;
  binsCharge?: number;
  subtotal?: number;
  tax?: number;
  total?: number;
}

interface CheckoutSessionRequest {
  bookingId: string; // UUID
  customer: Customer;
  cartLines: CartLineItem[];
  totals?: Totals;
  meta?: Record<string, any>;
}

interface CheckoutSessionResponse {
  message: string;
  data: {
    checkoutUrl: string;
    checkoutSessionId: string;
    paymentIntentId: string | null;
  };
  success: boolean;
}
```

**Angular Service Example:**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:8089/api';

  constructor(private http: HttpClient) {}

  /**
   * Create Stripe Checkout Session
   */
  createCheckoutSession(request: CheckoutSessionRequest): Observable<CheckoutSessionResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add Authorization header if required
      // 'Authorization': `Bearer ${token}`
    });

    return this.http.post<CheckoutSessionResponse>(
      `${this.baseUrl}/create-checkout-session`,
      request,
      { headers }
    );
  }
}
```

**Usage Example:**
```typescript
import { Component } from '@angular/core';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent {
  constructor(private paymentService: PaymentService) {}

  async proceedToCheckout(bookingId: string) {
    const request: CheckoutSessionRequest = {
      bookingId: bookingId,
      customer: {
        email: 'customer@example.com',
        name: 'John Doe',
        phone: '+1234567890',
        address: {
          streetAddress1: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      cartLines: [
        {
          sku: 'bin-001',
          name: 'Storage Bin',
          description: 'Standard storage bin (24" x 18" x 16")',
          amount: 29.99,
          quantity: 2
        },
        {
          sku: 'delivery-001',
          name: 'Delivery Fee',
          description: 'Standard delivery service',
          amount: 10.00,
          quantity: 1
        },
        {
          sku: 'climate-001',
          name: 'Climate Control',
          description: 'Climate-controlled storage',
          amount: 5.00,
          quantity: 1
        }
      ],
      totals: {
        base: 59.98,
        delivery: 10.00,
        climate: 5.00,
        binsCharge: 59.98,
        subtotal: 74.98,
        tax: 6.00,
        total: 80.98
      },
      meta: {
        planType: 'monthly',
        startDate: '2024-01-15'
      }
    };

    try {
      const response = await this.paymentService.createCheckoutSession(request).toPromise();
      
      if (response?.success && response.data?.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        console.error('Failed to create checkout session:', response);
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      alert(error.error?.message || 'An error occurred. Please try again.');
    }
  }
}
```

**Complete Example with Error Handling:**
```typescript
async proceedToCheckout(bookingId: string) {
  const request: CheckoutSessionRequest = {
    bookingId: bookingId,
    customer: {
      email: 'customer@example.com',
      name: 'John Doe',
      phone: '+1234567890'
    },
    cartLines: [
      {
        sku: 'bin-001',
        name: 'Storage Bin',
        description: 'Standard storage bin',
        amount: 29.99,
        quantity: 2
      }
    ],
    totals: {
      subtotal: 59.98,
      tax: 4.80,
      total: 64.78
    }
  };

  this.paymentService.createCheckoutSession(request).subscribe({
    next: (response) => {
      if (response.success && response.data?.checkoutUrl) {
        // Redirect to checkout URL
        window.location.href = response.data.checkoutUrl;
      } else {
        this.showError(response.message || 'Failed to create checkout session');
      }
    },
    error: (error) => {
      const errorMessage = error.error?.message || error.message || 'An error occurred';
      this.showError(errorMessage);
    }
  });
}
```

---

### 2. Create Invoice (Invoice Me)

**Endpoint:** `POST /api/create-invoice`

**TypeScript Interface:**
```typescript
interface InvoiceRequest {
  bookingId: string; // UUID
  customer: Customer;
  cartLines: CartLineItem[];
  totals?: Totals;
  meta?: Record<string, any>;
}

interface InvoiceResponse {
  message: string;
  data: {
    invoiceId: string;
    hostedInvoiceUrl: string | null;
  };
  success: boolean;
}
```

**Angular Service Method:**
```typescript
/**
 * Create Stripe Invoice
 */
createInvoice(request: InvoiceRequest): Observable<InvoiceResponse> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // Add Authorization header if required
    // 'Authorization': `Bearer ${token}`
  });

  return this.http.post<InvoiceResponse>(
    `${this.baseUrl}/create-invoice`,
    request,
    { headers }
  );
}
```

**Usage Example:**
```typescript
async createInvoiceForBooking(bookingId: string) {
  const request: InvoiceRequest = {
    bookingId: bookingId,
    customer: {
      email: 'customer@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      address: {
        streetAddress1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    },
    cartLines: [
      {
        sku: 'bin-001',
        name: 'Storage Bin',
        description: 'Standard storage bin (24" x 18" x 16")',
        amount: 29.99,
        quantity: 2
      },
      {
        sku: 'delivery-001',
        name: 'Delivery Fee',
        description: 'Standard delivery service',
        amount: 10.00,
        quantity: 1
      }
    ],
    totals: {
      base: 59.98,
      delivery: 10.00,
      subtotal: 69.98,
      tax: 5.60,
      total: 75.58
    }
  };

  try {
    const response = await this.paymentService.createInvoice(request).toPromise();
    
    if (response?.success && response.data?.invoiceId) {
      console.log('Invoice created:', response.data.invoiceId);
      
      if (response.data.hostedInvoiceUrl) {
        // Optionally redirect to invoice URL
        // window.location.href = response.data.hostedInvoiceUrl;
      }
      
      this.showSuccess('Invoice created successfully. You will receive an email with payment instructions.');
    } else {
      this.showError(response?.message || 'Failed to create invoice');
    }
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    this.showError(error.error?.message || 'An error occurred. Please try again.');
  }
}
```

---

## Complete Service File Example

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaces
export interface CartLineItem {
  sku: string;
  name: string;
  description: string;
  amount: number;
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
  bookingId: string;
  customer: Customer;
  cartLines: CartLineItem[];
  totals?: Totals;
  meta?: Record<string, any>;
}

export interface InvoiceRequest {
  bookingId: string;
  customer: Customer;
  cartLines: CartLineItem[];
  totals?: Totals;
  meta?: Record<string, any>;
}

export interface CheckoutSessionResponse {
  message: string;
  data: {
    checkoutUrl: string;
    checkoutSessionId: string;
    paymentIntentId: string | null;
  };
  success: boolean;
}

export interface InvoiceResponse {
  message: string;
  data: {
    invoiceId: string;
    hostedInvoiceUrl: string | null;
  };
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:8089/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Add Authorization header if you have a token
    // const token = this.authService.getToken();
    // if (token) {
    //   headers = headers.set('Authorization', `Bearer ${token}`);
    // }

    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('Payment API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Create Stripe Checkout Session (Pay Now)
   */
  createCheckoutSession(request: CheckoutSessionRequest): Observable<CheckoutSessionResponse> {
    return this.http.post<CheckoutSessionResponse>(
      `${this.baseUrl}/create-checkout-session`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create Stripe Invoice (Invoice Me)
   */
  createInvoice(request: InvoiceRequest): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(
      `${this.baseUrl}/create-invoice`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
```

---

## Demo Mode Testing

When `stripe.demo.mode=true` in `application.properties`, the API returns mock responses:

- **Checkout Session:** Returns a demo URL like `https://checkout.stripe.com/demo/session/cs_demo_...`
- **Invoice:** Returns a demo invoice ID like `in_demo_...`

### Testing in Demo Mode

1. **Set demo mode in application.properties:**
   ```properties
   stripe.demo.mode=true
   ```

2. **Make API calls as normal** - they will return mock responses without calling Stripe

3. **To switch to real Stripe:**
   ```properties
   stripe.demo.mode=false
   stripe.api.key=sk_test_your_actual_stripe_key
   ```

---

## Sample Request Bodies

### Checkout Session Request
```json
{
  "bookingId": "123e4567-e89b-12d3-a456-426614174000",
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": {
      "streetAddress1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  },
  "cartLines": [
    {
      "sku": "bin-001",
      "name": "Storage Bin",
      "description": "Standard storage bin (24\" x 18\" x 16\")",
      "amount": 29.99,
      "quantity": 2
    },
    {
      "sku": "delivery-001",
      "name": "Delivery Fee",
      "description": "Standard delivery service",
      "amount": 10.00,
      "quantity": 1
    }
  ],
  "totals": {
    "base": 59.98,
    "delivery": 10.00,
    "subtotal": 69.98,
    "tax": 5.60,
    "total": 75.58
  },
  "meta": {
    "planType": "monthly",
    "startDate": "2024-01-15"
  }
}
```

### Invoice Request
```json
{
  "bookingId": "123e4567-e89b-12d3-a456-426614174000",
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe",
    "phone": "+1234567890"
  },
  "cartLines": [
    {
      "sku": "bin-001",
      "name": "Storage Bin",
      "description": "Standard storage bin",
      "amount": 29.99,
      "quantity": 2
    }
  ],
  "totals": {
    "subtotal": 59.98,
    "tax": 4.80,
    "total": 64.78
  }
}
```

---

## Response Examples

### Checkout Session Response (Success)
```json
{
  "message": "Checkout session created successfully",
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/demo/session/cs_demo_...",
    "checkoutSessionId": "cs_demo_...",
    "paymentIntentId": "pi_demo_..."
  },
  "success": true
}
```

### Invoice Response (Success)
```json
{
  "message": "Invoice created successfully",
  "data": {
    "invoiceId": "in_demo_...",
    "hostedInvoiceUrl": "https://invoice.stripe.com/demo/invoice/in_demo_..."
  },
  "success": true
}
```

### Error Response
```json
{
  "message": "Booking not found",
  "data": null,
  "success": false
}
```

---

## Notes

1. **Demo Mode:** When `stripe.demo.mode=true`, all API calls return mock responses without calling Stripe
2. **Production Mode:** Set `stripe.demo.mode=false` and provide real Stripe API keys
3. **Error Handling:** Always handle errors and show user-friendly messages
4. **Booking ID:** Must be a valid UUID that exists in the database
5. **Amounts:** All amounts are in dollars (will be converted to cents by backend)
6. **Redirects:** For checkout sessions, redirect user to `checkoutUrl` after successful creation

