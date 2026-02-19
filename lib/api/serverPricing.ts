import type { Pricing } from '@/store/slices/pricingSlice';

export async function getServerPricingData(): Promise<Pricing | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!API_BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/public/pricing`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pricing: ${response.status} ${response.statusText}`);
    }

    const apiResponse = await response.json();
    
    const data: Pricing = {
      ...apiResponse,
      deliveryZones: Array.isArray(apiResponse.deliveryZones)
        ? apiResponse.deliveryZones
        : apiResponse.deliveryZones?.data || apiResponse.deliveryZones || undefined
    };
    
    return data;
  } catch (error: unknown) {
    console.error("Error fetching server pricing data:", error);
    return null;
  }
}

