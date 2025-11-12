import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import type { Plan, Bundle, Addon, ProtectionPlan } from "@/store/slices/pricingSlice";

/**
 * Custom hook to calculate booking total and breakdown from cart
 * Uses Redux cart state and pricing data for calculations
 */
export function useCartCalculations() {
  const cart = useAppSelector((state) => state.cart);
  const pricingData = useAppSelector((state) => state.pricing.data);

  // Get plans
  const prepaidPlan = useMemo(() => 
    pricingData?.plans.find((p) => p.plan_name.toLowerCase().includes("prepaid")),
    [pricingData]
  );
  const monthToMonthPlan = useMemo(() => 
    pricingData?.plans.find((p) => p.plan_name.toLowerCase().includes("month")),
    [pricingData]
  );

  // Calculate total price
  const calculateTotal = useMemo(() => {
    if (!pricingData) return 0;
    
    let total = 0;

    // Check if a bundle is selected
    if (cart.selectedBundle) {
      const bundle = pricingData.bundles.find((b: Bundle) => 
        cart.selectedBundle === "summer" ? b.bundle_name.toLowerCase().includes("summer") :
        cart.selectedBundle === "ski" ? b.bundle_name.toLowerCase().includes("ski") :
        b.id === cart.selectedBundle
      );
      
      if (bundle) {
        total = bundle.price;

        // Climate control
        if (cart.climateControl && cart.selectedBins > 0 && cart.selectedMonths) {
          const climateAddon = pricingData.addons.find((a: Addon) => a.name === "Climate-Controlled Storage");
          if (climateAddon) {
            const storageCost = cart.selectedBins * cart.selectedMonths * (prepaidPlan?.perBinPrice || 7.5);
            if (climateAddon.chargeType === "percent") {
              total += storageCost * (climateAddon.amount / 100);
            } else {
              total += climateAddon.amount;
            }
            total += climateAddon.reDeliveryFee;
          }
        }

        // Protection Plan
        if (cart.protectionPlan !== "basic" && cart.selectedMonths) {
          const planData = pricingData.protection_plans.find(
            (p: ProtectionPlan) => p.name.toLowerCase().includes(cart.protectionPlan)
          );
          if (planData && planData.price > 0) {
            total += planData.price * cart.selectedMonths;
          }
        }

        return total;
      }
    }

    // Regular pricing calculation (no bundle)
    if (cart.selectedBins > 0 && cart.selectedMonths) {
      const selectedPlan = cart.plan === "prepaid" ? prepaidPlan : monthToMonthPlan;
      if (selectedPlan) {
        const monthsStr = cart.selectedMonths.toString();
        const binsStr = cart.selectedBins.toString();
        const pricing = selectedPlan.pricing[monthsStr]?.[binsStr];
        if (pricing) {
          total += pricing.base + pricing.deliveryFee;
        }
      }
    }

    // Add-ons pricing
    cart.selectedAddons.forEach((addonKey) => {
      const addon = pricingData.addons.find((a: Addon) => 
        a.name.toLowerCase().replace(/\s+/g, "") === addonKey
      );
      if (addon) {
        if (addon.recurrence === "monthly" && cart.selectedMonths) {
          total += addon.amount * cart.selectedMonths;
        } else if (addon.recurrence === "one_time") {
          total += addon.amount;
        }
        total += addon.reDeliveryFee;
      }
    });

    // Climate control
    if (cart.climateControl && (cart.selectedBins > 0 || cart.selectedAddons.length > 0)) {
      const climateAddon = pricingData.addons.find((a: Addon) => a.name === "Climate-Controlled Storage");
      if (climateAddon) {
        const storageCost = cart.selectedBins > 0 && cart.selectedMonths
          ? cart.selectedBins * cart.selectedMonths * (prepaidPlan?.perBinPrice || 7.5)
          : 0;
        if (climateAddon.chargeType === "percent") {
          total += storageCost * (climateAddon.amount / 100);
        } else {
          total += climateAddon.amount;
        }
        total += climateAddon.reDeliveryFee;
      }
    }

    // Protection Plan pricing
    if (cart.protectionPlan !== "basic" && cart.selectedMonths) {
      const planData = pricingData.protection_plans.find(
        (p: ProtectionPlan) => p.name.toLowerCase().includes(cart.protectionPlan)
      );
      if (planData && planData.price > 0) {
        total += planData.price * cart.selectedMonths;
      }
    }

    return total;
  }, [cart, pricingData, prepaidPlan, monthToMonthPlan]);

  // Calculate breakdown
  const breakdown = useMemo(() => {
    if (!pricingData) {
      return {
        baseStorageCost: 0,
        redeliveryFee: 0,
        climateControlCost: 0,
        addonsCost: 0,
        addonsDeliveryCost: 0,
        protectionPlanCost: 0,
        savings: 0,
      };
    }

    let baseStorageCost = 0;
    let redeliveryFee = 0;
    let climateControlCost = 0;
    let addonsCost = 0;
    let addonsDeliveryCost = 0;
    let protectionPlanCost = 0;
    let savings = 0;

    // Helper to find bundle
    const findBundle = (key: string): Bundle | undefined => {
      return pricingData.bundles.find((b: Bundle) => 
        key === "summer" ? b.bundle_name.toLowerCase().includes("summer") :
        key === "ski" ? b.bundle_name.toLowerCase().includes("ski") :
        b.id === key
      );
    };

    // If bundle is selected
    if (cart.selectedBundle) {
      const bundleData = findBundle(cart.selectedBundle);
      if (bundleData) {
        if (cart.selectedBins > 0 && cart.selectedMonths) {
          baseStorageCost = cart.selectedBins * cart.selectedMonths * (prepaidPlan?.perBinPrice || 7.5);
        }
        const bundlePrice = bundleData.price || 0;
        redeliveryFee = Math.max(0, bundlePrice - baseStorageCost);
      }
    } else if (cart.selectedBins > 0 && cart.selectedMonths) {
      // Regular pricing
      const selectedPlan = cart.plan === "prepaid" ? prepaidPlan : monthToMonthPlan;
      if (selectedPlan) {
        const binsStr = cart.selectedBins.toString();
        const monthsStr = cart.selectedMonths.toString();
        const pricing = selectedPlan.pricing[monthsStr]?.[binsStr];

        if (pricing) {
          baseStorageCost = pricing.base;
          redeliveryFee = pricing.deliveryFee;

          // Calculate savings (prepaid vs monthly)
          if (cart.plan === "prepaid" && monthToMonthPlan) {
            const monthlyPricing = monthToMonthPlan.pricing[monthsStr]?.[binsStr];
            if (monthlyPricing) {
              const monthlyTotal = monthlyPricing.base + monthlyPricing.deliveryFee;
              const prepaidTotal = pricing.base + pricing.deliveryFee;
              savings = Math.max(0, monthlyTotal - prepaidTotal);
            }
          }
        }
      }
    }

    // Climate control cost
    if (cart.climateControl && (cart.selectedBins > 0 || cart.selectedAddons.length > 0)) {
      const climateAddon = pricingData.addons.find((a: Addon) => a.name === "Climate-Controlled Storage");
      if (climateAddon) {
        const storageCost = cart.selectedBins > 0 && cart.selectedMonths
          ? cart.selectedBins * cart.selectedMonths * (prepaidPlan?.perBinPrice || 7.5)
          : 0;
        if (climateAddon.chargeType === "percent") {
          climateControlCost = storageCost * (climateAddon.amount / 100);
        } else {
          climateControlCost = climateAddon.amount;
        }
        climateControlCost += climateAddon.reDeliveryFee;
      }
    }

    // Add-ons cost
    if (cart.selectedAddons.length > 0) {
      cart.selectedAddons.forEach((addonKey) => {
        const addon = pricingData.addons.find((a: Addon) => 
          a.name.toLowerCase().replace(/\s+/g, "") === addonKey
        );
        if (addon) {
          if (addon.recurrence === "monthly" && cart.selectedMonths) {
            addonsCost += addon.amount * cart.selectedMonths;
          } else if (addon.recurrence === "one_time") {
            addonsCost += addon.amount;
          }
          addonsDeliveryCost += addon.reDeliveryFee;
        }
      });
    }

    // Protection plan cost
    if (cart.protectionPlan !== "basic" && cart.selectedMonths) {
      const planData = pricingData.protection_plans.find(
        (p: ProtectionPlan) => p.name.toLowerCase().includes(cart.protectionPlan)
      );
      if (planData && planData.price > 0) {
        protectionPlanCost = planData.price * cart.selectedMonths;
      }
    }

    return {
      baseStorageCost,
      redeliveryFee,
      climateControlCost,
      addonsCost,
      addonsDeliveryCost,
      protectionPlanCost,
      savings,
    };
  }, [cart, pricingData, prepaidPlan, monthToMonthPlan]);

  return {
    total: calculateTotal,
    breakdown,
    cart,
  };
}

