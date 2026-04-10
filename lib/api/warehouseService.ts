import type { AxiosResponse } from "axios";
import { apiClient, type CommonResponse } from "./authService";

export interface WarehouseGeo {
  latitude: number;
  longitude: number;
}

export interface WarehouseAddress {
  id?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type WarehouseDistanceCharge = {
  distanceFromMiles: number;
  distanceToMiles: number;
  price: number;
};

export interface Warehouse {
  id: string;
  name: string;
  status?: string;
  geo: WarehouseGeo | null;
  address?: WarehouseAddress | null;
  distanceCharges: WarehouseDistanceCharge[];
}

export interface ResolveDeliveryFeeRequest {
  address?: {
    streetAddress1: string;
    streetAddress2?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  lat?: number;
  lng?: number;
  distanceChargesBufferMiles?: number;
}

export interface ResolveDeliveryFeeResponse {
  isServiceable: boolean;
  distanceChargesBufferMiles?: number | null;
  // Legacy single-option fields (kept optional for backward compatibility)
  warehouseId?: string | null;
  warehouseName?: string | null;
  distanceMiles?: number | null;
  fee?: number | null;
  matchedDistanceFromMiles?: number | null;
  matchedDistanceToMiles?: number | null;
  // New prioritized options list
  warehouseOptions?: Array<{
    warehouseId: string;
    warehouseName: string;
    distanceMiles: number;
    fee: number;
    matchedDistanceFromMiles?: number | null;
    matchedDistanceToMiles?: number | null;
    priorityRank?: number;
  }> | null;
  reasonCode: "GEOCODE_FAILED" | "OUT_OF_SERVICE_AREA" | "NO_ACTIVE_WAREHOUSE" | string | null;
  reason: string | null;
}

type RawWarehouseDistanceCharge = {
  distanceFromMiles?: number;
  distanceToMiles?: number;
  price?: number;
};

type RawWarehouse = {
  id?: string;
  name?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  geo?: {
    lat?: number;
    lng?: number;
  };
  address?: WarehouseAddress;
  distanceCharges?: RawWarehouseDistanceCharge[];
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeDistanceCharges(
  charges: RawWarehouseDistanceCharge[] | undefined
): WarehouseDistanceCharge[] {
  if (!Array.isArray(charges)) return [];

  return charges
    .map((charge) => {
      const distanceFromMiles = toNumber(charge.distanceFromMiles);
      const distanceToMiles = toNumber(charge.distanceToMiles);
      const price = toNumber(charge.price);

      if (
        distanceFromMiles === null ||
        distanceToMiles === null ||
        price === null
      ) {
        return null;
      }

      return {
        distanceFromMiles,
        distanceToMiles,
        price,
      };
    })
    .filter((charge): charge is WarehouseDistanceCharge => charge !== null);
}

function normalizeWarehouse(raw: RawWarehouse): Warehouse | null {
  if (!raw.id || !raw.name) return null;

  const geo = raw.geo;
  const lat = toNumber(geo?.lat);
  const long = toNumber(geo?.lng);

  return {
    id: raw.id,
    name: raw.name,
    status: raw.status,
    geo:
      lat !== null && long !== null
        ? {
            latitude: lat,
            longitude: long,
          }
        : null,
    address: raw.address ?? null,
    distanceCharges: normalizeDistanceCharges(raw.distanceCharges),
  };
}

export async function getWarehouses(): Promise<Warehouse[]> {
  const response: AxiosResponse<
    | CommonResponse<
        RawWarehouse[] | RawWarehouse | { data?: RawWarehouse[] | RawWarehouse }
      >
    | RawWarehouse[]
    | RawWarehouse
  > =
    await apiClient.get("/warehouses");

  const payload = response.data;
  let rows: RawWarehouse[] = [];

  if (Array.isArray(payload)) {
    rows = payload;
  } else if (payload && typeof payload === "object" && "data" in payload) {
    const wrapped = payload as CommonResponse<
      RawWarehouse[] | RawWarehouse | { data?: RawWarehouse[] | RawWarehouse }
    >;
    const innerData = wrapped.data;
    if (Array.isArray(innerData)) {
      rows = innerData;
    } else if (
      innerData &&
      typeof innerData === "object" &&
      "id" in innerData &&
      "name" in innerData
    ) {
      rows = [innerData as RawWarehouse];
    } else if (innerData && typeof innerData === "object" && "data" in innerData) {
      const nested = innerData as { data?: RawWarehouse[] | RawWarehouse };
      if (Array.isArray(nested.data)) {
        rows = nested.data;
      } else if (
        nested.data &&
        typeof nested.data === "object" &&
        !Array.isArray(nested.data) &&
        "id" in nested.data &&
        "name" in nested.data
      ) {
        rows = [nested.data as RawWarehouse];
      }
    }
  } else if (payload && typeof payload === "object" && "id" in payload && "name" in payload) {
    rows = [payload as RawWarehouse];
  }

  return rows
    .map(normalizeWarehouse)
    .filter((warehouse): warehouse is Warehouse => warehouse !== null);
}

export async function resolveDeliveryFee(
  payload: ResolveDeliveryFeeRequest
): Promise<ResolveDeliveryFeeResponse> {
  const response: AxiosResponse<CommonResponse<ResolveDeliveryFeeResponse>> =
    await apiClient.post("/warehouses/resolve-delivery-fee", payload);

  if (!response.data?.success || !response.data.data) {
    throw new Error(response.data?.message || "Failed to resolve delivery fee");
  }

  return response.data.data;
}
