// lib/api/invoiceService.ts
import { apiClient, type CommonResponse } from "./authService";

// Invoice Types
export interface InvoiceItem {
  type: "storage" | "addon" | "protection" | "bundle";
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface InvoiceCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface InvoicePlan {
  id: string;
  name: string;
  details: string;
  hasDiscount: boolean;
  discountPercentage: number;
  perBinPrice: number;
}

export interface InvoiceSummary {
  total: number;
  baseStorageCost: number;
  redeliveryFee: number;
  climateControlCost: number;
  addonsCost: number;
  addonsDeliveryCost: number;
  protectionPlanCost: number;
  savings: number;
  zoneDeliveryCharges: number;
  currency: string;
}

export interface Invoice {
  id: string;
  invoiceDate: string;
  paymentStatus: "PAID" | "PENDING" | "FAILED" | "CANCELLED";
  paymentId: string;
  cartItemId: string;
  customer: InvoiceCustomer;
  items: InvoiceItem[];
  plan: InvoicePlan;
  summary: InvoiceSummary;
}


/**
 * Get invoice by ID
 * GET /invoices/{invoiceId}
 */
export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  try {
    const response = await apiClient.get<Invoice | CommonResponse<Invoice>>(`/invoices/${invoiceId}`);
    
    // Handle both direct response and CommonResponse wrapper
    if (!response.data || typeof response.data !== 'object') {
      return null;
    }
    
    // Check if it's a CommonResponse wrapper
    if ('success' in response.data && 'data' in response.data) {
      const commonResponse = response.data;
      if (commonResponse.success && commonResponse.data) {
        return commonResponse.data;
      }
      return null;
    }
    
    // Direct Invoice object response
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
}

/**
 * Get all invoices for the current user
 * GET /invoices
 */
export async function getUserInvoices(): Promise<Invoice[]> {
  try {
    const response = await apiClient.get<Invoice[] | CommonResponse<Invoice[]>>("/invoices");
    
    // Handle both direct array response and CommonResponse wrapper
    if (Array.isArray(response.data)) {
      // Direct array response
      return response.data;
    }
    
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      // CommonResponse wrapper
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

