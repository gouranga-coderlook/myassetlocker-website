"use client";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setLocationData } from "@/store/slices/cartSlice";
import type { DeliveryZone } from "@/store/slices/pricingSlice";

interface Store {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region: "india" | "usa";
}

// Store locations data
const STORE_LOCATIONS: Store[] = [
  // India stores
  {
    id: "delhi",
    name: "Delhi Warehouse",
    latitude: 28.6139,
    longitude: 77.2090,
    region: "india"
  },
  {
    id: "mumbai",
    name: "Mumbai Warehouse",
    latitude: 19.0760,
    longitude: 72.8777,
    region: "india"
  },
  {
    id: "chennai",
    name: "Chennai Warehouse",
    latitude: 13.0827,
    longitude: 80.2707,
    region: "india"
  },
  {
    id: "bangalore",
    name: "Bangalore Warehouse",
    latitude: 12.9716,
    longitude: 77.5946,
    region: "india"
  },
  {
    id: "hyderabad",
    name: "Hyderabad Warehouse",
    latitude: 17.3850,
    longitude: 78.4867,
    region: "india"
  },
  {
    id: "kolkata",
    name: "Kolkata Warehouse",
    latitude: 22.5726,
    longitude: 88.3639,
    region: "india"
  },
  {
    id: "pune",
    name: "Pune Warehouse",
    latitude: 18.5204,
    longitude: 73.8567,
    region: "india"
  },
  // USA stores
  {
    id: "newyork",
    name: "New York Warehouse",
    latitude: 40.7128,
    longitude: -74.0060,
    region: "usa"
  },
  {
    id: "losangeles",
    name: "Los Angeles Warehouse",
    latitude: 34.0522,
    longitude: -118.2437,
    region: "usa"
  }
];

// Region-specific settings
const REGION_SETTINGS = {
  india: {
    distanceUnit: "km",
    currency: "₹",
    freeDeliveryThreshold: 1, // km
    chargePerUnit: 100, // ₹ per km after threshold
    maxDeliveryDistance: 10 // km
  },
  usa: {
    distanceUnit: "miles",
    currency: "$",
    freeDeliveryThreshold: 1, // miles
    chargePerUnit: 5, // $ per mile after threshold
    maxDeliveryDistance: 10 // miles
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert kilometers to miles
 */
function kmToMiles(km: number): number {
  return km * 0.621371;
}

interface NearestStoreInfo {
  store: Store;
  distanceKm: number;
  deliveryCharge: number | "out_of_area";
}

interface AddressDetails {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  fullAddress: string;
}

/**
 * Find the nearest store to user's location
 */
function findNearestStore(userLat: number, userLon: number): { store: Store; distanceKm: number } {
  let nearestStore: Store | null = null;
  let minDistance = Infinity;
  
  STORE_LOCATIONS.forEach((store) => {
    const distance = calculateDistance(
      userLat,
      userLon,
      store.latitude,
      store.longitude
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestStore = store;
    }
  });
  
  return {
    store: nearestStore!,
    distanceKm: minDistance
  };
}

/**
 * Calculate delivery charge based on region and distance
 */
/**
 * Reverse geocoding: Convert coordinates to address details
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */
async function reverseGeocode(latitude: number, longitude: number): Promise<AddressDetails | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'MyAssetLocker-Website/1.0' // Required by Nominatim
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    
    const data = await response.json();
    const address = data.address || {};
    
    // Extract address components
    const street = address.road || address.street || address.pedestrian || '';
    const city = address.city || address.town || address.village || address.municipality || '';
    const state = address.state || address.region || '';
    const postalCode = address.postcode || address.postal_code || '';
    const country = address.country || '';
    
    // Build full address
    const addressParts = [street, city, state, postalCode, country].filter(Boolean);
    const fullAddress = addressParts.join(', ');
    
    return {
      street: street || 'Not available',
      city: city || 'Not available',
      state: state || 'Not available',
      postalCode: postalCode || 'Not available',
      country: country || 'Not available',
      fullAddress: fullAddress || 'Address not available'
    };
  } catch (error) {
    return null;
  }
}

/**
 * Find matching delivery zone for USA based on distance
 */
function findDeliveryZone(distanceInMiles: number, deliveryZones: DeliveryZone[]): DeliveryZone | null {
  // Filter only active zones and sort by distanceMin
  const activeZones = deliveryZones
    .filter(zone => zone.status?.toLocaleLowerCase() === "active")
    .sort((a, b) => a.distanceMin - b.distanceMin);
  
  // Find the zone that matches the distance
  for (const zone of activeZones) {
    if (distanceInMiles >= zone.distanceMin && distanceInMiles <= zone.distanceMax) {
      return zone;
    }
  }
  
  return null;
}

