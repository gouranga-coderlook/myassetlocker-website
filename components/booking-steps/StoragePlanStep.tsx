"use client";

import { useAppSelector } from "@/store/hooks";
import type { Plan, Bundle } from "@/store/slices/pricingSlice";
import { useMemo } from "react";

interface StoragePlanStepProps {
  readonly plan: Plan | null;
  readonly setPlan: (plan: Plan | null) => void;
  readonly selectedBundle: string | null;
  readonly onBundleSelect: (bundle: string) => void;
}

export default function StoragePlanStep({
  plan,
  setPlan,
  selectedBundle,
  onBundleSelect,
}: StoragePlanStepProps) {
  const pricingData = useAppSelector((state) => state.pricing.data);
  
  // Get plans from API and sort: prepaid plans first, then others
  const sortedPlans = useMemo(() => {
    const plans = pricingData?.plans || [];
    return [...plans].sort((a: Plan, b: Plan) => {
      const aIsPrepaid = a.plan_name.toLowerCase().includes("prepaid");
      const bIsPrepaid = b.plan_name.toLowerCase().includes("prepaid");
      if (aIsPrepaid && !bIsPrepaid) return -1;
      if (!aIsPrepaid && bIsPrepaid) return 1;
      return 0;
    });
  }, [pricingData?.plans]);

  // Get bundles from API
  const bundles = useMemo(() => pricingData?.bundles || [], [pricingData?.bundles]);

  // Helper to check if a plan is selected
  const isPlanSelected = (planItem: Plan): boolean => {
    return plan?.id === planItem.id;
  };

  // Helper to get bundle key for selection
  const getBundleKey = (bundle: Bundle | undefined): string | null => {
    if (!bundle) return null;
    if (bundle.bundle_name.toLowerCase().includes("summer")) return "summer";
    if (bundle.bundle_name.toLowerCase().includes("ski")) return "ski";
    return bundle.id;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Storage Plan</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Select between our prepaid plans for maximum savings or flexible
          month-to-month options
        </p>
      </div>

      {/* Payment Plan Selection - Grid */}
      {sortedPlans.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Payment Plan
          </h3>
          <div className={`grid grid-cols-1 ${sortedPlans.length === 1 ? 'md:grid-cols-1' : sortedPlans.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
            {sortedPlans.map((planItem: Plan) => {
              const isSelected = isPlanSelected(planItem);
              
              return (
                <label
                  key={planItem.id}
                  suppressHydrationWarning
                  className={`flex items-center space-x-3 cursor-pointer p-4 border-2 rounded-lg hover:border-[#f8992f] transition bg-white ${
                    isSelected ? "border-[#f8992f]" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="planType"
                    value={planItem.id}
                    checked={isSelected}
                    onChange={() => setPlan(planItem)}
                    suppressHydrationWarning
                    className="w-5 h-5"
                  />
                  <div
                    className={
                      isSelected ? "text-[#f8992f]" : "text-gray-700"
                    }
                  >
                    <strong className="block">{planItem.plan_name}</strong>
                    <small>{planItem.description}</small>
                    {/* {planItem.hasDiscount && (
                      <div className="text-xs mt-1 text-[#22c55e] font-semibold">
                        Save up to {planItem.discount_value}%
                      </div>
                    )} */}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Bundle Selection - Grid */}
      {bundles.length > 0 && (
        <div className="">
          <h3 className="text-xl md:text-2xl font-bold mb-4">
            💰 Special Bundle Offers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bundles.map((bundle: Bundle) => {
              const bundleKey = getBundleKey(bundle);
              
              return (
                <div
                  key={bundle.id}
                  onClick={() => bundleKey && onBundleSelect(bundleKey)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && bundleKey) {
                      onBundleSelect(bundleKey);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  suppressHydrationWarning
                  className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedBundle === bundleKey
                      ? "border-[#f8992f]"
                      : "border-gray-200 hover:border-[#f8992f]"
                  }`}
                >
                  <h4 className="text-lg font-bold mb-2">
                    {bundle.bundle_name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>{bundle.description}</strong>
                    <br />
                    {bundle.fromMonth} - {bundle.toMonth}
                    <br />
                    {bundle.months} {bundle.months === 1 ? "month" : "months"}
                  </p>
                  <div className="text-xl font-bold text-[#f8992f] mb-1">
                    ${bundle.price.toFixed(2)}/term
                  </div>
                  {bundle.extras && (
                    <small className="text-gray-500 text-xs">
                      {bundle.extras}
                    </small>
                  )}
                </div>
              );
            })}
            
            {/* Custom Plan Option */}
            <div
              onClick={() => onBundleSelect("custom")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onBundleSelect("custom");
              }}
              role="button"
              tabIndex={0}
              suppressHydrationWarning
              className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedBundle === "custom"
                  ? "border-[#f8992f]"
                  : "border-gray-200 hover:border-[#f8992f]"
              }`}
            >
              <h4 className="text-lg font-bold mb-2">📦 Custom Plan</h4>
              <p className="text-gray-600 text-sm">
                <strong>Choose your own</strong>
                <br />
                Bins and duration
                <br />
                Flexible options
              </p>
              <div className="text-xl font-bold text-[#f8992f] mt-2">
                Custom Pricing
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
