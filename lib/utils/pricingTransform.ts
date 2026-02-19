import type { Pricing, Plan } from "@/store/slices/pricingSlice";

// Component-expected format types
export interface TransformedPricingData {
  prepaid: {
    grid: {
      totals: Record<string, Record<string, number>>; // bins -> months -> total
    };
  };
  monthToMonth: {
    grid: {
      totals: Record<string, Record<string, number>>; // bins -> months -> total
    };
  };
  addons: Record<string, { price: number; name: string; icon: string }>;
  bundles: Record<string, {
    name: string;
    bins: number;
    price: number;
    months: number;
    features: string[];
    bulkyItem?: number;
    extras?: Record<string, number>;
  }>;
  protectionPlans: Record<string, {
    name: string;
    price: number;
    limit: string;
    description: string;
    monthly: boolean;
    included: boolean;
    features: string[];
    popular?: boolean;
  }>;
}

// Icon mapping for addons
const ADDON_ICONS: Record<string, string> = {
  "Skis/Snowboard": "⛷️",
  "Bicycle": "🚴",
  "E-Bike": "🔋",
  "Climate-Controlled Storage": "🌡️",
  "Seasonal Tires (4)": "🛞",
  "Luggage": "🧳",
};

/**
 * Transform API pricing data into component-expected format
 */
export function transformPricingData(apiData: Pricing | null): TransformedPricingData | null {
  if (!apiData) return null;

  // Find prepaid and month-to-month plans
  const prepaidPlan = apiData.plans.find(
    (plan) => plan.plan_name.toLowerCase().includes("prepaid")
  );
  const monthToMonthPlan = apiData.plans.find(
    (plan) => plan.plan_name.toLowerCase().includes("month")
  );

  // Transform plans to grid format
  const transformPlanToGrid = (plan: Plan | undefined) => {
    if (!plan) return { totals: {} };

    const totals: Record<string, Record<string, number>> = {};

    // Iterate through pricing structure (months -> bins -> pricing)
    Object.entries(plan.pricing).forEach(([months, binsPricing]) => {
      Object.entries(binsPricing).forEach(([bins, pricing]) => {
        if (!totals[bins]) {
          totals[bins] = {};
        }
        // Calculate total: base + deliveryFee
        totals[bins][months] = pricing.base + pricing.deliveryFee;
      });
    });

    return { totals };
  };

  // Transform addons
  const transformedAddons: Record<string, { price: number; name: string; icon: string }> = {};
  apiData.addons.forEach((addon) => {
    // Skip climate control as it's handled separately
    if (addon.name === "Climate-Controlled Storage") {
      return;
    }
    transformedAddons[addon.name.toLowerCase().replace(/\s+/g, "")] = {
      price: addon.amount,
      name: addon.name,
      icon: ADDON_ICONS[addon.name] || "📦",
    };
  });

  // Transform bundles
  const transformedBundles: Record<string, {
    name: string;
    bins: number;
    price: number;
    months: number;
    features: string[];
    bulkyItem?: number;
    extras?: Record<string, number>;
  }> = {};

  apiData.bundles.forEach((bundle) => {
    // Extract bundle key from bundle_name (e.g., "Summer Student Bundle" -> "summer")
    const bundleKey = bundle.bundle_name.toLowerCase().includes("summer")
      ? "summer"
      : bundle.bundle_name.toLowerCase().includes("ski")
      ? "ski"
      : bundle.id;

    // Parse extras to extract bin and bulky item prices
    const extras: Record<string, number> = {};
    if (bundle.extras) {
      // Parse extras string like "$20/bin, $39/bulky"
      const extrasMatch = bundle.extras.match(/\$(\d+)\/bin.*?\$(\d+)\/bulky/);
      if (extrasMatch) {
        extras.bin = parseFloat(extrasMatch[1]);
        extras.bulky = parseFloat(extrasMatch[2]);
      }
    }

    // Extract bins and bulky items from description or bundle name
    let bins = 5; // Default for summer bundle
    let bulkyItem = 1; // Default
    if (bundle.bundle_name.toLowerCase().includes("ski")) {
      bins = 2;
      bulkyItem = 1;
    } else if (bundle.bundle_name.toLowerCase().includes("summer")) {
      bins = 5;
      bulkyItem = 1;
    }

    // Build features array
    const features: string[] = [
      `${bins} storage bins`,
      bundle.description,
      "Free pickup",
      "1 free return",
    ];

    transformedBundles[bundleKey] = {
      name: bundle.bundle_name,
      bins,
      price: bundle.price,
      months: bundle.months,
      features,
      bulkyItem,
      extras: Object.keys(extras).length > 0 ? extras : undefined,
    };
  });

  // Transform protection plans
  const transformedProtectionPlans: Record<string, {
    name: string;
    price: number;
    limit: string;
    description: string;
    monthly: boolean;
    included: boolean;
    features: string[];
    popular?: boolean;
  }> = {};

  apiData.protection_plans.forEach((plan) => {
    const planKey = plan.name.toLowerCase().includes("basic")
      ? "basic"
      : plan.name.toLowerCase().includes("enhanced")
      ? "enhanced"
      : plan.name.toLowerCase().includes("premium")
      ? "premium"
      : plan.name.toLowerCase().replace(/\s+/g, "");

    // Build features array - always include at least description
    const features: string[] = [plan.description];
    if (plan.limit > 0) {
      features.unshift(plan.displayLimit); // Add limit at the beginning
    }
    // Add additional features based on plan type
    if (plan.name.toLowerCase().includes("premium")) {
      features.push("Express claims processing", "Dedicated support", "Full replacement value");
    } else if (plan.name.toLowerCase().includes("enhanced")) {
      features.push("Faster claims processing", "Priority support", "Extended coverage");
    } else {
      features.push("Basic coverage", "Standard claims process", "No additional cost");
    }

    transformedProtectionPlans[planKey] = {
      name: plan.name,
      price: plan.price,
      limit: plan.displayLimit,
      description: plan.description,
      monthly: plan.price > 0,
      included: plan.price === 0,
      features, // Always an array
      popular: plan.name.toLowerCase().includes("premium"),
    };
  });

  return {
    prepaid: {
      grid: transformPlanToGrid(prepaidPlan),
    },
    monthToMonth: {
      grid: transformPlanToGrid(monthToMonthPlan),
    },
    addons: transformedAddons,
    bundles: transformedBundles,
    protectionPlans: transformedProtectionPlans,
  };
}