function calculateDeliveryCharge(
  distance: number, 
  region: "india" | "usa",
  deliveryZones?: DeliveryZone[]
): number | "out_of_area" {
  const settings = REGION_SETTINGS[region];
  
  if (!settings) {
    return 0;
  }
  
  // Convert distance to appropriate unit
  const distanceInUnit = region === "usa" ? kmToMiles(distance) : distance;
  
  // For USA, ONLY use delivery zones from pricing slice (required)
  if (region === "usa") {
    if (!deliveryZones || deliveryZones.length === 0) {
      // If no delivery zones available, return out of area
      return "out_of_area";
    }
    
    const matchingZone = findDeliveryZone(distanceInUnit, deliveryZones);
    
    if (matchingZone) {
      return matchingZone.price;
    }
    
    // Check if beyond maximum zone distance
    const maxZoneDistance = Math.max(...deliveryZones.map(z => z.distanceMax));
    if (distanceInUnit > maxZoneDistance) {
      return "out_of_area";
    }
    
    // If no zone matches but within range, return out of area
    return "out_of_area";
  }
  
  // For India, use the distance-based calculation
  // Check if out of delivery area
  if (distanceInUnit > settings.maxDeliveryDistance) {
    return "out_of_area";
  }
  
  // Free delivery within threshold
  if (distanceInUnit <= settings.freeDeliveryThreshold) {
    return 0;
  }
  
  // Calculate charge for distance beyond threshold
  const chargeableDistance = distanceInUnit - settings.freeDeliveryThreshold;
  const charge = chargeableDistance * settings.chargePerUnit;
  
  return Math.round(charge * 100) / 100; // Round to 2 decimal places
}

export default function StoreLocationFinder() {
  const dispatch = useAppDispatch();
  
  // Get delivery zones from Redux store (pricingSlice)
  // deliveryZones are fetched once in serverPricing.ts and stored in Redux via layout.tsx
  // No API calls are made here - all data comes from Redux store
  const pricingData = useAppSelector((state) => state.pricing.data);
  
  // Get location data from Redux store (cartSlice) - if exists, use it instead of asking permission
  const savedLocationData = useAppSelector((state) => state.cart.locationData);
  
  // Extract deliveryZones from Redux store
  // Handle delivery zones - can be array or { data: [...] } structure
  const deliveryZonesRaw = pricingData?.deliveryZones;
  const deliveryZones = Array.isArray(deliveryZonesRaw)
    ? deliveryZonesRaw
    : (deliveryZonesRaw && typeof deliveryZonesRaw === 'object' && 'data' in deliveryZonesRaw)
    ? (deliveryZonesRaw.data || [])
    : [];
  
  // Track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);
  
  // State for user location
  const [userLocation, setUserLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null
  });
  
  // State for address details
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);
  
  // State for nearest store info
  const [nearestStoreInfo, setNearestStoreInfo] = useState<NearestStoreInfo | null>(null);
  
  // State for matched delivery zone (for USA)
  const [matchedZone, setMatchedZone] = useState<DeliveryZone | null>(null);
  
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Set mounted state on client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Load saved location data from Redux on mount
  useEffect(() => {
    if (!isMounted) return;
    
    if (savedLocationData) {
      // Use saved location data from Redux
      setUserLocation({
        latitude: savedLocationData.latitude,
        longitude: savedLocationData.longitude
      });
      
      if (savedLocationData.addressDetails) {
        setAddressDetails(savedLocationData.addressDetails);
      }
      
      if (savedLocationData.nearestStore && savedLocationData.distanceKm !== null && savedLocationData.deliveryCharge !== null) {
        setNearestStoreInfo({
          store: savedLocationData.nearestStore,
          distanceKm: savedLocationData.distanceKm,
          deliveryCharge: savedLocationData.deliveryCharge
        });
      }
      
      if (savedLocationData.matchedZone) {
        setMatchedZone(savedLocationData.matchedZone);
      }
      
      setLoading(false);
      setError(null);
    }
  }, [isMounted, savedLocationData]);
  
  // Function to process location (used by both geolocation and manual input)
  const processLocation = async (latitude: number, longitude: number) => {
    setUserLocation({ latitude, longitude });
    
    // Get address details using reverse geocoding
    const address = await reverseGeocode(latitude, longitude);
    if (address) {
      setAddressDetails(address);
    }
    
    // Find nearest store
    const { store, distanceKm } = findNearestStore(latitude, longitude);
    
    // For USA, find matching delivery zone (REQUIRED - only uses delivery zones from pricing slice)
    let zone: DeliveryZone | null = null;
    if (store.region === "usa") {
      if (deliveryZones.length > 0) {
        const distanceInMiles = kmToMiles(distanceKm);
        zone = findDeliveryZone(distanceInMiles, deliveryZones);
        setMatchedZone(zone);
      }
    } else {
      setMatchedZone(null);
    }
    
    // Calculate delivery charge (USA uses ONLY delivery zones from pricing slice)
    const deliveryCharge = calculateDeliveryCharge(
      distanceKm,
      store.region,
      deliveryZones
    );
    
    setNearestStoreInfo({
      store,
      distanceKm,
      deliveryCharge
    });
    
    // Store location data in Redux cart slice
    dispatch(setLocationData({
      latitude,
      longitude,
      addressDetails: address || null,
      nearestStore: store,
      distanceKm,
      deliveryCharge,
      matchedZone: zone || null
    }));
    
    setLoading(false);
    setError(null);
  };
  
  // Get user's geolocation on component mount (client-side only)
  // Only request if location data is not already saved in Redux
  useEffect(() => {
    // Only run on client-side
    if (!isMounted) return;
    
    // If location data already exists in Redux, don't ask for permission again
    if (savedLocationData) {
      return;
    }
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    
    // Request user's location
    navigator.geolocation.getCurrentPosition(
      // Success callback
      async (position) => {
        const { latitude, longitude } = position.coords;
        await processLocation(latitude, longitude);
      },
      // Error callback
      (err) => {
        setLoading(false);
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [isMounted, deliveryZones, savedLocationData]);
  
  // Component runs silently in background - no UI displayed
  // Location data is processed and saved to Redux
  return null;
}

