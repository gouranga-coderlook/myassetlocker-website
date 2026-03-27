"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Hero from "@/components/Hero";
import AppShowcase from "@/components/AppShowcase";
import StoragePlanStep from "@/components/booking-steps/StoragePlanStep";
import DurationBinsStep from "@/components/booking-steps/DurationBinsStep";
import AddonsStep from "@/components/booking-steps/AddonsStep";
import DeliveryInformationStep from "@/components/booking-steps/DeliveryInformationStep";
import SummaryStep from "@/components/booking-steps/SummaryStep";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useAuth } from "@/lib/hooks/useAuth";
import type { Plan, Bundle, Addon, ProtectionPlan } from "@/store/slices/pricingSlice";
import {
  initializeCart,
  setLocationData,
  updateLocationData,
} from "@/store/slices/cartSlice";
import type { BookingCart } from "@/store/slices/cartSlice";
import { fetchProfileIfNeeded } from "@/store/slices/profileSlice";
import { transformCartDtoToBookingCart, transformBookingCartToAddCartItemDto, addCartItem } from "@/lib/api/cartService";
import { resolveDeliveryFee } from "@/lib/api/warehouseService";

/** Set to true to allow clicking step indicators to jump between steps; false for sequential-only navigation. */
const ALLOW_STEP_CLICK_NAVIGATION = false;

