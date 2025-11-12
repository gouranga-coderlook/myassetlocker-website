"use client";
import { useMemo } from "react";
import type { Plan } from "@/store/slices/pricingSlice";

interface DurationBinsStepProps {
  readonly selectedMonths: number | null;
  readonly setSelectedMonths: (months: number) => void;
  readonly selectedBins: number;
  readonly setSelectedBins: (bins: number) => void;
  readonly prepaidPlan?: Plan;
  readonly monthToMonthPlan?: Plan;
  readonly currentPlan?: Plan | null; // Full plan object
}

export default function DurationBinsStep({
  selectedMonths,
  setSelectedMonths,
  selectedBins,
  setSelectedBins,
  prepaidPlan,
  monthToMonthPlan,
  currentPlan,
}: DurationBinsStepProps) {
  // Get the currently selected plan - use currentPlan if available, otherwise fallback to prepaidPlan
  const selectedPlan = currentPlan || prepaidPlan;

  // Extract available months and bins from the selected plan's pricing matrix
  const { availableMonths, availableBins } = useMemo(() => {
    if (!selectedPlan?.pricing) {
      return { availableMonths: [], availableBins: [] };
    }

    // Get months from pricing keys
    const months = Object.keys(selectedPlan.pricing)
      .map(Number)
      .filter((m) => !Number.isNaN(m))
      .sort((a, b) => a - b);

    // Get bins from first month's pricing (all months should have same bins)
    const firstMonth = months[0]?.toString();
    const bins = firstMonth
      ? Object.keys(selectedPlan.pricing[firstMonth] || {})
          .map(Number)
          .filter((b) => !Number.isNaN(b))
          .sort((a, b) => a - b)
      : [];

    return {
      availableMonths: months,
      availableBins: [0, ...bins], // Add 0 for "no bins" option
    };
  }, [selectedPlan]);

  // Calculate prices for all available plans with proper comparison
  const planComparisons = useMemo(() => {
    if (!selectedMonths || selectedBins === 0) {
      return [];
    }

    const binsStr = selectedBins.toString();
    const monthsStr = selectedMonths.toString();
    const plans = [prepaidPlan, monthToMonthPlan].filter((p): p is Plan => p !== undefined);

    // Calculate prices for each plan
    const planPrices = plans.map((plan) => {
      const pricing = plan.pricing[monthsStr]?.[binsStr];
      const total = pricing ? pricing.base + pricing.deliveryFee : 0;
      return { plan, total };
    });

    // Calculate savings: prepaid saves compared to monthly, monthly doesn't save
    return planPrices.map(({ plan, total }) => {
      const isPrepaid = plan.plan_name.toLowerCase().includes("prepaid");
      let savings = 0;
      
      // Only calculate savings for prepaid plans compared to monthly
      if (isPrepaid && monthToMonthPlan) {
        const monthlyPricing = monthToMonthPlan.pricing[monthsStr]?.[binsStr];
        if (monthlyPricing) {
          const monthlyTotal = monthlyPricing.base + monthlyPricing.deliveryFee;
          savings = Math.max(0, monthlyTotal - total);
        }
      }
      
      return {
        plan,
        price: total,
        savings,
        isSelected: currentPlan?.id === plan.id,
        isPrepaid,
      };
    }).sort((a, b) => {
      // Sort: prepaid first, then monthly, but selected plan first
      if (a.isSelected) return -1;
      if (b.isSelected) return 1;
      if (a.isPrepaid && !b.isPrepaid) return -1;
      if (!a.isPrepaid && b.isPrepaid) return 1;
      return a.price - b.price;
    });
  }, [prepaidPlan, monthToMonthPlan, selectedBins, selectedMonths, currentPlan]);

  // Get price for a specific month/bin combination
  const getPriceForOption = (months: number, bins: number): number => {
    if (!selectedPlan || bins === 0) return 0;
    const monthsStr = months.toString();
    const binsStr = bins.toString();
    const pricing = selectedPlan.pricing[monthsStr]?.[binsStr];
    return pricing ? pricing.base + pricing.deliveryFee : 0;
  };

  const showPriceComparison =
    selectedBins > 0 && selectedMonths !== null && planComparisons.length > 0;
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Select Duration & Number of Bins
      </h2>

      {/* Storage Duration - First Row */}
      {availableMonths.length > 0 && (
        <div className="mb-8">
          <label className="flex items-center gap-2 text-base font-semibold mb-3">
            <span>📅</span> Storage Duration
          </label>
          <div className={`grid grid-cols-2 sm:grid-cols-3 ${availableMonths.length <= 3 ? 'md:grid-cols-3' : availableMonths.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-5'} gap-3`}>
            {availableMonths.map((months) => {
              return (
                <div
                  key={months}
                  onClick={() => setSelectedMonths(months)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMonths(months); }}
                  role="button"
                  tabIndex={0}
                  className={`relative p-3 md:p-4 border-2 rounded-lg text-center cursor-pointer transition-all bg-white ${
                    selectedMonths === months
                      ? "border-[#f8992f] text-[#f8992f]"
                      : "border-gray-200 text-gray-700 hover:border-[#f8992f]"
                  }`}
                >
                  {/* Discount badge in top right corner */}
                  {(months === 6 || months === 12) && (
                    <div className={`absolute top-1 right-1 px-2 py-1 text-xs rounded-full ${
                      selectedMonths === months ? "bg-[#f8992f] text-white" : "bg-[#22c55e] text-white"
                    }`}>
                      {months === 6 ? "10% off" : "15% off"}
                    </div>
                  )}
                  <div className="text-xl md:text-2xl font-bold mb-1">{months}</div>
                  <div className="text-xs">{months === 1 ? "Month" : "Months"}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Number of Bins - Second Row */}
      {availableBins.length > 0 && (
        <div>
          <label className="flex items-center gap-2 text-base font-semibold mb-3">
            <span>📦</span> Number of Bins (optional)
          </label>
          <div className={`grid grid-cols-2 sm:grid-cols-3 ${availableBins.length <= 4 ? 'md:grid-cols-4' : availableBins.length === 5 ? 'md:grid-cols-5' : 'md:grid-cols-6'} gap-3`}>
            {availableBins.map((bins) => {
              // Calculate price for this bin count with selected months (or first month if none selected)
              const monthsToUse = selectedMonths || availableMonths[0] || 1;
              const price = bins > 0 ? getPriceForOption(monthsToUse, bins) : 0;
              
              return (
                <div
                  key={bins}
                  onClick={() => setSelectedBins(bins)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedBins(bins); }}
                  role="button"
                  tabIndex={0}
                  className={`relative p-3 md:p-4 border-2 rounded-lg text-center cursor-pointer transition-all bg-white ${
                    selectedBins === bins
                      ? "border-[#f8992f] text-[#f8992f]"
                      : "border-gray-200 text-gray-700 hover:border-[#f8992f]"
                  }`}
                >
                  <div className="text-xl md:text-2xl font-bold mb-1">{bins}</div>
                  <div className="text-xs">{bins === 1 ? "Bin" : "Bins"}</div>
                  {bins > 0 && price > 0 && selectedMonths && (
                    <div className="text-xs text-gray-500 mt-1">
                      ${price.toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <small className="text-gray-500 mt-3 block">
            You can choose 0 bins and select bulky items in the next step.
          </small>
        </div>
      )}

      {/* Price Comparison Section */}
      {showPriceComparison && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Price Comparison</h3>
          <div className={`grid grid-cols-1 ${planComparisons.length === 1 ? 'md:grid-cols-1' : planComparisons.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
            {planComparisons.map((comparison) => {
              const { plan, price, savings, isSelected, isPrepaid } = comparison;
              
              return (
                <div
                  key={plan.id}
                  className={`relative p-6 border-2 rounded-lg transition-all ${
                    isSelected
                      ? "border-[#f8992f] bg-[#f8992f]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {/* Plan Name */}
                  <h4 className={`text-lg font-semibold mb-2 ${
                    isSelected ? "text-white" : "text-[#4c4946]"
                  }`}>
                    {plan.plan_name}
                  </h4>
                  
                  {/* Price */}
                  <div className={`text-3xl md:text-4xl font-bold mb-1 ${
                    isSelected ? "text-white" : "text-gray-700"
                  }`}>
                    ${price.toFixed(2)}
                  </div>
                  
                  {/* Description */}
                  <small className={`text-sm ${
                    isSelected ? "text-white/90" : "text-gray-600"
                  }`}>
                    {plan.description || (isPrepaid ? "One-time payment" : "Total over term")}
                  </small>
                  
                  {/* Badge Container - Show savings or selected indicator */}
                  <div className="absolute top-4 right-4">
                    {isSelected ? (
                      <div className="px-3 py-1 bg-white text-[#f8992f] text-sm font-semibold rounded-full">
                        Selected
                      </div>
                    ) : isPrepaid && savings > 0 ? (
                      <div className="px-3 py-1 bg-[#22c55e] text-white text-sm font-semibold rounded-full">
                        Save ${savings.toFixed(2)}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
