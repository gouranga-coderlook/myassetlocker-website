"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setProfilePhoneCountryCode } from "@/store/slices/profileSlice";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  validatePhoneNumber,
  detectCountryFromLocation,
  getAllCountries,
  getCountryInfo,
  type CountryCode,
} from "@/lib/utils/phoneValidation";
import { findAddress, type AddressSuggestion } from "@/lib/api/addressService";
import Input from "@/components/ui/Input";

interface DeliveryInformationStepProps {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  deliveryNotes: string;
  setDeliveryNotes: (notes: string) => void;
  country: string;
  setCountry: (country: string) => void;
  isResolvingDeliveryPricing: boolean;
  onWarehouseSelect: (warehouseId: string) => void;
}

interface DeliveryInformationFormValues {
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function DeliveryInformationStep({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  deliveryAddress,
  setDeliveryAddress,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode,
  deliveryNotes,
  setDeliveryNotes,
  country,
  setCountry,
  isResolvingDeliveryPricing,
  onWarehouseSelect,
}: DeliveryInformationStepProps) {
  const dispatch = useAppDispatch();
  // Fetch location data to auto-fill address fields if available
  const locationData = useAppSelector((storeState) => storeState.cart.locationData);
  // Full name, phone country code, and national phone number from profile store
  const profile = useAppSelector((storeState) => storeState.profile.profileData);
  const profilePhoneCountryCode = profile?.phoneCountryCode;
  const initializedFromProfileRef = useRef(false);
  const {
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<DeliveryInformationFormValues>({
    defaultValues: {
      fullName: fullName || "",
      email: email || "",
      phone: phone || "",
      deliveryAddress: deliveryAddress || "",
      city: city || "",
      state: state || "",
      zipCode: zipCode || "",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  
  // Phone validation state
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  
  // Address autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserEditedAddressRef = useRef(false);
  
  // Detect country from location data (initial/default)
  const defaultCountry = useMemo(() => {
    return detectCountryFromLocation(locationData);
  }, [locationData]);
  
  // Resolve initial country: profile store (from mobile number) if valid, else location-based default
  const resolvedDefaultCountry = useMemo(() => {
    if (profilePhoneCountryCode) {
      const info = getCountryInfo(profilePhoneCountryCode as CountryCode);
      if (info.code !== "UNKNOWN") return info.code as CountryCode;
    }
    return defaultCountry;
  }, [profilePhoneCountryCode, defaultCountry]);
  
  // Selected country (user can change this); initialize from profile store or default
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(resolvedDefaultCountry);
  
  // Sync selected country from profile store when profile has phoneCountryCode (from mobile number)
  useEffect(() => {
    if (profilePhoneCountryCode) {
      const info = getCountryInfo(profilePhoneCountryCode as CountryCode);
      if (info.code !== "UNKNOWN") setSelectedCountry(info.code as CountryCode);
    } else if (defaultCountry && !phoneTouched) {
      setSelectedCountry(defaultCountry);
    }
  }, [profilePhoneCountryCode, defaultCountry, phoneTouched]);
  
  // Get all countries for dropdown
  const allCountries = useMemo(() => {
    return getAllCountries().sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  
  // Get country info for selected country
  const countryInfo = useMemo(() => {
    return getCountryInfo(selectedCountry);
  }, [selectedCountry]);
  
  // Get phone placeholder and hint based on selected country
  const phonePlaceholder = useMemo(() => {
    return countryInfo.placeholder;
  }, [countryInfo]);
  
  const phoneFormatHint = useMemo(() => {
    return countryInfo.hint;
  }, [countryInfo]);
  
  const countryName = useMemo(() => {
    return countryInfo.name;
  }, [countryInfo]);
  
  // Auto-fill address fields from location data if available (only once)
  useEffect(() => {
    if (hasUserEditedAddressRef.current) {
      return;
    }

    if (locationData?.addressDetails && !deliveryAddress && !city && !state && !zipCode) {
      const address = locationData.addressDetails;
      if (address.street && address.street !== 'Not available') {
        setDeliveryAddress(address.street);
      }
      if (address.city && address.city !== 'Not available') {
        setCity(address.city);
      }
      if (address.state && address.state !== 'Not available') {
        setState(address.state);
      }
      if (address.postalCode && address.postalCode !== 'Not available') {
        setZipCode(address.postalCode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationData]);
  

  useEffect(() => {
    if (initializedFromProfileRef.current) return;
    if (!profile) return;

    if (!fullName && profile.fullName) {
      setFullName(profile.fullName);
      setValue("fullName", profile.fullName, { shouldValidate: true });
    }
    if (!phone && profile.phoneNumber) {
      setPhone(profile.phoneNumber);
      setValue("phone", profile.phoneNumber, { shouldValidate: true });
    }
    initializedFromProfileRef.current = true;
  }, [profile, fullName, phone, setFullName, setPhone, setValue]);

  useEffect(() => {
    setValue("fullName", fullName || "", { shouldValidate: true });
    setValue("email", email || "", { shouldValidate: true });
    setValue("phone", phone || "", { shouldValidate: true });
    setValue("deliveryAddress", deliveryAddress || "", { shouldValidate: true });
    setValue("city", city || "", { shouldValidate: true });
    setValue("state", state || "", { shouldValidate: true });
    setValue("zipCode", zipCode || "", { shouldValidate: true });
  }, [fullName, email, phone, deliveryAddress, city, state, zipCode, setValue]);

  // Address autocomplete search function with debouncing
  const searchAddresses = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearchingAddress(true);
    try {
      const suggestions = await findAddress({
        partialStreet: query,
        cityFilter: city || undefined,
        stateFilter: state || undefined,
        pcFilter: zipCode || undefined,
        countryFilter: countryName || undefined,
      });
      setAddressSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error("Error searching addresses:", error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearchingAddress(false);
    }
  }, [city, state, zipCode, countryName]);

  // Handle street address input change with debounced search
  const handleAddressInputChange = (value: string) => {
    hasUserEditedAddressRef.current = true;
    setDeliveryAddress(value);
    setValue("deliveryAddress", value, { shouldValidate: true, shouldDirty: true });

    // When street address is blank, clear dependent address fields (industry standard)
    if (!value.trim()) {
      setCity('');
      setValue("city", "", { shouldValidate: true, shouldDirty: true });
      setState('');
      setValue("state", "", { shouldValidate: true, shouldDirty: true });
      setZipCode('');
      setValue("zipCode", "", { shouldValidate: true, shouldDirty: true });
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce address search
    searchTimeoutRef.current = setTimeout(() => {
      searchAddresses(value);
    }, 300);
  };

  // Ensure select-all + Backspace/Delete reliably clears address across browsers.
  const handleAddressKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace" && event.key !== "Delete") {
      return;
    }

    const inputEl = addressInputRef.current;
    if (!inputEl || !inputEl.value) {
      return;
    }

    const selectionStart = inputEl.selectionStart ?? 0;
    const selectionEnd = inputEl.selectionEnd ?? 0;
    const hasFullSelection = selectionStart === 0 && selectionEnd === inputEl.value.length;
    if (!hasFullSelection) {
      return;
    }

    event.preventDefault();
    handleAddressInputChange("");
  };

  // Handle address suggestion selection
  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    // Populate all address fields from selected suggestion
    if (suggestion.street) {
      setDeliveryAddress(suggestion.street);
      setValue("deliveryAddress", suggestion.street, { shouldValidate: true, shouldDirty: true });
    }
    if (suggestion.city) {
      setCity(suggestion.city);
      setValue("city", suggestion.city, { shouldValidate: true, shouldDirty: true });
    }
    if (suggestion.state) {
      setState(suggestion.state);
      setValue("state", suggestion.state, { shouldValidate: true, shouldDirty: true });
    }
    if (suggestion.postalCode) {
      setZipCode(suggestion.postalCode);
      setValue("zipCode", suggestion.postalCode, { shouldValidate: true, shouldDirty: true });
    }
    if (suggestion.country) {
      setCountry(suggestion.country);
      setValue("country", suggestion.country, { shouldValidate: true, shouldDirty: true });
    }
    // Close suggestions dropdown
    setShowSuggestions(false);
    setAddressSuggestions([]);
    
    // Focus back on input
    if (addressInputRef.current) {
      addressInputRef.current.focus();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle phone number input with validation and formatting
  const handlePhoneChange = (value: string) => {
    // Get max length for current country
    const maxDigits = countryInfo.maxLength;
    
    // Extract digits only to check length
    const digits = value.replace(/\D/g, "");
    
    // Prevent entering more digits than maxLength
    if (digits.length > maxDigits) {
      // Truncate to max length
      const truncated = digits.slice(0, maxDigits);
      // Reformat with truncated digits
      const validation = validatePhoneNumber(truncated, locationData, { country: selectedCountry });
      setPhone(validation.formatted);
      setValue("phone", validation.formatted, { shouldValidate: true, shouldDirty: true });
      return;
    }
    
    // Validate and format phone number with selected country
    const validation = validatePhoneNumber(value, locationData, { country: selectedCountry });
    
    // Update phone state with formatted value
    setPhone(validation.formatted);
    setValue("phone", validation.formatted, { shouldValidate: true, shouldDirty: true });
    
    // Clear error if phone is empty
    if (!validation.formatted.trim()) {
      setPhoneError(null);
      return;
    }
    
    // Set error if validation fails and field has been touched
    if (phoneTouched) {
      setPhoneError(validation.errorMessage);
    }
  };
  
  // Handle phone blur - mark as touched and validate (use displayed value so profile.phoneNumber is validated)
  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    const validation = validatePhoneNumber(phone, locationData, { country: selectedCountry });
    setPhoneError(validation.errorMessage);
    trigger("phone");
  };
  
  // Handle country change: update local state and persist to profile store
  const handleCountryChange = (newCountry: CountryCode) => {
    setSelectedCountry(newCountry);
    setPhoneTouched(true);
    dispatch(setProfilePhoneCountryCode(newCountry));
    
    // Reformat existing phone number with new country
    if (phone) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length > 0) {
        // Get new country info
        const newCountryInfo = getCountryInfo(newCountry);
        // Truncate if exceeds new max length
        const truncatedDigits = digits.slice(0, newCountryInfo.maxLength);
        const validation = validatePhoneNumber(truncatedDigits, locationData, { country: newCountry });
        setPhone(validation.formatted);
        setValue("phone", validation.formatted, { shouldValidate: true, shouldDirty: true });
        setPhoneError(validation.errorMessage);
      }
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Delivery & Contact Information
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Please provide your contact details and delivery address
      </p>

      {/* Contact Details */}
      <div className="mb-6 bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📞 Contact Details</h3>
        <p className="text-sm text-gray-600 mb-4">
          We&apos;ll send your confirmation and moving details here
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            label="👤 Full Name"
            {...register("fullName", {
              required: "Full name is required.",
              validate: (value) => value.trim().length > 0 || "Full name is required.",
            })}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setValue("fullName", e.target.value, { shouldValidate: true, shouldDirty: true });
            }}
            placeholder="Jane Doe"
            required
            error={errors.fullName?.message}
          />
          <Input
            type="email"
            label="✉️ Email Address"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address.",
              },
            })}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setValue("email", e.target.value, { shouldValidate: true, shouldDirty: true });
            }}
            placeholder="your@email.com"
            required
            error={errors.email?.message}
          />
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>📱</span> Phone Number *
            </label>
            {!phone && (
              <p className="mt-1 text-xs text-gray-500 mb-2">
                {phoneFormatHint}
              </p>
            )}
            {/* Combined Country Selector and Phone Input */}
            <div className="relative flex items-center border-2 border-gray-200 rounded-lg focus-within:ring-1 focus-within:ring-transparent focus-within:border-[#f8992f] transition">
              {/* Country Flag Button with Dropdown */}
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value as CountryCode)}
                  className="country-code-select pl-10 pr-6 py-3 appearance-none bg-transparent border-0 focus:outline-none cursor-pointer text-transparent hover:text-transparent transition"
                  title={`+${countryInfo.dialCode}`}
                  style={{ width: '80px', color: 'transparent', borderRadius: '10px' }}
                >
                  {allCountries.map((country) => (
                    <option key={country.code} value={country.code} className="bg-white text-gray-700">
                      +{country.dialCode} ({country.code})
                    </option>
                  ))}
                </select>
                {/* Display country dial code when closed (e.g. +1, +91) so phone shows with country code */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-sm font-semibold text-gray-700">
                  +{countryInfo.dialCode}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {/* Divider */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300"></div>
              </div>
              
              {/* Phone Input - show national number from profile.phoneNumber when prop empty */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={handlePhoneBlur}
                placeholder={phonePlaceholder}
                required
                maxLength={countryInfo.maxLength + 15}
                className="flex-1 px-4 py-3 border-0 focus:outline-none bg-transparent text-base rounded-lg"
                aria-invalid={phoneError && phoneTouched ? "true" : "false"}
                aria-describedby={phoneError && phoneTouched ? "phone-error" : undefined}
              />
            </div>
            <input
              type="hidden"
              {...register("phone", {
                required: "Phone number is required.",
                validate: (value) => {
                  if (!value.trim()) return "Phone number is required.";
                  const validation = validatePhoneNumber(value, locationData, { country: selectedCountry });
                  return validation.isValid || validation.errorMessage || "Please enter a valid phone number.";
                },
              })}
            />
            {phoneError && phoneTouched && (
              <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                {phoneError}
              </p>
            )}
            {!phoneError && errors.phone?.message && (
              <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.phone.message}
              </p>
            )}
            {!phoneError && phone && phoneTouched && (
              <p className="mt-1 text-xs text-green-600">
                ✓ Valid +{countryInfo.dialCode} phone number
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-6 bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📍 Delivery Address</h3>
        <p className="text-sm text-gray-600 mb-4">
          Where should we pick up your items?
        </p>
        <div className="space-y-4">
          <div className="relative">
            <div className="relative">
              <Input
                ref={addressInputRef}
                id="delivery-address"
                type="text"
                label="🏠 Street Address"
                value={deliveryAddress}
                onChange={(e) => handleAddressInputChange(e.target.value)}
                onKeyDown={handleAddressKeyDown}
                onFocus={() => {
                  if (addressSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="123 Main Street"
                required
                autoComplete="off"
                error={errors.deliveryAddress?.message}
              />
              <input
                type="hidden"
                {...register("deliveryAddress", {
                  required: "Street address is required.",
                  validate: (value) => value.trim().length > 0 || "Street address is required.",
                })}
              />
              {isSearchingAddress && (
                <div className="absolute right-3 top-[66%] transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#f8992f]"></div>
                </div>
              )}
              
              {/* Address Suggestions Dropdown */}
              {showSuggestions && addressSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {addressSuggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.fullAddress ?? `suggestion-${index}`}
                      type="button"
                      onClick={() => handleAddressSelect(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {suggestion.fullAddress || suggestion.street || 'Address'}
                      </div>
                      {(suggestion.city || suggestion.state || suggestion.postalCode) && (
                        <div className="text-sm text-gray-500 mt-1">
                          {[suggestion.city, suggestion.state, suggestion.postalCode]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              label="🏙️ City"
              {...register("city", {
                required: "City is required.",
                validate: (value) => value.trim().length > 0 || "City is required.",
              })}
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setValue("city", e.target.value, { shouldValidate: true, shouldDirty: true });
              }}
              placeholder="New York"
              required
              error={errors.city?.message}
            />
            <Input
              type="text"
              label="🗺️ State"
              {...register("state", {
                required: "State is required.",
              })}
              value={state}
              onChange={(e) => {
                const nextState = e.target.value.toUpperCase().slice(0, 2);
                setState(nextState);
                setValue("state", nextState, { shouldValidate: true, shouldDirty: true });
              }}
              placeholder="NY"
              required
              maxLength={2}
              className="uppercase"
              error={errors.state?.message}
            />
            <Input
              type="text"
              label="📮 ZIP Code"
              {...register("zipCode", {
                required: "ZIP code is required.",
                validate: (value) => value.trim().length > 0 || "ZIP code is required.",
              })}
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
                setValue("zipCode", e.target.value, { shouldValidate: true, shouldDirty: true });
              }}
              placeholder="10001"
              required
              maxLength={10}
              error={errors.zipCode?.message}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>📝</span> Special Instructions (Optional)
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => {
                setDeliveryNotes(e.target.value);
              }}
              placeholder="Any special delivery instructions or notes..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition resize-none"
            />
          </div>
        </div>
      </div>

      {isResolvingDeliveryPricing && (
        <div className="mb-6 bg-[#f9fafb] border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="h-4 w-56 bg-gray-200 rounded mb-3" />
          <div className="h-3 w-72 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-44 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-52 bg-gray-200 rounded" />
        </div>
      )}

      {deliveryAddress.trim().length > 0 &&
        locationData?.distanceChargeSource === "warehouse_distance_charges" &&
        !isResolvingDeliveryPricing && (
        <div
          className={`mb-6 border rounded-lg p-4 ${
            locationData.deliveryCharge === "out_of_area"
              ? "bg-[#fef2f2] border-red-200"
              : "bg-[#fff7ed] border-[#f8992f]/25"
          }`}
        >
          <h4 className="text-sm font-semibold text-[#4c4946] mb-1">Delivery Pricing (Auto-calculated)</h4>
          {(locationData.nearestWarehouseOptions?.length || 0) > 1 && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-[#4c4946] mb-1">
                Select warehouse
              </label>
              <select
                value={locationData.nearestWarehouse?.id || ""}
                onChange={(e) => onWarehouseSelect(e.target.value)}
                className="w-full md:w-[360px] border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                {locationData.nearestWarehouseOptions?.map((option: {
                  id: string;
                  name: string;
                  distanceMiles: number;
                  deliveryCharge: number | "out_of_area";
                  fee?: number;
                }) => (
                  <option key={option.id} value={option.id}>
                    {option.name} (
                    {typeof option.distanceMiles === "number"
                      ? `${option.distanceMiles.toFixed(2)} mi`
                      : "Distance N/A"}
                    {" - "}
                    {typeof option.fee === "number"
                      ? `$${option.fee.toFixed(2)}`
                      : typeof option.deliveryCharge === "number"
                      ? `$${option.deliveryCharge.toFixed(2)}`
                      : "Charge N/A"})
                  </option>
                ))}
              </select>
            </div>
          )}
          {locationData.deliveryCharge !== "out_of_area" && (
            <>
              <p className="text-sm text-[#6b7280]">
                Nearest warehouse: <span className="font-medium text-[#4c4946]">{locationData.nearestWarehouse?.name || "N/A"}</span>
              </p>
              {typeof locationData.distanceMiles === "number" && (
                <p className="text-sm text-[#6b7280]">
                  Distance: <span className="font-medium text-[#4c4946]">{locationData.distanceMiles.toFixed(2)} miles</span>
                </p>
              )}
            </>
          )}
          <p className="text-sm text-[#6b7280]">
            Applied charge:{" "}
            <span className="font-medium text-[#4c4946]">
              {locationData.deliveryCharge === "out_of_area"
                ? locationData.reasonCode === "GEOCODE_FAILED"
                  ? "Address validation failed"
                  : locationData.reasonCode === "NO_ACTIVE_WAREHOUSE"
                  ? "Temporarily unavailable"
                  : "Out of service area"
                : typeof locationData.deliveryCharge === "number"
                ? `$${locationData.deliveryCharge.toFixed(2)}`
                : "N/A"}
            </span>
          </p>
          {locationData.deliveryCharge === "out_of_area" && (
            <p className="mt-2 text-xs text-red-700">
              {locationData.reasonCode === "GEOCODE_FAILED"
                ? "We could not validate this address. Please correct the address fields."
                : locationData.reasonCode === "NO_ACTIVE_WAREHOUSE"
                ? "No active warehouse is currently available for delivery."
                : "This address is outside our current service area."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

