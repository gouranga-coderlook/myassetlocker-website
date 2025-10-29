"use client";
import { useState } from "react";
import Hero from "@/components/Hero";
import AppShowcase from "@/components/AppShowcase";
import StoragePlanStep from "@/components/booking-steps/StoragePlanStep";
import DurationBinsStep from "@/components/booking-steps/DurationBinsStep";
import AddonsStep from "@/components/booking-steps/AddonsStep";
import DeliveryInformationStep from "@/components/booking-steps/DeliveryInformationStep";
import SummaryStep from "@/components/booking-steps/SummaryStep";
import pricingData from "@/lib/pricing-model.json";

export default function PricingPage() {
  // Booking workflow state
  const [currentStep, setCurrentStep] = useState(1);
  const [plan, setPlan] = useState("prepaid");
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null);
  const [selectedBins, setSelectedBins] = useState<number>(0);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [climateControl, setClimateControl] = useState(false);
  const [protectionPlan, setProtectionPlan] = useState<string>("basic");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  // Use pricing data from JSON
  const addonPricing: Record<
    string,
    { price: number; name: string; icon: string }
  > = pricingData.addons as Record<
    string,
    { price: number; name: string; icon: string }
  >;

  const getDeliveryFeePerItem = () => {
    if (plan === "monthly") return 39;
    if (!selectedMonths) return 39;
    if (selectedMonths >= 12) return 0;
    if (selectedMonths >= 9) return 10;
    if (selectedMonths >= 6) return 20;
    if (selectedMonths >= 3) return 30;
    return 39;
  };

  const handleBundleSelect = (type: string) => {
    setSelectedBundle(type);
    if (type === "summer") {
      setSelectedMonths(4);
      setSelectedBins(5);
      setCurrentStep(4);
    } else if (type === "ski") {
      setSelectedMonths(6);
      setSelectedBins(2);
      setCurrentStep(4);
    } else {
      setCurrentStep(2);
    }
  };

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  /*
   * PRICING MODEL EXPLANATION:
   *
   * ADVANCE PAYMENT MODEL (PREPAID):
   * - Storage fee is FIXED at $7.50/month per bin
   * - Re-delivery fee (normally $39 for 0-7 miles) is discounted based on:
   *   1. Number of bins: More bins = less re-delivery fee per bin
   *   2. Term length: Longer terms = additional re-delivery fee discount
   *
   * KEY INSIGHT: The discount is in the re-delivery fee, NOT the storage fee.
   *
   * Examples:
   * - 1 bin for 1 month: $7.50 (storage) + $39 (re-delivery) = $46.50
   * - 4 bins for 1 month: $30.00 (storage) + $30 (re-delivery) = $60.00
   * - 20 bins for 1 month: $150.00 (storage) + $0 (re-delivery FREE) = $150.00
   *
   * MONTH-TO-MONTH MODEL:
   * - Fixed $7.50/month per bin
   * - Re-delivery fee is NOT discounted by number of bins
   * - Standard $39 re-delivery fee applies (unless waived by term length)
   */

  const calculateBookingTotal = () => {
    let total = 0;

    // Check if a bundle is selected - use bundle pricing + extras
    if (
      selectedBundle &&
      pricingData.bundles?.[selectedBundle as keyof typeof pricingData.bundles]
    ) {
      const bundleData =
        pricingData.bundles[selectedBundle as keyof typeof pricingData.bundles];
      total = bundleData.price || 0;

      // Bundle includes bins, months, and re-delivery at fixed price
      // But add-ons, climate control, and protection plans are extras

      // Climate control (+20% on storage cost)
      if (climateControl && selectedBins > 0 && selectedMonths) {
        const storageCost = selectedBins * selectedMonths * 7.5;
        total += storageCost * 0.2;
      }

      // Protection Plan
      if (protectionPlan !== "basic" && selectedMonths) {
        const planData =
          pricingData.protectionPlans?.[
            protectionPlan as keyof typeof pricingData.protectionPlans
          ];
        if (planData && planData.monthly) {
          total += planData.price * selectedMonths;
        }
      }

      // Note: Add-ons are typically not added to bundles as they include items

      return total;
    }

    // Regular pricing calculation (no bundle)
    // Base bin pricing
    if (selectedBins > 0 && selectedMonths) {
      if (plan === "prepaid") {
        const prepaidTotal =
          (pricingData.prepaid.grid.totals as unknown as Record<string, Record<string, number | string>>)[selectedBins.toString()]?.[
            selectedMonths.toString()
          ];
        total += typeof prepaidTotal === "number" ? prepaidTotal : 0;
      } else {
        const monthlyTotal =
          (pricingData.monthToMonth.grid.totals as unknown as Record<string, Record<string, number | string>>)[selectedBins.toString()]?.[
            selectedMonths.toString()
          ];
        total += typeof monthlyTotal === "number" ? monthlyTotal : 0;
      }
    }

    // Add-ons pricing
    selectedAddons.forEach((addon) => {
      total += (addonPricing[addon]?.price || 0) * (selectedMonths || 1);
      total += getDeliveryFeePerItem();
    });

    // Climate control (+20%)
    if (climateControl && (selectedBins > 0 || selectedAddons.length > 0)) {
      const storageCost =
        selectedBins > 0 && selectedMonths
          ? selectedBins * selectedMonths * 7.5
          : 0;
      total += storageCost * 0.2;
    }

    // Protection Plan pricing
    if (protectionPlan !== "basic" && selectedMonths) {
      const planData =
        pricingData.protectionPlans?.[
          protectionPlan as keyof typeof pricingData.protectionPlans
        ];
      if (planData && planData.monthly) {
        total += planData.price * selectedMonths;
      }
    }

    return total;
  };

  // DUPLICATE - Removed. Using JSON import from lib/pricing-model.json
  const pricingDataLocal: {
    monthlyRatePerBin: number;
    baseRedeliveryFee: number;
    prepaidGrid: {
      bins: number[];
      months: number[];
      totals: Record<string, Record<string, number>>;
    };
    mtmGrid: {
      totals: Record<string, Record<string, number>>;
    };
  } = {
    monthlyRatePerBin: 7.5,
    baseRedeliveryFee: 39,
    prepaidGrid: {
      bins: [1, 4, 10, 15, 20],
      months: [1, 3, 6, 9, 12],
      totals: {
        "1": { "1": 46.5, "3": 52.5, "6": 65, "9": 77.5, "12": 90 },
        "4": { "1": 60, "3": 110, "6": 190, "9": 270, "12": 360 },
        "10": { "1": 95, "3": 235, "6": 450, "9": 652.5, "12": 810 },
        "15": { "1": 122.5, "3": 337.5, "6": 652.5, "9": 945, "12": 1170 },
        "20": { "1": 150, "3": 420, "6": 810, "9": 1170, "12": 1440 },
      },
    },
    mtmGrid: {
      totals: {
        "1": { "1": 46.5, "3": 61.5, "6": 84, "9": 106.5, "12": 129 },
        "4": { "1": 69, "3": 129, "6": 219, "9": 309, "12": 399 },
        "10": { "1": 114, "3": 264, "6": 489, "9": 714, "12": 939 },
        "15": { "1": 151.5, "3": 376.5, "6": 714, "9": 1051.5, "12": 1350 },
        "20": { "1": 189, "3": 489, "6": 939, "9": 1389, "12": 1839 },
      },
    },
  };
  const bins = pricingDataLocal.prepaidGrid.bins;
  const months = pricingDataLocal.prepaidGrid.months;
  const [binCount] = useState(String(bins[0]));
  const [term] = useState(String(months[0]));

  const prepaid = pricingDataLocal.prepaidGrid.totals[binCount]?.[term] || 0;
  const mtm = pricingDataLocal.mtmGrid.totals[binCount]?.[term] || 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        backgroundImage="/household-storage-service.webp"
        headline="Simple, Transparent Storage Pricing"
        bodyText="Pay per bin, add bulky items, and save with prepaid plans. No hidden fees, no surprises."
        ctaButton={{
          enabled: false,
        }}
      />
      {/* Valet Storage Booking Workflow */}
      <section className="py-20 px-4 relative bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-[#4c4946] mb-4">
            📦 Valet Storage Booking
          </h1>
          <p className="text-lg text-[#8e9293] max-w-2xl mx-auto leading-relaxed">
            Simple, convenient storage with pickup and delivery service.
          </p>
        </div>
        <div className="max-w-5xl mx-auto bg-transparent">
          {/* Progress Bar */}
          <div className="mb-6">
            <ol className="flex items-center w-full">
              {[
                { num: 1, label: "Storage Type" },
                { num: 2, label: "Duration & Bins" },
                { num: 3, label: "Add-ons" },
                { num: 4, label: "Delivery Info" },
                { num: 5, label: "Summary" },
              ].map(({ num, label }, index, array) => (
                <li
                  key={num}
                  className={`relative flex flex-col w-full items-center ${
                    index < array.length - 1
                      ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block after:absolute after:top-4 after:left-[calc(50%+17.5px)] after:right-0 " +
                        (currentStep > num
                          ? "after:border-[#22c55e]"
                          : "after:border-gray-300")
                      : ""
                  }`}
                >
                  <div
                    className="flex flex-col items-center shrink-0 cursor-pointer hover:scale-105 transition-all duration-300"
                    onClick={() => setCurrentStep(num)}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        currentStep === num
                          ? "bg-[#f8992f] text-white"
                          : currentStep > num
                          ? "bg-[#22c55e] text-white"
                          : "bg-white border-2 border-gray-300 text-gray-400"
                      }`}
                    >
                      {currentStep > num ? (
                        <svg
                          className="w-3.5 h-3.5 text-white lg:w-4 lg:h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 12"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5.917 5.724 10.5 15 1.5"
                          />
                        </svg>
                      ) : (
                        num
                      )}
                    </div>
                    <div
                      className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                        currentStep === num
                          ? "text-[#f8992f]"
                          : currentStep > num
                          ? "text-gray-700"
                          : "text-gray-400"
                      }`}
                    >
                      {label}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {/* Step 1: Storage Type */}
            {currentStep === 1 && (
              <StoragePlanStep
                plan={plan}
                setPlan={setPlan}
                selectedBundle={selectedBundle}
                onBundleSelect={handleBundleSelect}
              />
            )}

            {/* Step 2: Duration & Bins */}
            {currentStep === 2 && (
              <DurationBinsStep
                selectedMonths={selectedMonths}
                setSelectedMonths={setSelectedMonths}
                selectedBins={selectedBins}
                setSelectedBins={setSelectedBins}
              />
            )}
            {/* Step 3: Add-ons */}
            {currentStep === 3 && (
              <AddonsStep
                addonPricing={addonPricing}
                selectedAddons={selectedAddons}
                toggleAddon={toggleAddon}
                climateControl={climateControl}
                setClimateControl={setClimateControl}
                getDeliveryFeePerItem={getDeliveryFeePerItem}
                protectionPlans={pricingData.protectionPlans}
                protectionPlan={protectionPlan}
                setProtectionPlan={setProtectionPlan}
              />
            )}
            {/* Step 4: Delivery Information */}
            {currentStep === 4 && (
              <DeliveryInformationStep
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
                city={city}
                setCity={setCity}
                state={state}
                setState={setState}
                zipCode={zipCode}
                setZipCode={setZipCode}
                deliveryNotes={deliveryNotes}
                setDeliveryNotes={setDeliveryNotes}
              />
            )}
            {/* Step 5: Summary */}
            {currentStep === 5 && (
              <SummaryStep
                plan={plan}
                selectedMonths={selectedMonths}
                selectedBins={selectedBins}
                selectedAddons={selectedAddons}
                climateControl={climateControl}
                addonPricing={addonPricing}
                calculateBookingTotal={calculateBookingTotal}
                selectedBundle={selectedBundle}
                bundles={pricingData.bundles}
                protectionPlan={protectionPlan}
                protectionPlans={pricingData.protectionPlans}
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
              />
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition cursor-pointer"
                >
                  Previous
                </button>
              )}
              {currentStep < 5 && (
                <button
                  onClick={() => {
                    if (currentStep === 2 && !selectedMonths) {
                      alert("Please select a storage duration.");
                      return;
                    }
                    setCurrentStep((prev) => prev + 1);
                  }}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-[#f8992f] to-[#e8911f] text-white rounded-full font-semibold hover:shadow-lg transition cursor-pointer"
                >
                  Next Step
                </button>
              )}
              {currentStep === 5 && (
                <button
                  onClick={() => {
                    alert("Booking submitted! Check console for details.");
                    console.log({
                      plan,
                      selectedMonths,
                      selectedBins,
                      selectedAddons,
                      climateControl,
                      total: calculateBookingTotal(),
                      contactDetails: {
                        fullName,
                        email,
                        phone,
                      },
                      deliveryAddress: {
                        address: deliveryAddress,
                        city,
                        state,
                        zipCode,
                        notes: deliveryNotes,
                      },
                    });
                  }}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-[#f8992f] to-[#e8911f] text-white rounded-full font-semibold hover:shadow-lg transition cursor-pointer"
                >
                  Complete Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <AppShowcase />
    </div>
  );
}
