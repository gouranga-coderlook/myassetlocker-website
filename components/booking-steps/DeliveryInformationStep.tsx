"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setDeliveryInfo, updateDeliveryField } from "@/store/slices/cartSlice";
import { useEffect, useState, useMemo } from "react";
import {
  validatePhoneNumber,
  getPhonePlaceholder,
  getPhoneFormatHint,
  detectCountryFromLocation,
  getCountryFlag,
  getCountryName,
  getAllCountries,
  getCountryInfo,
  type CountryCode,
} from "@/lib/utils/phoneValidation";

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
  
  // Fetch delivery information from Redux store
  const deliveryInfo = useAppSelector((state) => state.cart.deliveryInfo);
  
  // Fetch location data to auto-fill address fields if available
  const locationData = useAppSelector((state) => state.cart.locationData);
  
  // Phone validation state
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  
  // Detect country from location data (initial/default)
  const defaultCountry = useMemo(() => {
    return detectCountryFromLocation(locationData);
  }, [locationData]);
  
  // Selected country (user can change this)
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountry);
  
  // Update selected country when location data changes (only if user hasn't manually selected)
  useEffect(() => {
    if (defaultCountry && !phoneTouched) {
      setSelectedCountry(defaultCountry);
    }
  }, [defaultCountry, phoneTouched]);
  
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
  
  // Get country flag and name
  const countryFlag = useMemo(() => {
    return countryInfo.flag;
  }, [countryInfo]);
  
  const countryName = useMemo(() => {
    return countryInfo.name;
  }, [countryInfo]);
  
  // Load delivery info from Redux on mount (only if local state is empty)
  useEffect(() => {
    if (deliveryInfo) {
      if (deliveryInfo.fullName && !fullName) {
        setFullName(deliveryInfo.fullName);
      }
      if (deliveryInfo.email && !email) {
        setEmail(deliveryInfo.email);
      }
      if (deliveryInfo.phone && !phone) {
        // Format and validate phone when loading from Redux (use selectedCountry which is initialized from defaultCountry)
        const validation = validatePhoneNumber(deliveryInfo.phone, locationData, { country: selectedCountry });
        setPhone(validation.formatted);
        // Don't show error on initial load, only validate if user interacts
      }
      if (deliveryInfo.deliveryAddress && !deliveryAddress) {
        setDeliveryAddress(deliveryInfo.deliveryAddress);
      }
      if (deliveryInfo.city && !city) {
        setCity(deliveryInfo.city);
      }
      if (deliveryInfo.state && !state) {
        setState(deliveryInfo.state);
      }
      if (deliveryInfo.zipCode && !zipCode) {
        setZipCode(deliveryInfo.zipCode);
      }
      if (deliveryInfo.deliveryNotes && !deliveryNotes) {
        setDeliveryNotes(deliveryInfo.deliveryNotes);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Auto-fill address fields from location data if available (only once)
  useEffect(() => {
    if (locationData?.addressDetails && !deliveryAddress && !city && !state && !zipCode) {
      const address = locationData.addressDetails;
      if (address.street && address.street !== 'Not available') {
        setDeliveryAddress(address.street);
        dispatch(updateDeliveryField({ field: 'deliveryAddress', value: address.street }));
      }
      if (address.city && address.city !== 'Not available') {
        setCity(address.city);
        dispatch(updateDeliveryField({ field: 'city', value: address.city }));
      }
      if (address.state && address.state !== 'Not available') {
        setState(address.state);
        dispatch(updateDeliveryField({ field: 'state', value: address.state }));
      }
      if (address.postalCode && address.postalCode !== 'Not available') {
        setZipCode(address.postalCode);
        dispatch(updateDeliveryField({ field: 'zipCode', value: address.postalCode }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationData]);
  
  // Update Redux store when fields change
  const handleFieldChange = (field: keyof typeof deliveryInfo, value: string) => {
    dispatch(updateDeliveryField({ field, value }));
  };
  
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
  
  // Handle phone blur - mark as touched and validate
  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    const validation = validatePhoneNumber(phone, locationData, { country: selectedCountry });
    setPhoneError(validation.errorMessage);
  };
  
  // Handle country change
  const handleCountryChange = (newCountry: CountryCode) => {
    setSelectedCountry(newCountry);
    setPhoneTouched(true);
    
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
              value={fullName}
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
              {!phone && (
              <p className="mt-1 text-xs text-gray-500">
                {phoneFormatHint}
              </p>
            )}
            </label>
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
                {/* Display country code when closed (overlay) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-sm font-semibold text-gray-700">
                  {selectedCountry}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {/* Divider */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300"></div>
              </div>
              
              {/* Phone Input */}
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
            {phoneError && phoneTouched && (
              <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                {phoneError}
              </p>
            )}
            {!phoneError && phone && phoneTouched && (
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
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>🏠</span> Street Address *
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => {
                setDeliveryAddress(e.target.value);
                handleFieldChange('deliveryAddress', e.target.value);
              }}
              placeholder="123 Main Street"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
            />
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

