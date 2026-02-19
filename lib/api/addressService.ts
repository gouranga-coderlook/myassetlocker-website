// lib/api/addressService.ts
import type { AxiosResponse } from "axios";
import { apiClient, type CommonResponse } from "./authService";

// Address search parameters matching AddressSearchController
export interface AddressSearchParams {
  partialStreet?: string;
  cityFilter?: string;
  stateFilter?: string;
  pcFilter?: string; // Postal code filter
  countryFilter?: string;
}

// --- Raw API response types (PostGrid /address/find) ---

export interface PostGridAddress {
  id: string | null;
  address: string;
  city: string;
  pc: string;
  prov: string;
  country: string;
}

export interface PostGridAddressItemErrors {
  line1: string | null;
}

export interface PostGridAddressItem {
  address: PostGridAddress;
  errors: PostGridAddressItemErrors;
}

export interface PostGridFindPayload {
  status: string;
  message: string;
  data: PostGridAddressItem[];
}

// --- Normalized type returned to callers ---

export interface AddressSuggestion {
  id?: string | null;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  fullAddress?: string;
}

function mapPostGridItemToSuggestion(item: PostGridAddressItem): AddressSuggestion {
  const a = item.address;
  const parts = [a.address, a.city, a.prov, a.pc, a.country].filter(Boolean);
  return {
    id: a.id,
    street: a.address,
    city: a.city,
    state: a.prov,
    postalCode: a.pc,
    country: a.country,
    fullAddress: parts.join(", "),
  };
}

/**
 * Find address suggestions using PostGrid API via AddressSearchController
 * GET /address/find
 * 
 * @param params - Address search parameters
 * @returns Promise with address suggestions
 */
export async function findAddress(
  params?: AddressSearchParams
): Promise<AddressSuggestion[]> {
  try {
    // Build query parameters
    const queryParams: Record<string, string> = {};
    
    if (params?.partialStreet) {
      queryParams.partialStreet = params.partialStreet;
    }
    if (params?.cityFilter) {
      queryParams.cityFilter = params.cityFilter;
    }
    if (params?.stateFilter) {
      queryParams.stateFilter = params.stateFilter;
    }
    if (params?.pcFilter) {
      queryParams.pcFilter = params.pcFilter;
    }
    if (params?.countryFilter) {
      queryParams.countryFilter = params.countryFilter;
    }

    const response: AxiosResponse<CommonResponse<PostGridFindPayload>> =
      await apiClient.get<CommonResponse<PostGridFindPayload>>("/address/find", {
        params: queryParams,
      });

    if (!response.data.success || !response.data.data) {
      return [];
    }

    const payload = response.data.data;
    const items = Array.isArray(payload.data) ? payload.data : [];

    return items.map((item) => mapPostGridItemToSuggestion(item));
  } catch (error) {
    console.error("Error fetching address suggestions:", error);
    return [];
  }
}




