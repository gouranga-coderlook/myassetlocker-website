"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setProfilePhoneCountryCode } from "@/store/slices/profileSlice";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  validatePhoneNumber,
  detectCountryFromLocation,
  getAllCountries,
  getCountryInfo,
  type CountryCode,
} from "@/lib/utils/phoneValidation";
import { findAddress, type AddressSuggestion } from "@/lib/api/addressService";

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
}: DeliveryInformationStepProps) {
  const dispatch = useAppDispatch();
  // Fetch location data to auto-fill address fields if available
  const locationData = useAppSelector((storeState) => storeState.cart.locationData);
  // Full name, phone country code, and national phone number from profile store
  const profile = useAppSelector((storeState) => storeState.profile.profileData);
  const displayFullName = fullName || profile?.fullName || "";
  const profilePhoneCountryCode = profile?.phoneCountryCode;
  const displayPhone = phone || profile?.phoneNumber || "";
  
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
  
  // Note: No longer loading from Redux - using props from parent component (local state) only
  
  // Auto-fill address fields from location data if available (only once)
  useEffect(() => {
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
  
  // Note: No Redux updates - parent component manages state via props
  const handleFieldChange = (_field: string, _value: string) => {
    console.log(`Field ${_field} changed to: ${_value}`);
    // No-op: parent component handles state updates via setter props
  };

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
    setDeliveryAddress(value);
    handleFieldChange('deliveryAddress', value);

    // When street address is blank, clear dependent address fields (industry standard)
    if (!value.trim()) {
      setCity('');
      handleFieldChange('city', '');
      setState('');
      handleFieldChange('state', '');
      setZipCode('');
      handleFieldChange('zipCode', '');
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

  // Handle address suggestion selection
  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    // Populate all address fields from selected suggestion
    if (suggestion.street) {
      setDeliveryAddress(suggestion.street);
      handleFieldChange('deliveryAddress', suggestion.street);
    }
    if (suggestion.city) {
      setCity(suggestion.city);
      handleFieldChange('city', suggestion.city);
    }
    if (suggestion.state) {
      setState(suggestion.state);
      handleFieldChange('state', suggestion.state);
    }
    if (suggestion.postalCode) {
      setZipCode(suggestion.postalCode);
      handleFieldChange('zipCode', suggestion.postalCode);
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
      handleFieldChange('phone', validation.formatted);
      return;
    }
    
    // Validate and format phone number with selected country
    const validation = validatePhoneNumber(value, locationData, { country: selectedCountry });
    
    // Update phone state with formatted value
    setPhone(validation.formatted);
    
    // Update Redux store
    handleFieldChange('phone', validation.formatted);
    
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
    const validation = validatePhoneNumber(displayPhone, locationData, { country: selectedCountry });
    setPhoneError(validation.errorMessage);
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
        handleFieldChange('phone', validation.formatted);
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
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>👤</span> Full Name *
            </label>
            <input
              type="text"
              value={displayFullName}
              onChange={(e) => {
                setFullName(e.target.value);
                handleFieldChange('fullName', e.target.value);
              }}
              placeholder="Jane Doe"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>✉️</span> Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleFieldChange('email', e.target.value);
              }}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>📱</span> Phone Number *
            </label>
            {!displayPhone && (
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
                  title={`${countryName} (+${countryInfo.dialCode})`}
                  style={{ width: '80px', color: 'transparent', borderRadius: '10px' }}
                >
                  {allCountries.map((country) => (
                    <option key={country.code} value={country.code} className="bg-white text-gray-700">
                      {country.name} (+{country.dialCode})
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
                value={displayPhone}
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
            {phoneError && phoneTouched && (
              <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                {phoneError}
              </p>
            )}
            {!phoneError && displayPhone && phoneTouched && (
              <p className="mt-1 text-xs text-green-600">
                ✓ Valid {countryName} phone number
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
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>🏠</span> Street Address *
            </label>
            <div className="relative">
              <input
                ref={addressInputRef}
                type="text"
                value={deliveryAddress}
                onChange={(e) => handleAddressInputChange(e.target.value)}
                onFocus={() => {
                  if (addressSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="123 Main Street"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
                autoComplete="off"
              />
              {isSearchingAddress && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <span>🏙️</span> City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  handleFieldChange('city', e.target.value);
                }}
                placeholder="New York"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <span>🗺️</span> State *
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  handleFieldChange('state', e.target.value);
                }}
                placeholder="NY"
                required
                maxLength={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition uppercase"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <span>📮</span> ZIP Code *
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value);
                  handleFieldChange('zipCode', e.target.value);
                }}
                placeholder="10001"
                required
                maxLength={10}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>📝</span> Special Instructions (Optional)
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => {
                setDeliveryNotes(e.target.value);
                handleFieldChange('deliveryNotes', e.target.value);
              }}
              placeholder="Any special delivery instructions or notes..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

