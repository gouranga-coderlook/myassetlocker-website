"use client";
import type { Addon, Bundle, Plan, ProtectionPlan } from "@/store/slices/pricingSlice";
import { useMemo, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";

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
  selectedBundle,
  bundles,
  protectionPlan,
  protectionPlans,
  prepaidPlan,
}: SummaryStepProps) {
  // Fetch location data from Redux store
  const locationData = useAppSelector((state) => state.cart.locationData);
  
  // Local calculation function - matches pricing page logic exactly
  const calculateLocalCostBreakdown = useCallback(() => {
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

    // Add-ons cost - match pricing page logic exactly
    if (selectedAddons.length > 0) {
      selectedAddons.forEach((addonIdentifier) => {
        // Try to find by ID first, then fallback to name-based key
        const addon = addons.find(a => 
          (a.id && a.id === addonIdentifier) ||
          (!a.id && a.name.toLowerCase().replace(/\s+/g, "") === addonIdentifier)
        );
        if (addon) {
          if (addon.recurrence === "monthly" && selectedMonths) {
            if (addon.chargeType === "percent") {
              // For percent-based monthly addons: calculate percentage of monthly storage cost
              const monthlyStorageCost = selectedBins > 0 && plan
                ? selectedBins * (plan.perBinPrice || prepaidPlan?.perBinPrice || 7.5)
                : 0;
              const monthlyAddonCost = monthlyStorageCost * (addon.amount / 100);
              addonsCost += monthlyAddonCost * selectedMonths;
            } else {
              // Fixed amount addons
              addonsCost += addon.amount * selectedMonths;
            }
          } else if (addon.recurrence === "one_time") {
            if (addon.chargeType === "percent") {
              // For one-time percent addons, calculate percentage of total storage cost
              addonsCost += baseStorageCost * (addon.amount / 100);
            } else {
              addonsCost += addon.amount;
            }
          }
          addonsDeliveryCost += addon.reDeliveryFee;
        }
      });
    }

    // Protection plan cost - match pricing page logic
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
  }, [plan, selectedBundle, bundles, selectedBins, selectedMonths, prepaidPlan, climateControl, selectedAddons, addons, protectionPlan, protectionPlans]);
  
  // Always calculate breakdown from props to ensure accuracy
  // This ensures the summary always reflects what the user selected, not stale cart data
  const costBreakdown = useMemo(() => {
    return calculateLocalCostBreakdown();
  }, [calculateLocalCostBreakdown]);

  // Calculate total amount including all costs and delivery charge
  const calculatedTotal = useMemo(() => {
    let total = 
      costBreakdown.baseStorageCost +
      costBreakdown.redeliveryFee +
      costBreakdown.climateControlCost +
      costBreakdown.addonsCost +
      costBreakdown.addonsDeliveryCost +
      costBreakdown.protectionPlanCost;

    // Add delivery charge from locationData
    if (locationData?.matchedZone) {
      total += locationData.matchedZone.price;
    } else if (locationData?.deliveryCharge && typeof locationData.deliveryCharge === 'number') {
      // const region = locationData.nearestStore?.region?.toLowerCase();
      const charge = locationData.deliveryCharge;
      // Convert rupees to USD if region is India (1 USD ≈ 83 INR)
      total += charge;
    }

    // Subtract savings (savings are already reflected in baseStorageCost for bundles, but shown separately for prepaid)
    // For prepaid plans, savings is the difference, so we don't subtract it again
    // For bundles with discounts, the discount is already applied to baseStorageCost
    
    return total;
  }, [costBreakdown, locationData]);

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
      const addonNames = selectedAddons.map((addonIdentifier) => {
        // Try to find by ID first, then fallback to name-based key
        const addon = addons.find(a => 
          (a.id && a.id === addonIdentifier) ||
          (!a.id && a.name.toLowerCase().replace(/\s+/g, "") === addonIdentifier)
        );
        return addon?.name || addonIdentifier;
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

        {/* Delivery Charge */}
        {locationData?.deliveryCharge && typeof locationData.deliveryCharge === 'number' && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Delivery Charge:</span>
            <span className="font-semibold">
              ${(() => {
                const charge = locationData.deliveryCharge;
                const displayCharge = charge;
                return displayCharge.toFixed(2);
              })()}
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
        {plan?.plan_name?.toLowerCase().includes("prepaid") && costBreakdown.savings > 0 && (
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
            ${calculatedTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Delivery Information */}
      <div
        className={`rounded-lg p-4 mt-6 border ${
          locationData?.deliveryCharge === "out_of_area"
            ? "bg-red-50 border-red-200"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <h3 className="font-semibold mb-2">📍 Delivery Information</h3>
        <p className="text-sm text-gray-600 mb-2">
          {locationData?.distanceChargeSource === "warehouse_distance_charges"
            ? `Delivery pricing is calculated from the nearest warehouse${
                locationData.nearestWarehouse?.name
                  ? ` (${locationData.nearestWarehouse.name})`
                  : ""
              } based on your validated address distance.`
            : "Delivery pricing will be calculated from the nearest warehouse after address validation."}
        </p>
        {locationData?.deliveryCharge === "out_of_area" ? (
          <p className="text-sm text-red-700">
            {locationData.reasonCode === "GEOCODE_FAILED"
              ? "We could not verify this address. Please review and try again."
              : locationData.reasonCode === "NO_ACTIVE_WAREHOUSE"
              ? "Delivery is temporarily unavailable because no active warehouse is available."
              : "This address is currently out of service area for the nearest warehouse."}
          </p>
        ) : locationData?.distanceChargeSource === "warehouse_distance_charges" ? (
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              Nearest warehouse:{" "}
              <span className="font-semibold text-gray-900">
                {locationData.nearestWarehouse?.name || "N/A"}
              </span>
            </p>
            {typeof locationData.distanceMiles === "number" && (
              <p>
                Distance:{" "}
                <span className="font-semibold text-gray-900">
                  {locationData.distanceMiles.toFixed(2)} miles
                </span>
              </p>
            )}
            <p>
              Applied distance charge:{" "}
              <span className="font-semibold text-gray-900">
                {typeof locationData.deliveryCharge === "number"
                  ? `$${locationData.deliveryCharge.toFixed(2)}`
                  : "N/A"}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Delivery pricing will be based on the nearest warehouse after address validation.
          </p>
        )}
      </div>
    </div>
  );
}
