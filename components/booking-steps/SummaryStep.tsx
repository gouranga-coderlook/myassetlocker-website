"use client";
import type { Addon, Bundle, Plan, ProtectionPlan } from "@/store/slices/pricingSlice";
import { useMemo } from "react";

interface SummaryStepProps {
  readonly plan: Plan | null;
  readonly selectedMonths: number | null;
  readonly selectedBins: number;
  readonly selectedAddons: string[];
  readonly climateControl: boolean;
  readonly addons: Addon[];
  readonly calculateBookingTotal: () => number;
  readonly selectedBundle: Bundle | string | null; // Can be Bundle object or string key
  readonly bundles: Bundle[];
  readonly protectionPlan: string;
  readonly protectionPlans: ProtectionPlan[];
  readonly fullName: string;
  readonly setFullName: (name: string) => void;
  readonly email: string;
  readonly setEmail: (email: string) => void;
  readonly phone: string;
  readonly setPhone: (phone: string) => void;
  readonly prepaidPlan?: Plan;
  readonly monthToMonthPlan?: Plan;
  readonly getDeliveryFeePerItem?: () => number;
}

export default function SummaryStep({
  plan,
  selectedMonths,
  selectedBins,
  selectedAddons,
  climateControl,
  addons,
  calculateBookingTotal,
  selectedBundle,
  bundles,
  protectionPlan,
  protectionPlans,
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  prepaidPlan,
  monthToMonthPlan,
  getDeliveryFeePerItem,
}: SummaryStepProps) {
  // Calculate cost breakdown
  const costBreakdown = useMemo(() => {
    let baseStorageCost = 0;
    let redeliveryFee = 0;
    let climateControlCost = 0;
    let addonsCost = 0;
    let addonsDeliveryCost = 0;
    let protectionPlanCost = 0;
    let savings = 0;

    // Helper to find bundle by key or get bundle object
    const getBundleData = (): Bundle | undefined => {
      if (!selectedBundle) return undefined;
      // If it's already a Bundle object
      if (typeof selectedBundle === 'object' && 'id' in selectedBundle) {
        return selectedBundle;
      }
      // If it's a string key, find the bundle
      const key = selectedBundle as string;
      return bundles.find(b => 
        key === "summer" ? b.bundle_name.toLowerCase().includes("summer") :
        key === "ski" ? b.bundle_name.toLowerCase().includes("ski") :
        b.id === key
      );
    };

    // If bundle is selected
    const bundleData = getBundleData();
    if (bundleData) {
      // Bundle price is the total price (no separate redelivery fee for bundles)
      let bundlePrice = bundleData.price || 0;
      
      // Apply plan discount if plan is selected and has discount
      if (plan && plan.hasDiscount && plan.discount_value > 0) {
        if (plan.discount_type === "percentage") {
          // Apply percentage discount
          const discountAmount = (bundlePrice * plan.discount_value) / 100;
          bundlePrice = bundlePrice - discountAmount;
          savings = discountAmount; // Track the discount as savings
        } else if (plan.discount_type === "fixed" || plan.discount_type === "amount") {
          // Apply fixed amount discount
          bundlePrice = Math.max(0, bundlePrice - plan.discount_value);
          savings = plan.discount_value; // Track the discount as savings
        }
      }
      
      baseStorageCost = bundlePrice;
      // Bundles don't have redelivery fees - the price is all-inclusive
      redeliveryFee = 0;
    } else if (selectedBins > 0 && selectedMonths && plan) {
      // Regular pricing - calculate from plan pricing
      const binsStr = selectedBins.toString();
      const monthsStr = selectedMonths.toString();
      const pricing = plan.pricing[monthsStr]?.[binsStr];

      if (pricing) {
        baseStorageCost = pricing.base;
        redeliveryFee = pricing.deliveryFee;

        // Calculate savings (prepaid vs monthly)
        const isPrepaid = plan.plan_name.toLowerCase().includes("prepaid");
        if (isPrepaid && monthToMonthPlan) {
          const monthlyPricing = monthToMonthPlan.pricing[monthsStr]?.[binsStr];
          if (monthlyPricing) {
            const monthlyTotal = monthlyPricing.base + monthlyPricing.deliveryFee;
            const prepaidTotal = pricing.base + pricing.deliveryFee;
            savings = Math.max(0, monthlyTotal - prepaidTotal);
          }
        }
      }
    }

    // Climate control cost
    if (climateControl && (selectedBins > 0 || selectedAddons.length > 0)) {
      const climateAddon = addons.find(a => a.name === "Climate-Controlled Storage");
      if (climateAddon) {
        const storageCost =
          selectedBins > 0 && selectedMonths
            ? selectedBins * selectedMonths * (prepaidPlan?.perBinPrice || 7.5)
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
    if (selectedAddons.length > 0) {
      selectedAddons.forEach((addonKey) => {
        const addon = addons.find(a => 
          a.name.toLowerCase().replace(/\s+/g, "") === addonKey
        );
        if (addon) {
          if (addon.recurrence === "monthly" && selectedMonths) {
            addonsCost += addon.amount * selectedMonths;
          } else if (addon.recurrence === "one_time") {
            addonsCost += addon.amount;
          }
          addonsDeliveryCost += addon.reDeliveryFee;
        }
      });
    }

    // Protection plan cost
    if (protectionPlan !== "basic" && selectedMonths) {
      const planData = protectionPlans.find(p => 
        p.name.toLowerCase().includes(protectionPlan)
      );
      if (planData && planData.price > 0) {
        protectionPlanCost = planData.price * selectedMonths;
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
  }, [
    plan,
    selectedBundle,
    bundles,
    selectedBins,
    selectedMonths,
    prepaidPlan,
    monthToMonthPlan,
    climateControl,
    selectedAddons,
    addons,
    protectionPlan,
    protectionPlans,
  ]);

  // Get bundle data for display
  const bundleData = useMemo(() => {
    if (!selectedBundle) return null;
    // If it's already a Bundle object
    if (typeof selectedBundle === 'object' && 'id' in selectedBundle) {
      return selectedBundle;
    }
    // If it's a string key, find the bundle
    const key = selectedBundle as string;
    return bundles.find(b => 
      key === "summer" ? b.bundle_name.toLowerCase().includes("summer") :
      key === "ski" ? b.bundle_name.toLowerCase().includes("ski") :
      b.id === key
    ) || null;
  }, [selectedBundle, bundles]);

  // Build booking duration text
  const bookingDurationText = useMemo(() => {
    if (bundleData?.months) {
      const monthsText = `${bundleData.months} ${bundleData.months === 1 ? "month" : "months"}`;
      if (bundleData.fromMonth && bundleData.toMonth) {
        return `${monthsText} (${bundleData.fromMonth} - ${bundleData.toMonth})`;
      }
      return monthsText;
    }
    if (selectedMonths) {
      return `${selectedMonths} ${selectedMonths === 1 ? "month" : "months"}`;
    }
    return "-";
  }, [bundleData, selectedMonths]);

  // Build storage items string
  const storageItemsText = useMemo(() => {
    // If bundle is selected, show bundle description
    if (bundleData) {
      return bundleData.description || bundleData.bundle_name;
    }
    
    // Regular storage items
    const items: string[] = [];
    if (selectedBins > 0) {
      items.push(`${selectedBins} bin${selectedBins > 1 ? "s" : ""}`);
    }
    if (selectedAddons.length > 0) {
      const addonNames = selectedAddons.map((key) => {
        const addon = addons.find(a => 
          a.name.toLowerCase().replace(/\s+/g, "") === key
        );
        return addon?.name || key;
      });
      items.push(addonNames.join(", "));
    }
    return items.length > 0 ? items.join(", ") : "-";
  }, [bundleData, selectedBins, selectedAddons, addons]);

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
      <div className="bg-white rounded-lg p-6 space-y-3">
        {/* Storage Plan */}
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span className="text-gray-600">Storage Plan:</span>
          <span className="font-semibold">
            {plan?.plan_name || "Not selected"}
          </span>
        </div>

        {/* Booking Duration */}
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span className="text-gray-600">Booking Duration:</span>
          <span className="font-semibold">{bookingDurationText}</span>
        </div>

        {/* Storage Items */}
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span className="text-gray-600">Storage Items:</span>
          <span className="font-semibold text-right max-w-[60%]">{storageItemsText}</span>
        </div>

        {/* Bundle Price (if bundle is selected) */}
        {bundleData && (
          <>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Bundle Price:</span>
              <span className="font-semibold">
                {plan && plan.hasDiscount && plan.discount_value > 0 ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">
                      ${bundleData.price.toFixed(2)}
                    </span>
                    <span className="text-[#f8992f]">
                      ${costBreakdown.baseStorageCost.toFixed(2)}
                    </span>
                  </>
                ) : (
                  `$${bundleData.price.toFixed(2)}`
                )}
              </span>
            </div>
            {/* Show discount if plan discount is applied */}
            {plan && plan.hasDiscount && plan.discount_value > 0 && costBreakdown.savings > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">
                  Plan Discount ({plan.discount_type === "percentage" ? `${plan.discount_value}%` : `$${plan.discount_value}`}):
                </span>
                <span className="font-semibold text-green-600">
                  -${costBreakdown.savings.toFixed(2)}
                </span>
              </div>
            )}
          </>
        )}

        {/* Base Storage Cost (only show if not bundle) */}
        {!bundleData && selectedBins > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Base Storage Cost:</span>
            <span className="font-semibold">
              ${costBreakdown.baseStorageCost.toFixed(2)}
            </span>
          </div>
        )}

        {/* Re-delivery Fee (only show for regular plans, not bundles) */}
        {!bundleData && selectedBins > 0 && costBreakdown.redeliveryFee > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Re-delivery Fee:</span>
            <span className="font-semibold">
              ${costBreakdown.redeliveryFee.toFixed(2)}
            </span>
          </div>
        )}

        {/* Climate Control */}
        {climateControl && costBreakdown.climateControlCost > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Climate Control (+20%):</span>
            <span className="font-semibold">
              ${costBreakdown.climateControlCost.toFixed(2)}
            </span>
          </div>
        )}

        {/* Add-ons */}
        {selectedAddons.length > 0 && costBreakdown.addonsCost > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Add-ons:</span>
            <span className="font-semibold">
              ${costBreakdown.addonsCost.toFixed(2)}
            </span>
          </div>
        )}

        {/* Add-ons Delivery */}
        {/* {selectedAddons.length > 0 && costBreakdown.addonsDeliveryCost > 0 && ( */}
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Add-ons Delivery Fee:</span>
            <span className="font-semibold">
              ${costBreakdown.addonsDeliveryCost.toFixed(2)}
            </span>
          </div>
        {/* )} */}

        {/* Protection Plan */}
        {protectionPlan !== "basic" && costBreakdown.protectionPlanCost > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Protection Plan:</span>
            <span className="font-semibold">
              ${costBreakdown.protectionPlanCost.toFixed(2)}
            </span>
          </div>
        )}

        {/* Savings (only for prepaid) */}
        {plan?.plan_name.toLowerCase().includes("prepaid") && costBreakdown.savings > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Total Savings:</span>
            <span className="font-semibold text-[#22c55e]">
              ${costBreakdown.savings.toFixed(2)}
            </span>
          </div>
        )}

        {/* Total Amount */}
        <div className="flex justify-between pt-4">
          <span className="text-xl font-bold">Total Amount:</span>
          <span className="text-2xl font-bold text-[#f8992f]">
            ${calculateBookingTotal().toFixed(2)}
          </span>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold mb-2">📍 Delivery Information</h3>
        <p className="text-sm text-gray-600">
          Standard delivery includes 0-7 mile radius. Re-delivery fees vary
          based on plan type and duration.
        </p>
      </div>
    </div>
  );
}
