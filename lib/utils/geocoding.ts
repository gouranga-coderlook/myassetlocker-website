import { apiClient, type CommonResponse } from "@/lib/api/authService";
import toast from "react-hot-toast";

type GeocodeCoordinate = {
  lat: number;
  long: number;
};

type AddressGeocodeRequestDto = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};

type AddressGeocodeResponseDto = {
  lat?: number;
  lng?: number;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function extractCoordinate(payload: AddressGeocodeResponseDto | null | undefined): GeocodeCoordinate | null {
  if (!payload) return null;
  const lat = toNumber(payload.lat);
  const long = toNumber(payload.lng);
  if (lat === null || long === null) return null;
  return { lat, long };
}

export async function geocodeAddress(
  addressLine1: string,
  city: string,
  state: string,
  zipCode: string,
  country: string
): Promise<GeocodeCoordinate | null> {
  const body: AddressGeocodeRequestDto = {
    addressLine1,
    addressLine2: "",
    city,
    state,
    zipcode: zipCode,
    country: country?.trim() ? country.trim().toUpperCase() : "US",
  };

  try {
    const response = await apiClient.post<CommonResponse<AddressGeocodeResponseDto>>(
      "/address/geocode",
      body
    );
    if (!response.data?.success) return null;
    return extractCoordinate(response.data.data);
  } catch {
    // show toast error
    toast.error("Could not validate address for delivery pricing");
    return null;
  }
}
