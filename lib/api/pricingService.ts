import axios from 'axios';
import type { Pricing } from '@/store/slices/pricingSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getPricingData = async (): Promise<Pricing> => {
    try {
        const response = await axios.get<Pricing>(`${API_BASE_URL}/api/public/pricing`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch pricing data');
        }
        throw error;
    }
};

export default getPricingData;