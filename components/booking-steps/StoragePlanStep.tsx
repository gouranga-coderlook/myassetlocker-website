"use client";

interface StoragePlanStepProps {
  plan: string;
  setPlan: (plan: string) => void;
  selectedBundle: string | null;
  onBundleSelect: (bundle: string) => void;
}

export default function StoragePlanStep({
  plan,
  setPlan,
  selectedBundle,
  onBundleSelect,
}: StoragePlanStepProps) {
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
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Payment Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            className={`flex items-center space-x-3 cursor-pointer p-4 border-2 rounded-lg hover:border-[#f8992f] transition bg-white ${
              plan === "prepaid" ? "border-[#f8992f]" : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="planType"
              value="prepaid"
              checked={plan === "prepaid"}
              onChange={() => setPlan("prepaid")}
              className="w-5 h-5"
            />
            <div
              className={
                plan === "prepaid" ? "text-[#f8992f]" : "text-gray-700"
              }
            >
              <strong className="block">Prepaid Plan</strong>
              <small>Save up to 30% with advance payment</small>
            </div>
          </label>
          <label
            className={`flex items-center space-x-3 cursor-pointer p-4 border-2 rounded-lg hover:border-[#f8992f] transition bg-white ${
              plan === "monthly" ? "border-[#f8992f]" : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="planType"
              value="monthly"
              checked={plan === "monthly"}
              onChange={() => setPlan("monthly")}
              className="w-5 h-5"
            />
            <div
              className={
                plan === "monthly" ? "text-[#f8992f]" : "text-gray-700"
              }
            >
              <strong className="block">Month-to-Month</strong>
              <small>Pay as you go flexibility</small>
            </div>
          </label>
        </div>
      </div>

      {/* Bundle Selection - Grid */}
      <div className="">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          💰 Special Bundle Offers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => onBundleSelect("summer")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onBundleSelect("summer");
            }}
            role="button"
            tabIndex={0}
            className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedBundle === "summer"
                ? "border-[#f8992f]"
                : "border-gray-200 hover:border-[#f8992f]"
            }`}
          >
            <h4 className="text-lg font-bold mb-2">🎓 Summer Bundle</h4>
            <p className="text-gray-600 text-sm mb-2">
              <strong>5 bins + 1 bulky item</strong>
              <br />
              Pickup + FREE return
              <br />
              May-Aug
            </p>
            <div className="text-xl font-bold text-[#f8992f] mb-1">
              $229/term
            </div>
            <small className="text-gray-500 text-xs">
              Extras: $25/bin, $49/bulky
            </small>
          </div>
          <div
            onClick={() => onBundleSelect("ski")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onBundleSelect("ski");
            }}
            role="button"
            tabIndex={0}
            className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedBundle === "ski"
                ? "border-[#f8992f]"
                : "border-gray-200 hover:border-[#f8992f]"
            }`}
          >
            <h4 className="text-lg font-bold mb-2">⛷️ Ski Season Stash</h4>
            <p className="text-gray-600 text-sm mb-2">
              <strong>2 bins + 1 bulky item</strong>
              <br />
              Pickup + spring return
              <br />
              Nov-Apr
            </p>
            <div className="text-xl font-bold text-[#f8992f] mb-1">
              $149/term
            </div>
            <small className="text-gray-500 text-xs">
              Add tire storage: +$99
            </small>
          </div>
          <div
            onClick={() => onBundleSelect("custom")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onBundleSelect("custom");
            }}
            role="button"
            tabIndex={0}
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
    </div>
  );
}
