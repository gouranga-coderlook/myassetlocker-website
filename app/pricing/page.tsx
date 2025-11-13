"use client";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import Hero from "@/components/Hero";
import AppShowcase from "@/components/AppShowcase";
import StoreLocationFinder from "@/components/StoreLocationFinder";
import StoragePlanStep from "@/components/booking-steps/StoragePlanStep";
import DurationBinsStep from "@/components/booking-steps/DurationBinsStep";
import AddonsStep from "@/components/booking-steps/AddonsStep";
import DeliveryInformationStep from "@/components/booking-steps/DeliveryInformationStep";
import SummaryStep from "@/components/booking-steps/SummaryStep";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type { Plan, Bundle } from "@/store/slices/pricingSlice";
import {
  setPlan,
  setMonths,
  setBins,
  setBundle,
  toggleAddon,
  setClimateControl,
  setProtectionPlan,
  setDeliveryInfo,
  setPricingBreakdown,
} from "@/store/slices/cartSlice";

export default function PricingPage() {
  const dispatch = useAppDispatch();
  
  // Get Redux pricing data (raw API response)
  const pricingData = useAppSelector((state) => state.pricing.data);
  
  // Get cart state from Redux
  const cart = useAppSelector((state) => state.cart);

  // Booking workflow state (synced with cart)
  const [currentStep, setCurrentStep] = useState(1);
  const plan = cart.plan; // Now a Plan object with full details
  const selectedMonths = cart.durationBins.months;
  const selectedBins = cart.durationBins.bins;
  const selectedBundle = cart.bundles; // Now a Bundle object or null
  const selectedAddons = cart.addons; // Now an array of Addon objects
  const climateControl = cart.climateControl;
  const protectionPlan = cart.protectionPlan; // Now a ProtectionPlan object or null
  const fullName = cart.deliveryInfo.fullName;
  const email = cart.deliveryInfo.email;
  const phone = cart.deliveryInfo.phone;
  const deliveryAddress = cart.deliveryInfo.deliveryAddress;
  const city = cart.deliveryInfo.city;
  const state = cart.deliveryInfo.state;
  const zipCode = cart.deliveryInfo.zipCode;
  const deliveryNotes = cart.deliveryInfo.deliveryNotes;

  // Helper functions
  const prepaidPlan = useMemo(() => {
    return pricingData?.plans.find((p) => 
      p.plan_name.toLowerCase().includes("prepaid")
    );
  }, [pricingData]);
  
  const monthToMonthPlan = useMemo(() => {
    return pricingData?.plans.find((p) => 
      p.plan_name.toLowerCase().includes("month")
    );
  }, [pricingData]);

  // Helper to get bundle by key
  const getBundleByKey = (key: string): Bundle | undefined => {
    if (!pricingData?.bundles) return undefined;
    const bundle = pricingData.bundles.find((b) => 
      key === "summer" ? b.bundle_name.toLowerCase().includes("summer") :
      key === "ski" ? b.bundle_name.toLowerCase().includes("ski") :
      b.id === key
    );
    return bundle;
  };

  // Set prepaid plan as default when pricing data loads
  useEffect(() => {
    if (pricingData && !plan && prepaidPlan) {
      dispatch(setPlan(prepaidPlan));
    }
  }, [pricingData, plan, prepaidPlan, dispatch]);

  // Wrapper functions that update both local state and Redux cart
  const handleSetPlan = (newPlan: Plan | null) => {
    dispatch(setPlan(newPlan));
    // Reset custom plan flag when plan changes
    if (newPlan) {
      setIsCustomPlanSelected(false);
    }
  };

  const handleSetSelectedMonths = (months: number | null) => {
    dispatch(setMonths(months));
  };

  const handleSetSelectedBins = (bins: number) => {
    dispatch(setBins(bins));
  };

  const handleToggleAddon = (addonKey: string) => {
    // Find the addon object from pricing data
    const addon = pricingData?.addons.find(a => 
      a.name.toLowerCase().replace(/\s+/g, "") === addonKey
    );
    if (addon) {
      dispatch(toggleAddon(addon));
    }
  };

  const handleSetClimateControl = (value: boolean) => {
    dispatch(setClimateControl(value));
  };

  const handleSetProtectionPlan = (planKey: string) => {
    // Find the protection plan object from pricing data
    const planData = pricingData?.protection_plans.find(p => 
      planKey === "basic" ? p.name.toLowerCase().includes("basic") :
      planKey === "enhanced" ? p.name.toLowerCase().includes("enhanced") :
      planKey === "premium" ? p.name.toLowerCase().includes("premium") :
      p.name.toLowerCase().includes(planKey)
    );
    dispatch(setProtectionPlan(planData || null));
  };

  const handleSetFullName = (name: string) => {
    dispatch(setDeliveryInfo({ fullName: name }));
  };

  const handleSetEmail = (email: string) => {
    dispatch(setDeliveryInfo({ email }));
  };

  const handleSetPhone = (phone: string) => {
    dispatch(setDeliveryInfo({ phone }));
  };

  const handleSetDeliveryAddress = (address: string) => {
    dispatch(setDeliveryInfo({ deliveryAddress: address }));
  };

  const handleSetCity = (city: string) => {
    dispatch(setDeliveryInfo({ city }));
  };

  const handleSetState = (state: string) => {
    dispatch(setDeliveryInfo({ state }));
  };

  const handleSetZipCode = (zipCode: string) => {
    dispatch(setDeliveryInfo({ zipCode }));
  };

  const handleSetDeliveryNotes = (notes: string) => {
    dispatch(setDeliveryInfo({ deliveryNotes: notes }));
  };

  const getDeliveryFeePerItem = () => {
    // Get delivery fee from selected addon if available
    if (selectedAddons.length > 0 && selectedAddons[0]) {
      return selectedAddons[0].reDeliveryFee;
    }
    
    // Default delivery fee
    const isMonthly = plan?.plan_name.toLowerCase().includes("month");
    if (isMonthly || !selectedMonths) return 39;
    if (selectedMonths >= 12) return 0;
    if (selectedMonths >= 9) return 10;
    if (selectedMonths >= 6) return 20;
    if (selectedMonths >= 3) return 30;
    return 39;
  };

  // Track if custom plan was explicitly selected
  const [isCustomPlanSelected, setIsCustomPlanSelected] = useState(false);

  const handleBundleSelect = (type: string) => {
    const bundle = getBundleByKey(type);
    if (bundle) {
      // Bundle selected - set bundle data but don't navigate yet
      // User must also select a plan before proceeding
      dispatch(setBundle(bundle));
      handleSetSelectedMonths(bundle.months);
      // Extract bins from bundle description or use defaults
      const bins = bundle.bundle_name.toLowerCase().includes("ski") ? 2 : 5;
      handleSetSelectedBins(bins);
      setIsCustomPlanSelected(false);
    } else if (type === "custom") {
      // Custom plan selected - clear bundle and reset duration/bins
      dispatch(setBundle(null));
      handleSetSelectedMonths(null); // Clear duration
      handleSetSelectedBins(0); // Clear bins
      setIsCustomPlanSelected(true);
    }
    // Don't auto-navigate - user must click Next button after selecting plan
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
    if (!pricingData) return 0;
    
    let total = 0;

    // Check if a bundle is selected
    if (selectedBundle) {
      let bundlePrice = selectedBundle.price;
      
      // Apply plan discount if plan is selected and has discount
      if (plan && plan.hasDiscount && plan.discount_value > 0) {
        if (plan.discount_type === "percentage") {
          // Apply percentage discount
          const discountAmount = (bundlePrice * plan.discount_value) / 100;
          bundlePrice = bundlePrice - discountAmount;
        } else if (plan.discount_type === "fixed" || plan.discount_type === "amount") {
          // Apply fixed amount discount
          bundlePrice = Math.max(0, bundlePrice - plan.discount_value);
        }
      }
      
      total = bundlePrice;

      // Climate control (+20% on storage cost)
      if (climateControl && selectedBins > 0 && selectedMonths) {
        const storageCost = selectedBins * selectedMonths * (prepaidPlan?.perBinPrice || 7.5);
        const climateAddon = pricingData.addons.find(a => a.name === "Climate-Controlled Storage");
        if (climateAddon && climateAddon.chargeType === "percent") {
          total += storageCost * (climateAddon.amount / 100);
        }
      }

      // Protection Plan
      if (protectionPlan && selectedMonths) {
        total += protectionPlan.price * selectedMonths;
      }

      // Add delivery zone/charge
      if (cart.locationData?.matchedZone) {
        total += cart.locationData.matchedZone.price;
      } else if (cart.locationData?.deliveryCharge && typeof cart.locationData.deliveryCharge === 'number') {
        const region = cart.locationData.nearestStore?.region?.toLowerCase();
        const charge = cart.locationData.deliveryCharge;
        // Convert rupees to USD if region is India (1 USD ≈ 83 INR)
        total += region === 'india' ? charge / 83 : charge;
      }

      return total;
    }

    // Regular pricing calculation (no bundle)
    if (selectedBins > 0 && selectedMonths && plan) {
      const monthsStr = selectedMonths.toString();
      const binsStr = selectedBins.toString();
      const pricing = plan.pricing[monthsStr]?.[binsStr];
      if (pricing) {
        total += pricing.base + pricing.deliveryFee;
      }
    }

    // Add-ons pricing
    selectedAddons.forEach((addon) => {
      if (addon.recurrence === "monthly" && selectedMonths) {
        total += addon.amount * selectedMonths;
      } else if (addon.recurrence === "one_time") {
        total += addon.amount;
      }
      total += addon.reDeliveryFee;
    });

    // Climate control
    if (climateControl && (selectedBins > 0 || selectedAddons.length > 0)) {
      const climateAddon = pricingData.addons.find(a => a.name === "Climate-Controlled Storage");
      if (climateAddon) {
        const storageCost = selectedBins > 0 && selectedMonths
          ? selectedBins * selectedMonths * (prepaidPlan?.perBinPrice || 7.5)
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
    if (protectionPlan && selectedMonths) {
      total += protectionPlan.price * selectedMonths;
    }

    // Add delivery zone/charge
    if (cart.locationData?.matchedZone) {
      total += cart.locationData.matchedZone.price;
    } else if (cart.locationData?.deliveryCharge && typeof cart.locationData.deliveryCharge === 'number') {
      const region = cart.locationData.nearestStore?.region?.toLowerCase();
      const charge = cart.locationData.deliveryCharge;
      // Convert rupees to USD if region is India (1 USD ≈ 83 INR)
      total += region === 'india' ? charge / 83 : charge;
    }

    return total;
  };

  // Calculate pricing breakdown and update cart slice
  useEffect(() => {
    if (!pricingData) return;

    let baseStorageCost = 0;
    let redeliveryFee = 0;
    let climateControlCost = 0;
    let addonsCost = 0;
    let addonsDeliveryCost = 0;
    let protectionPlanCost = 0;
    let savings = 0;

    // If bundle is selected
    if (selectedBundle) {
      let bundlePrice = selectedBundle.price || 0;
      
      // Apply plan discount if plan is selected and has discount
      if (plan && plan.hasDiscount && plan.discount_value > 0) {
        if (plan.discount_type === "percentage") {
          const discountAmount = (bundlePrice * plan.discount_value) / 100;
          bundlePrice = bundlePrice - discountAmount;
          savings = discountAmount;
        } else if (plan.discount_type === "fixed" || plan.discount_type === "amount") {
          bundlePrice = Math.max(0, bundlePrice - plan.discount_value);
          savings = plan.discount_value;
        }
      }
      
      baseStorageCost = bundlePrice;
      redeliveryFee = 0; // Bundles don't have redelivery fees
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
      const climateAddon = pricingData.addons.find(a => a.name === "Climate-Controlled Storage");
      if (climateAddon) {
        const storageCost = selectedBins > 0 && selectedMonths
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
    selectedAddons.forEach((addon) => {
      if (addon.recurrence === "monthly" && selectedMonths) {
        addonsCost += addon.amount * selectedMonths;
      } else if (addon.recurrence === "one_time") {
        addonsCost += addon.amount;
      }
      addonsDeliveryCost += addon.reDeliveryFee;
    });

    // Protection plan cost
    if (protectionPlan && selectedMonths) {
      protectionPlanCost = protectionPlan.price * selectedMonths;
    }

    // Calculate total
    const total = baseStorageCost + redeliveryFee + climateControlCost + addonsCost + addonsDeliveryCost + protectionPlanCost;

    // Update cart slice with pricing breakdown
    dispatch(setPricingBreakdown({
      total,
      baseStorageCost,
      redeliveryFee,
      climateControlCost,
      addonsCost,
      addonsDeliveryCost,
      protectionPlanCost,
      savings,
    }));
  }, [
    pricingData,
    plan,
    selectedBundle,
    selectedBins,
    selectedMonths,
    selectedAddons,
    climateControl,
    protectionPlan,
    prepaidPlan,
    monthToMonthPlan,
    dispatch,
  ]);

  // Get loading and error state from Redux
  const loading = useAppSelector((state) => state.pricing.loading);
  const error = useAppSelector((state) => state.pricing.error);

  // Show loading or error state if pricing data is not available
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  if (error || !pricingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load pricing data</p>
          <p className="text-gray-600">{error || "Pricing data is not available"}</p>
        </div>
      </div>
    );
  }

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
      {/* Store Location Finder */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <StoreLocationFinder />
      </div>
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
                    onClick={() => {
                      // Handle step navigation with bundle logic
                      if (selectedBundle) {
                        // If bundle is selected, skip steps 2 and 3
                        if (num === 2 || num === 3) {
                          return; // Disable clicking on skipped steps
                        }
                      }
                      // Regular flow - allow navigation to any step
                      setCurrentStep(num);
                    }}
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
                setPlan={handleSetPlan}
                selectedBundle={selectedBundle ? (selectedBundle.bundle_name.toLowerCase().includes("summer") ? "summer" : selectedBundle.bundle_name.toLowerCase().includes("ski") ? "ski" : selectedBundle.id) : (isCustomPlanSelected ? "custom" : null)}
                onBundleSelect={handleBundleSelect}
              />
            )}

            {/* Step 2: Duration & Bins */}
            {currentStep === 2 && (
              <DurationBinsStep
                selectedMonths={selectedMonths}
                setSelectedMonths={handleSetSelectedMonths}
                selectedBins={selectedBins}
                setSelectedBins={handleSetSelectedBins}
                prepaidPlan={prepaidPlan}
                monthToMonthPlan={monthToMonthPlan}
                currentPlan={plan}
              />
            )}
            {/* Step 3: Add-ons */}
            {currentStep === 3 && (
              <AddonsStep
                addons={pricingData?.addons || []}
                selectedAddons={selectedAddons.map(a => a.name.toLowerCase().replace(/\s+/g, ""))}
                toggleAddon={handleToggleAddon}
                climateControl={climateControl}
                setClimateControl={handleSetClimateControl}
                getDeliveryFeePerItem={getDeliveryFeePerItem}
                protectionPlans={pricingData?.protection_plans || []}
                protectionPlan={protectionPlan ? (protectionPlan.name.toLowerCase().includes("basic") ? "basic" : protectionPlan.name.toLowerCase().includes("enhanced") ? "enhanced" : protectionPlan.name.toLowerCase().includes("premium") ? "premium" : "basic") : "basic"}
                setProtectionPlan={handleSetProtectionPlan}
              />
            )}
            {/* Step 4: Delivery Information */}
            {currentStep === 4 && (
              <DeliveryInformationStep
                fullName={fullName}
                setFullName={handleSetFullName}
                email={email}
                setEmail={handleSetEmail}
                phone={phone}
                setPhone={handleSetPhone}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={handleSetDeliveryAddress}
                city={city}
                setCity={handleSetCity}
                state={state}
                setState={handleSetState}
                zipCode={zipCode}
                setZipCode={handleSetZipCode}
                deliveryNotes={deliveryNotes}
                setDeliveryNotes={handleSetDeliveryNotes}
              />
            )}
            {/* Step 5: Summary */}
            {currentStep === 5 && (
              <SummaryStep
                plan={plan}
                selectedMonths={selectedMonths}
                selectedBins={selectedBins}
                selectedAddons={selectedAddons.map(a => a.name.toLowerCase().replace(/\s+/g, ""))}
                climateControl={climateControl}
                addons={pricingData?.addons || []}
                calculateBookingTotal={calculateBookingTotal}
                selectedBundle={selectedBundle}
                bundles={pricingData?.bundles || []}
                protectionPlan={protectionPlan ? (protectionPlan.name.toLowerCase().includes("basic") ? "basic" : protectionPlan.name.toLowerCase().includes("enhanced") ? "enhanced" : protectionPlan.name.toLowerCase().includes("premium") ? "premium" : "basic") : "basic"}
                protectionPlans={pricingData?.protection_plans || []}
                fullName={fullName}
                setFullName={handleSetFullName}
                email={email}
                setEmail={handleSetEmail}
                phone={phone}
                setPhone={handleSetPhone}
                prepaidPlan={prepaidPlan}
                monthToMonthPlan={monthToMonthPlan}
                getDeliveryFeePerItem={getDeliveryFeePerItem}
              />
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8">
              {currentStep > 1 && (
                <button
                  onClick={() => {
                    // Handle Previous button with bundle logic
                    if (currentStep === 4 && selectedBundle) {
                      // If on Delivery Info and bundle is selected, go back to Storage Type (step 1)
                      setCurrentStep(1);
                    } else {
                      setCurrentStep((prev) => prev - 1);
                    }
                  }}
                  suppressHydrationWarning
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition cursor-pointer"
                >
                  Previous
                </button>
              )}
              {currentStep < 5 && (
                <button
                  onClick={() => {
                    // Step 1 validation: Must select a plan AND (bundle OR custom plan)
                    if (currentStep === 1) {
                      if (!plan) {
                        toast.error("Please select a Payment Plan before proceeding.");
                        return;
                      }
                      if (!selectedBundle && !isCustomPlanSelected) {
                        toast.error("Please choose a Bundle Offer or Custom Plan before proceeding.");
                        return;
                      }
                      // If bundle is selected, skip to Delivery Info (step 4)
                      if (selectedBundle) {
                        setCurrentStep(4);
                        return;
                      }
                      // If custom plan is selected, go to Duration & Bins (step 2)
                      if (isCustomPlanSelected) {
                        setCurrentStep(2);
                        return;
                      }
                    }
                    // Step 2 validation: Must select duration (only for custom plan, not bundles)
                    // Bins can be 0 (for bulky items only), but duration is required
                    if (currentStep === 2 && !selectedBundle) {
                      if (selectedMonths === null || selectedMonths === undefined) {
                        toast.error("Please select a storage duration before proceeding.");
                        return;
                      }
                      // Duration is selected, allow proceeding (bins can be 0 for bulky items)
                    }
                    // Step 4 validation: Must fill all required delivery information fields
                    if (currentStep === 4) {
                      if (!fullName || fullName.trim() === "") {
                        toast.error("Please enter your full name.");
                        return;
                      }
                      if (!email || email.trim() === "") {
                        toast.error("Please enter your email address.");
                        return;
                      }
                      // Basic email validation
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(email.trim())) {
                        toast.error("Please enter a valid email address.");
                        return;
                      }
                      if (!phone || phone.trim() === "") {
                        toast.error("Please enter your phone number.");
                        return;
                      }
                      if (!deliveryAddress || deliveryAddress.trim() === "") {
                        toast.error("Please enter your delivery address.");
                        return;
                      }
                      if (!city || city.trim() === "") {
                        toast.error("Please enter your city.");
                        return;
                      }
                      if (!state || state.trim() === "") {
                        toast.error("Please enter your state.");
                        return;
                      }
                      if (!zipCode || zipCode.trim() === "") {
                        toast.error("Please enter your ZIP code.");
                        return;
                      }
                    }
                    // Default: go to next step
                    setCurrentStep((prev) => prev + 1);
                  }}
                  suppressHydrationWarning
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
                  suppressHydrationWarning
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
