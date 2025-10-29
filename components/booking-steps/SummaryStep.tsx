"use client";

interface AddonItem {
  price: number;
  name: string;
  icon: string;
}

interface Bundle {
  name: string;
  bins: number;
  bulkyItem?: number;
  price: number;
  months: number;
  features: string[];
  extras?: Record<string, number>;
}

interface ProtectionPlan {
  name: string;
  price: number;
  limit: string;
  description: string;
  features: string[];
  monthly: boolean;
  included: boolean;
}

interface SummaryStepProps {
  plan: string;
  selectedMonths: number | null;
  selectedBins: number;
  selectedAddons: string[];
  climateControl: boolean;
  addonPricing: Record<string, AddonItem>;
  calculateBookingTotal: () => number;
  selectedBundle: string | null;
  bundles: Record<string, Bundle>;
  protectionPlan: string;
  protectionPlans: Record<string, ProtectionPlan>;
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
}

export default function SummaryStep({
  plan,
  selectedMonths,
  selectedBins,
  selectedAddons,
  climateControl,
  addonPricing,
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
}: SummaryStepProps) {
  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
      <div className="space-y-4 bg-white rounded-lg p-6">
        <div className="flex justify-between pb-4 border-b border-gray-300">
          <span className="text-gray-600">Storage Plan:</span>
          <span className="font-semibold">
            {plan === "prepaid" ? "Prepaid" : "Month-to-Month"}
          </span>
        </div>
        {selectedBundle && bundles?.[selectedBundle] && (
          <div className="flex justify-between pb-4 border-b border-gray-300">
            <span className="text-gray-600">Bundle:</span>
            <span className="font-semibold text-[#f8992f]">
              {bundles[selectedBundle].name}
            </span>
          </div>
        )}
        <div className="flex justify-between pb-4 border-b border-gray-300">
          <span className="text-gray-600">Duration:</span>
          <span className="font-semibold">
            {selectedMonths} {selectedMonths === 1 ? "month" : "months"}
          </span>
        </div>
        <div className="flex justify-between pb-4 border-b border-gray-300">
          <span className="text-gray-600">Storage Items:</span>
          <span className="font-semibold">
            {selectedBins > 0 &&
              `${selectedBins} bin${selectedBins > 1 ? "s" : ""}`}
            {selectedBins > 0 && selectedAddons.length > 0 && ", "}
            {selectedAddons.map((key) => addonPricing[key]?.name).join(", ")}
          </span>
        </div>
        {climateControl && (
          <div className="flex justify-between pb-4 border-b border-gray-300">
            <span className="text-gray-600">Climate Control:</span>
            <span className="font-semibold">+20%</span>
          </div>
        )}
        <div className="flex justify-between pb-4 border-b border-gray-300">
          <span className="text-gray-600">Protection Plan:</span>
          <span className="font-semibold">
            {protectionPlans[protectionPlan]?.name || "Basic Protection"}
            {protectionPlan !== "basic" &&
              protectionPlans[protectionPlan]?.price > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  (${protectionPlans[protectionPlan].price}/month)
                </span>
              )}
          </span>
        </div>
        <div className="flex justify-between pt-4">
          <span className="text-2xl font-bold">Total Amount:</span>
          <span className="text-2xl font-bold text-[#f8992f]">
            ${calculateBookingTotal().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
