// Server-side function to fetch pricing data
// Uses native fetch since this runs on the server
import type { Pricing } from '@/store/slices/pricingSlice';

export async function getServerPricingData(): Promise<Pricing | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!API_BASE_URL) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not set, returning null");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/public/pricing`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache revalidation if needed
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pricing: ${response.statusText}`);
    }

    const data: Pricing = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pricing data:", error);
    // Return null on error - client can handle fallback
    return null;
  }
}

