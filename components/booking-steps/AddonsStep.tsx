"use client";
import { useMemo } from "react";
import type { Addon, ProtectionPlan } from "@/store/slices/pricingSlice";

// Icon mapping for addons
const ADDON_ICONS: Record<string, string> = {
  "Skis/Snowboard": "⛷️",
  "Bicycle": "🚴",
  "E-Bike": "🔋",
  "Climate-Controlled Storage": "🌡️",
  "Seasonal Tires (4)": "🛞",
  "Luggage": "🧳",
};

interface AddonsStepProps {
  addons: Addon[];
  selectedAddons: string[];
  toggleAddon: (addon: string) => void;
  climateControl: boolean;
  setClimateControl: (value: boolean) => void;
  getDeliveryFeePerItem: () => number;
  protectionPlans: ProtectionPlan[];
  protectionPlan: string;
  setProtectionPlan: (plan: string) => void;
}

export default function AddonsStep({
  addons,
  selectedAddons,
  toggleAddon,
  climateControl,
  setClimateControl,
  getDeliveryFeePerItem,
  protectionPlans,
  protectionPlan,
  setProtectionPlan,
}: AddonsStepProps) {
  // Filter out climate control as it's handled separately
  const bulkyAddons = addons.filter(a => a.name !== "Climate-Controlled Storage");
  const climateAddon = addons.find(a => a.name === "Climate-Controlled Storage");

  // Sort protection plans by price (low to high)
  const sortedProtectionPlans = useMemo(() => {
    return [...protectionPlans].sort((a, b) => a.price - b.price);
  }, [protectionPlans]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Additional Services</h2>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm">
          <strong>Note:</strong> Each bulky item includes its own re-delivery
          fee. Prepaid plans get discounted re-delivery rates based on duration.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Bulky Items Storage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bulkyAddons.map((addon) => {
            const addonKey = addon.name.toLowerCase().replace(/\s+/g, "");
            const priceDisplay = addon.recurrence === "monthly" 
              ? `$${addon.amount}/month`
              : `$${addon.amount}`;
            
            return (
              <div
                key={addon.name}
                onClick={() => toggleAddon(addonKey)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleAddon(addonKey);
                }}
                role="button"
                tabIndex={0}
                className={`flex items-center p-4 bg-white rounded-lg border-2 cursor-pointer transition ${
                  selectedAddons.includes(addonKey)
                    ? "border-[#f8992f]"
                    : "border-gray-200 hover:border-[#f8992f]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAddons.includes(addonKey)}
                  onChange={() => toggleAddon(addonKey)}
                  className="w-5 h-5 mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {ADDON_ICONS[addon.name] || "📦"} {addon.name}
                    </span>
                    <span className="font-bold text-[#f8992f]">
                      {priceDisplay}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {addon.reDeliveryFee > 0
                      ? `+ $${addon.reDeliveryFee} re-delivery fee`
                      : "FREE re-delivery"}
                  </div>
                  {addon.description && (
                    <div className="text-xs text-gray-400 mt-1">
                      {addon.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div
            onClick={() => setClimateControl(!climateControl)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setClimateControl(!climateControl);
            }}
            role="button"
            tabIndex={0}
            className={`relative flex items-center p-4 bg-white rounded-lg border-2 cursor-pointer transition ${
              climateControl
                ? "border-[#f8992f]"
                : "border-gray-200 hover:border-[#f8992f]"
            }`}
          >
             {/* Premium badge */}
             <div
               className="absolute -top-2 md:top-2 right-2 px-2 py-1 text-xs rounded-full bg-[#f8992f] text-white"
             >
               <span>★</span> Premium Feature
             </div>
            <input
              type="checkbox"
              checked={climateControl}
              onChange={() => setClimateControl(!climateControl)}
              className="w-5 h-5 mr-4"
            />
            <div className="flex-1">
              <span className="font-semibold">
                🌡️ Climate-Controlled Storage
              </span>
              <div className="text-sm text-gray-500 mt-1">
                +20% to total storage cost
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Protection Plans</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {sortedProtectionPlans.map((plan) => {
            const planKey = plan.name.toLowerCase().includes("basic")
              ? "basic"
              : plan.name.toLowerCase().includes("enhanced")
              ? "enhanced"
              : plan.name.toLowerCase().includes("premium")
              ? "premium"
              : plan.name.toLowerCase().replace(/\s+/g, "");
            
            return (
              <div
                key={plan.name}
                onClick={() => setProtectionPlan(planKey)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setProtectionPlan(planKey);
                }}
                role="button"
                tabIndex={0}
                className={`p-4 border-2 rounded-lg cursor-pointer transition bg-white ${
                  protectionPlan === planKey
                    ? "border-[#f8992f]"
                    : "border-gray-200 hover:border-[#f8992f]"
                }`}
              >
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="protectionPlan"
                    checked={protectionPlan === planKey}
                    onChange={() => setProtectionPlan(planKey)}
                    className="w-4 h-4 mr-2"
                  />
                  <span className="font-bold text-lg">{plan.name}</span>
                </div>
                <div className="text-2xl font-bold text-[#f8992f] mb-2">
                  {plan.price === 0 ? "Included" : plan.displayPrice}
                </div>
                <div className="text-sm text-gray-600 mb-2">{plan.displayLimit}</div>
                <div className="text-sm text-gray-500">{plan.description}</div>
                {plan.name.toLowerCase().includes("premium") && (
                  <div className="mt-2 text-xs font-semibold text-[#22c55e]">
                    ✓ Most Popular
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