export default function PricingPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, authHydrated, openAuthPopup } = useAuth();
  const pendingBookingRef = useRef(false);
  const pendingStepProgressionRef = useRef(false);
  const addressPricingRequestIdRef = useRef(0);
  const [isCompletingBooking, setIsCompletingBooking] = useState(false);
  const [isSavingCart, setIsSavingCart] = useState(false);
  const [isResolvingDeliveryPricing, setIsResolvingDeliveryPricing] = useState(false);

  // Get Redux pricing data (raw API response)
  const pricingData = useAppSelector((state) => state.pricing.data);
  // Get loading and error state from Redux
  const loading = useAppSelector((state) => state.pricing.loading);
  const error = useAppSelector((state) => state.pricing.error);
  // Get cart state from Redux (only used in Summary step after API call)
  const cart = useAppSelector((state) => state.cart);
  const locationData = useAppSelector((state) => state.cart.locationData);
  const profile = useAppSelector((state) => state.profile.profileData);
  const hasInitializedContactFromProfile = useRef(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [planSelectionError, setPlanSelectionError] = useState<string | null>(null);
  const [bundleSelectionError, setBundleSelectionError] = useState<string | null>(null);
  const [durationSelectionError, setDurationSelectionError] = useState<string | null>(null);

  // Booking workflow state - use local state for Steps 1-4, Redux only populated after Step 4 API call
  const [currentStep, setCurrentStep] = useState(1);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null);
  const [selectedBins, setSelectedBins] = useState<number>(0);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [climateControl, setClimateControl] = useState<boolean>(false);
  const [protectionPlan, setProtectionPlan] = useState<ProtectionPlan | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [country, setCountry] = useState<string>("US");
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");

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
      key === "summer"
        ? b.bundle_name.toLowerCase().includes("summer")
        : key === "ski"
        ? b.bundle_name.toLowerCase().includes("ski")
        : b.id === key
    );
    return bundle;
  };


  // Set prepaid plan as default when pricing data loads
  useEffect(() => {
    if (pricingData && !plan && prepaidPlan) {
      setPlan(prepaidPlan);
    }
  }, [pricingData, plan, prepaidPlan]);

  // Fetch profile when authenticated (after auth hydrated) so delivery step can pre-fill from profile
  useEffect(() => {
    if (authHydrated && isAuthenticated) {
      dispatch(fetchProfileIfNeeded());
    }
  }, [authHydrated, isAuthenticated, dispatch]);

  // Reset pre-fill flag when profile is cleared (e.g. logout)
  useEffect(() => {
    if (!profile) hasInitializedContactFromProfile.current = false;
  }, [profile]);

  // Pre-fill contact fields from profile store once when profile is available
  useEffect(() => {
    if (!profile || hasInitializedContactFromProfile.current) return;
    hasInitializedContactFromProfile.current = true;
    if (profile.fullName) setFullName(profile.fullName);
    if (profile.email) setEmail(profile.email);
    if (profile.phoneNumber) setPhone(profile.phoneNumber);
    else if (profile.mobilePhoneNumber) setPhone(profile.mobilePhoneNumber);
  }, [profile]);

  // Handler functions - update local state only (no Redux updates)
  const handleSetPlan = (newPlan: Plan | null) => {
    setPlan(newPlan);
    if (newPlan) {
      setPlanSelectionError(null);
    }
    // Reset custom plan flag when plan changes
    if (newPlan) {
      setIsCustomPlanSelected(false);
    }
  };

  const handleSetSelectedMonths = (months: number | null) => {
    setSelectedMonths(months);
    if (months !== null && months !== undefined) {
      setDurationSelectionError(null);
    }
  };

  const handleSetSelectedBins = (bins: number) => {
    setSelectedBins(bins);
  };

  const handleToggleAddon = (addon: Addon) => {
    // Toggle addon in local state
    const index = selectedAddons.findIndex(a => 
      (a.id && addon.id && a.id === addon.id) ||
      (!a.id && !addon.id && a.name === addon.name)
    );
    if (index === -1) {
      setSelectedAddons([...selectedAddons, addon]);
    } else {
      setSelectedAddons(selectedAddons.filter((_, i) => i !== index));
    }
  };

  const handleSetClimateControl = (value: boolean) => {
    setClimateControl(value);
  };

  const handleSetProtectionPlan = (planKey: string) => {
    // Find the protection plan object from pricing data
    const planData = pricingData?.protection_plans.find((p) =>
      planKey === "basic"
        ? p.name.toLowerCase().includes("basic")
        : planKey === "enhanced"
        ? p.name.toLowerCase().includes("enhanced")
        : planKey === "premium"
        ? p.name.toLowerCase().includes("premium")
        : p.name.toLowerCase().includes(planKey)
    );
    setProtectionPlan(planData || null);
  };

  const handleSetFullName = (name: string) => {
    setFullName(name);
  };

  const handleSetEmail = (emailValue: string) => {
    setEmail(emailValue);
  };

  const handleSetPhone = (phoneValue: string) => {
    setPhone(phoneValue);
  };

  const handleSetDeliveryAddress = (address: string) => {
    setDeliveryAddress(address);
  };

  const handleSetCity = (cityValue: string) => {
    setCity(cityValue);
  };

  const handleSetState = (stateValue: string) => {
    setState(stateValue);
  };

  const handleSetZipCode = (zipCodeValue: string) => {
    setZipCode(zipCodeValue);
  };

  const handleSetCountry = (countryValue: string) => {
    setCountry(countryValue);
  };

  const handleSetDeliveryNotes = (notes: string) => {
    setDeliveryNotes(notes);
  };

  const handleWarehouseSelect = (warehouseId: string) => {
    const options = locationData?.nearestWarehouseOptions || [];
    const selected = options.find((option) => option.id === warehouseId);
    if (!selected) return;

    dispatch(
      updateLocationData({
        nearestWarehouse: {
          id: selected.id,
          name: selected.name,
        },
        distanceMiles: selected.distanceMiles,
        deliveryCharge: selected.deliveryCharge,
        distanceChargeSource: "warehouse_distance_charges",
      })
    );
  };

  const getServiceabilityMessage = useMemo(() => {
    if (!locationData?.reasonCode) return null;
    if (locationData.reasonCode === "GEOCODE_FAILED") {
      return "We could not validate this address. Please review and try again.";
    }
    if (locationData.reasonCode === "OUT_OF_SERVICE_AREA") {
      return "This address is currently outside our service area.";
    }
    if (locationData.reasonCode === "NO_ACTIVE_WAREHOUSE") {
      return "Delivery is temporarily unavailable because no active warehouse is configured.";
    }
    return locationData.reason || "Delivery validation failed for this address.";
  }, [locationData]);

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
    setBundleSelectionError(null);
    const bundle = getBundleByKey(type);
    if (bundle) {
      // Bundle selected - set bundle data but don't navigate yet
      // User must also select a plan before proceeding
      setSelectedBundle(bundle);
      handleSetSelectedMonths(bundle.months);
      // Extract bins from bundle description or use defaults
      const bins = bundle.bundle_name.toLowerCase().includes("ski") ? 2 : 5;
      handleSetSelectedBins(bins);
      setIsCustomPlanSelected(false);
    } else if (type === "custom") {
      // Custom plan selected - clear bundle and reset duration/bins
      setSelectedBundle(null);
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
        } else if (
          plan.discount_type === "fixed" ||
          plan.discount_type === "amount"
        ) {
          // Apply fixed amount discount
          bundlePrice = Math.max(0, bundlePrice - plan.discount_value);
        }
      }

      total = bundlePrice;

      // Climate control (+20% on storage cost)
      if (climateControl && selectedBins > 0 && selectedMonths) {
        const storageCost =
          selectedBins * selectedMonths * (prepaidPlan?.perBinPrice || 7.5);
        const climateAddon = pricingData.addons.find(
          (a) => a.name === "Climate-Controlled Storage"
        );
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
      const climateAddon = pricingData.addons.find(
        (a) => a.name === "Climate-Controlled Storage"
      );
      if (climateAddon) {
        const storageCost =
          selectedBins > 0 && selectedMonths
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
    if (locationData?.matchedZone) {
      total += locationData.matchedZone.price;
    } else if (locationData?.deliveryCharge && typeof locationData.deliveryCharge === 'number') {
      const region = locationData.nearestStore?.region?.toLowerCase();
      const charge = locationData.deliveryCharge;
      // Convert rupees to USD if region is India (1 USD ≈ 83 INR)
      total += region === 'india' ? charge / 83 : charge;
    }

    return total;
  };

  // Calculate pricing breakdown from local state
  const calculatePricingBreakdown = () => {
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

    // If bundle is selected
    if (selectedBundle) {
      let bundlePrice = selectedBundle.price || 0;

      // Apply plan discount if plan is selected and has discount
      if (plan && plan.hasDiscount && plan.discount_value > 0) {
        if (plan.discount_type === "percentage") {
          const discountAmount = (bundlePrice * plan.discount_value) / 100;
          bundlePrice = bundlePrice - discountAmount;
          savings = discountAmount;
        } else if (
          plan.discount_type === "fixed" ||
          plan.discount_type === "amount"
        ) {
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

        // Calculate savings (prepaid vs monthly) - this is the difference between monthly and prepaid plans
        const isPrepaid = plan.plan_name.toLowerCase().includes("prepaid");
        if (isPrepaid && monthToMonthPlan) {
          const monthlyPricing = monthToMonthPlan.pricing[monthsStr]?.[binsStr];
          if (monthlyPricing) {
            const monthlyTotal =
              monthlyPricing.base + monthlyPricing.deliveryFee;
            const prepaidTotal = pricing.base + pricing.deliveryFee;
            savings = Math.max(0, monthlyTotal - prepaidTotal);
          }
        }
      }
    }

    // Climate control cost
    if (climateControl && (selectedBins > 0 || selectedAddons.length > 0)) {
      const climateAddon = pricingData.addons.find(
        (a) => a.name === "Climate-Controlled Storage"
      );
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
    selectedAddons.forEach((addon) => {
      if (addon.recurrence === "monthly" && selectedMonths) {
        if (addon.chargeType === "percent") {
          // For percent-based monthly addons: calculate percentage of monthly storage cost
          // Based on API response: Bicycle 12% should result in $72 for 6 months ($12/month)
          // Current calculation: $75 × 12% × 6 = $54 (doesn't match API's $72)
          // 
          // Possible server calculation methods:
          // 1. Percentage of total storage cost, that amount is monthly: $450 × 12% = $54/month (too high)
          // 2. Percentage of monthly storage with different base or multiplier
          // 3. Server may recalculate differently
          //
          // Using: percentage of monthly storage cost × months (standard calculation)
          // Server may adjust this, but we send our calculated value
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
          const totalStorageCost = baseStorageCost;
          addonsCost += totalStorageCost * (addon.amount / 100);
        } else {
          addonsCost += addon.amount;
        }
      }
      addonsDeliveryCost += addon.reDeliveryFee;
    });

    // Protection plan cost
    if (protectionPlan && selectedMonths) {
      protectionPlanCost = protectionPlan.price * selectedMonths;
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
  };

  // Note: No Redux updates during booking steps - only populate Redux after Step 4 API call

  // Extract cart save logic to be reusable after authentication
  const proceedWithCartSave = async () => {
    if (!pricingData) {
      return;
    }

    setIsSavingCart(true);
    try {
      // Calculate pricing breakdown from local state
      const pricingBreakdown = calculatePricingBreakdown();
      
      // Calculate total including delivery charge
      let calculatedTotal = 
        pricingBreakdown.baseStorageCost +
        pricingBreakdown.redeliveryFee +
        pricingBreakdown.climateControlCost +
        pricingBreakdown.addonsCost +
        pricingBreakdown.addonsDeliveryCost +
        pricingBreakdown.protectionPlanCost;

      // Add delivery zone/charge
      if (locationData?.matchedZone) {
        calculatedTotal += locationData.matchedZone.price;
      } else if (locationData?.deliveryCharge && typeof locationData.deliveryCharge === 'number') {
        const charge = locationData.deliveryCharge;
        // Convert rupees to USD if region is India (1 USD ≈ 83 INR)
        calculatedTotal += charge;
      } else if (locationData?.isServiceable === false || locationData?.deliveryCharge === "out_of_area") {
        setStepError(getServiceabilityMessage || "This address is currently outside our service area.");
        return;
      }

      // Build cart payload from local state with calculated pricing
      const localCart: BookingCart = {
        total: calculatedTotal,
        baseStorageCost: pricingBreakdown.baseStorageCost,
        redeliveryFee: pricingBreakdown.redeliveryFee,
        climateControlCost: pricingBreakdown.climateControlCost,
        addonsCost: pricingBreakdown.addonsCost,
        addonsDeliveryCost: pricingBreakdown.addonsDeliveryCost,
        protectionPlanCost: pricingBreakdown.protectionPlanCost,
        savings: pricingBreakdown.savings,
        plan,
        bundles: selectedBundle,
        addons: selectedAddons,
        protectionPlan,
        durationBins: {
          months: selectedMonths,
          bins: selectedBins,
        },
        climateControl,
        deliveryInfo: {
          fullName,
          email,
          phone,
          deliveryAddress,
          city,
          state,
          zipCode,
          deliveryNotes,
        },
        locationData,
        zoneDeliveryCharges: locationData?.deliveryCharge as number | null,
        warehouseId: locationData?.nearestWarehouse?.id || null,
        couponCode: null,
      };

      // Transform local cart to API payload format
      const cartPayload = transformBookingCartToAddCartItemDto(localCart);
      
      // Call API to add/update cart item
      const cartDto = await addCartItem(cartPayload);

      // Transform API response back to BookingCart format
      const updatedCart = transformCartDtoToBookingCart(
        cartDto,
        pricingData.plans || [],
        pricingData.bundles || [],
        pricingData.addons || [],
        pricingData.protection_plans || []
      );

      // Preserve locationData from local state (not returned by API)
      updatedCart.locationData = locationData;
      // Preserve deliveryNotes (not in API response)
      updatedCart.deliveryInfo.deliveryNotes = deliveryNotes;
      
      // Note: updatedCart.cartItemId will be set from the API response (the newly added item)

      // Update Redux store with server-calculated cart data (only now, after Step 4)
      dispatch(initializeCart(updatedCart));
      
      toast.success("Cart saved successfully!");
      
      // Proceed to next step (Summary)
      setCurrentStep((prev) => prev + 1);
    } catch (error: unknown) {
      const errorMessage = 
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
        (error as { message?: string })?.message || 
        "Failed to save cart";
      toast.error(errorMessage);
      // Don't proceed to next step if API call fails
    } finally {
      setIsSavingCart(false);
    }
  };

  const validateStepAndNext = async () => {
    setStepError(null);
    setPlanSelectionError(null);
    setBundleSelectionError(null);
    setDurationSelectionError(null);
    // Step 1 validation: Must select a plan AND (bundle OR custom plan)
    if (currentStep === 1) {
      if (!plan) {
        setPlanSelectionError("Please select a payment plan.");
        return;
      }
      if (!selectedBundle && !isCustomPlanSelected) {
        setBundleSelectionError("Please choose a bundle offer or custom plan.");
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
        setDurationSelectionError("Please select a storage duration.");
        return;
      }
      // Duration is selected, allow proceeding (bins can be 0 for bulky items)
    }
    // Step 4 validation: Must fill all required delivery information fields
    if (currentStep === 4) {
      if (!fullName || fullName.trim() === "") {
        setStepError("Please enter your full name.");
        return;
      }
      if (!email || email.trim() === "") {
        setStepError("Please enter your email address.");
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setStepError("Please enter a valid email address.");
        return;
      }
      if (!phone || phone.trim() === "") {
        setStepError("Please enter your phone number.");
        return;
      }
      if (!deliveryAddress || deliveryAddress.trim() === "") {
        setStepError("Please enter your delivery address.");
        return;
      }
      if (!city || city.trim() === "") {
        setStepError("Please enter your city.");
        return;
      }
      if (!state || state.trim() === "") {
        setStepError("Please enter your state.");
        return;
      }
      if (!zipCode || zipCode.trim() === "") {
        setStepError("Please enter your ZIP code.");
        return;
      }
      if (locationData?.isServiceable === false || locationData?.deliveryCharge === "out_of_area") {
        setStepError(getServiceabilityMessage || "This address is currently outside our service area.");
        return;
      }

      // Check authentication before proceeding to API call
      if (!isAuthenticated) {
        // Set flag to continue after login
        pendingStepProgressionRef.current = true;
        // Open login popup
        openAuthPopup();
        toast("Please sign in to continue", {
          icon: "ℹ️",
          duration: 4000,
        });
        return;
      }

      // After validation passes, call Add Item to Cart API
      // This will save the cart and get server-calculated pricing
      await proceedWithCartSave();
      return; // Don't proceed to next step here, proceedWithCartSave handles it
    }
    // Default: go to next step
    setCurrentStep((prev) => prev + 1);
  };

  // Redirect to payment after successful login (for complete booking)
  useEffect(() => {
    if (isAuthenticated && pendingBookingRef.current) {
      pendingBookingRef.current = false;
      // User just logged in, redirect to payment page
      router.push("/payment");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Continue to next step after successful login (for step progression)
  useEffect(() => {
    if (isAuthenticated && pendingStepProgressionRef.current && currentStep === 4) {
      pendingStepProgressionRef.current = false;
      // User just logged in, continue with the API call and step progression
      // We'll use a small delay to ensure auth state is fully updated
      setTimeout(() => {
        proceedWithCartSave();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentStep]);

  useEffect(() => {
    if (stepError) {
      setStepError(null);
    }
    if (planSelectionError) {
      setPlanSelectionError(null);
    }
    if (bundleSelectionError) {
      setBundleSelectionError(null);
    }
    if (durationSelectionError) {
      setDurationSelectionError(null);
    }
    // Clear stale inline errors when user changes relevant inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, fullName, email, phone, deliveryAddress, city, state, zipCode, selectedMonths, plan, selectedBundle, isCustomPlanSelected]);

  // Resolve delivery charge from Step 4 typed address.
  useEffect(() => {
    const addressLine = deliveryAddress.trim();
    const cityValue = city.trim();
    const stateValue = state.trim();
    const zipValue = zipCode.trim();

    if (!addressLine || !cityValue || !stateValue || !zipValue) {
      setIsResolvingDeliveryPricing(false);
      dispatch(
        updateLocationData({
          nearestWarehouse: null,
          nearestWarehouseOptions: [],
          distanceMiles: null,
          deliveryCharge: null,
          distanceChargeSource: null,
        })
      );
      return;
    }

    setIsResolvingDeliveryPricing(true);
    dispatch(
      updateLocationData({
        nearestWarehouse: null,
        nearestWarehouseOptions: [],
        distanceMiles: null,
        deliveryCharge: null,
        distanceChargeSource: null,
      })
    );

    const timeoutId = setTimeout(() => {
      const requestId = addressPricingRequestIdRef.current + 1;
      addressPricingRequestIdRef.current = requestId;

      (async () => {
        try {
          const resolution = await resolveDeliveryFee({
            address: {
              streetAddress1: addressLine,
              city: cityValue,
              state: stateValue,
              zipCode: zipValue,
              country: country || "US",
            },
          });
          if (requestId !== addressPricingRequestIdRef.current) return;

          const prioritizedOptions = Array.isArray(resolution.warehouseOptions)
            ? resolution.warehouseOptions
            : [];
          const primaryOption = prioritizedOptions.length > 0
            ? prioritizedOptions[0]
            : (resolution.warehouseId && resolution.warehouseName && typeof resolution.distanceMiles === "number"
                ? {
                    warehouseId: resolution.warehouseId,
                    warehouseName: resolution.warehouseName,
                    distanceMiles: resolution.distanceMiles,
                    fee: typeof resolution.fee === "number" ? resolution.fee : NaN,
                  }
                : null);
          const resolvedFee =
            primaryOption && typeof primaryOption.fee === "number" && Number.isFinite(primaryOption.fee)
              ? primaryOption.fee
              : null;

          dispatch(
            setLocationData({
              latitude: null,
              longitude: null,
              addressDetails: {
                street: addressLine,
                city: cityValue,
                state: stateValue,
                postalCode: zipValue,
                country: country || "US",
                fullAddress: `${addressLine}, ${cityValue}, ${stateValue} ${zipValue}`,
              },
              nearestWarehouse: primaryOption
                ? {
                    id: primaryOption.warehouseId,
                    name: primaryOption.warehouseName || "Warehouse",
                  }
                : null,
              nearestWarehouseOptions: prioritizedOptions.length > 0
                ? prioritizedOptions.map((option) => ({
                    id: option.warehouseId,
                    name: option.warehouseName,
                    distanceMiles: option.distanceMiles,
                    deliveryCharge:
                      resolution.isServiceable && typeof option.fee === "number"
                        ? option.fee
                        : "out_of_area",
                  }))
                : [],
              distanceMiles: primaryOption?.distanceMiles ?? null,
              distanceChargeSource: "warehouse_distance_charges",
              nearestStore: null,
              distanceKm: null,
              deliveryCharge:
                resolution.isServiceable && typeof resolvedFee === "number"
                  ? resolvedFee
                  : "out_of_area",
              isServiceable: resolution.isServiceable,
              reasonCode: resolution.reasonCode ?? null,
              reason: resolution.reason ?? null,
              matchedZone: null,
            })
          );
        } catch {
          if (requestId !== addressPricingRequestIdRef.current) return;
          dispatch(
            updateLocationData({
              nearestWarehouse: null,
              nearestWarehouseOptions: [],
              distanceMiles: null,
              deliveryCharge: "out_of_area",
              distanceChargeSource: "warehouse_distance_charges",
              isServiceable: false,
              reasonCode: "GEOCODE_FAILED",
              reason: "Could not validate this address for delivery pricing.",
            })
          );
        } finally {
          setIsResolvingDeliveryPricing(false);
        }
      })();
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [deliveryAddress, city, state, zipCode, country, dispatch]);

  const onCompleteBooking = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show login popup
      pendingBookingRef.current = true;
      openAuthPopup();
      toast("Please sign in to complete your booking", {
        icon: "ℹ️",
        duration: 4000,
      });
      return;
    }

    // Check if cart is saved (should be saved after Step 4)
    if (!cart.cartId) {
      toast.error("Please complete all steps before booking");
      return;
    }

    try {
      setIsCompletingBooking(true);

      // Redirect to payment page with cart ID and newly added cartItemId
      // The cartItemId from Redux cart is the newly added item from the current booking flow
      const paymentUrl = cart.cartItemId 
        ? `/payment/${cart.cartId}?cartItemId=${cart.cartItemId}`
        : `/payment/${cart.cartId}`;
      router.push(paymentUrl);
    } catch (error: unknown) {
      const errorMessage = 
        (error as { message?: string })?.message || 
        "Failed to complete booking";
      toast.error(errorMessage);
      setIsCompletingBooking(false);
    }
  };

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
          <p className="text-gray-600">
            {error || "Pricing data is not available"}
          </p>
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
        height="compact"
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
                    className={`flex flex-col items-center shrink-0 transition-all duration-300 ${
                      ALLOW_STEP_CLICK_NAVIGATION ? "cursor-pointer hover:scale-105" : "cursor-default"
                    }`}
                    onClick={() => {
                      if (!ALLOW_STEP_CLICK_NAVIGATION) return;
                      // Handle step navigation with bundle logic
                      if (selectedBundle) {
                        // If bundle is selected, skip steps 2 and 3
                        if (num === 2 || num === 3) {
                          return; // Disable clicking on skipped steps
                        }
                      }
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
                planError={planSelectionError}
                bundleError={bundleSelectionError}
                selectedBundle={
                  selectedBundle
                    ? selectedBundle.bundle_name
                        .toLowerCase()
                        .includes("summer")
                      ? "summer"
                      : selectedBundle.bundle_name.toLowerCase().includes("ski")
                      ? "ski"
                      : selectedBundle.id
                    : isCustomPlanSelected
                    ? "custom"
                    : null
                }
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
                durationError={durationSelectionError}
              />
            )}
            {/* Step 3: Add-ons */}
            {currentStep === 3 && (
              <AddonsStep
                addons={pricingData?.addons || []}
                selectedAddons={selectedAddons.map((a) =>
                  a.id || a.name.toLowerCase().replace(/\s+/g, "")
                )}
                toggleAddon={handleToggleAddon}
                climateControl={climateControl}
                setClimateControl={handleSetClimateControl}
                getDeliveryFeePerItem={getDeliveryFeePerItem}
                protectionPlans={pricingData?.protection_plans || []}
                protectionPlan={
                  protectionPlan
                    ? protectionPlan.name.toLowerCase().includes("basic")
                      ? "basic"
                      : protectionPlan.name.toLowerCase().includes("enhanced")
                      ? "enhanced"
                      : protectionPlan.name.toLowerCase().includes("premium")
                      ? "premium"
                      : "basic"
                    : "basic"
                }
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
                country={country}
                setCountry={handleSetCountry}
                isResolvingDeliveryPricing={isResolvingDeliveryPricing}
                onWarehouseSelect={handleWarehouseSelect}
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
                selectedAddons={selectedAddons.map((a) =>
                  a.id || a.name.toLowerCase().replace(/\s+/g, "")
                )}
                climateControl={climateControl}
                addons={pricingData?.addons || []}
                calculateBookingTotal={calculateBookingTotal}
                selectedBundle={selectedBundle}
                bundles={pricingData?.bundles || []}
                protectionPlan={
                  protectionPlan
                    ? protectionPlan.name.toLowerCase().includes("basic")
                      ? "basic"
                      : protectionPlan.name.toLowerCase().includes("enhanced")
                      ? "enhanced"
                      : protectionPlan.name.toLowerCase().includes("premium")
                      ? "premium"
                      : "basic"
                    : "basic"
                }
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
            {stepError && (
              <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {stepError}
              </div>
            )}
            <div className="flex justify-between mt-8 pt-8">
              {currentStep > 1 && currentStep < 5 && (
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
                  onClick={validateStepAndNext}
                  disabled={isSavingCart}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-[#f8992f] to-[#e8911f] text-white rounded-full font-semibold hover:shadow-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSavingCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    "Next Step"
                  )}
                </button>
              )}
              {currentStep === 5 && (
                <button
                  onClick={onCompleteBooking}
                  disabled={isCompletingBooking}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-[#f8992f] to-[#e8911f] text-white rounded-full font-semibold hover:shadow-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCompletingBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    "Complete Booking"
                  )}
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
