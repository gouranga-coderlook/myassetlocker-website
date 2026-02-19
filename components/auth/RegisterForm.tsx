// components/auth/RegisterForm.tsx
"use client";
import { useState, useMemo } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setLoading } from "@/store/slices/authSlice";
import { authService, type CreateCustomUserDto } from "@/lib/api/authService";
import {
  validatePhoneNumber,
  getAllCountries,
  getCountryInfo,
  type CountryCode,
} from "@/lib/utils/phoneValidation";
import PasswordInput from "./PasswordInput";
import toast from "react-hot-toast";

interface RegisterFormProps {
  onSwitchToLogin: (email?: string) => void;
  onSwitchToVerifyEmail: (email: string, password?: string) => void;
  isLoading: boolean;
}

export default function RegisterForm({
  onSwitchToLogin,
  onSwitchToVerifyEmail,
  isLoading: externalLoading,
}: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobilePhoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const allCountries = useMemo(
    () => getAllCountries().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const countryInfo = useMemo(() => getCountryInfo(selectedCountry), [selectedCountry]);
  const phonePlaceholder = countryInfo.placeholder;
  const phoneFormatHint = countryInfo.hint;
  const countryName = countryInfo.name;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string) => {
    const maxDigits = countryInfo.maxLength;
    const digits = value.replace(/\D/g, "");
    if (digits.length > maxDigits) {
      const truncated = digits.slice(0, maxDigits);
      const validation = validatePhoneNumber(truncated, null, { country: selectedCountry });
      setFormData((prev) => ({ ...prev, mobilePhoneNumber: validation.formatted }));
      setPhoneError(phoneTouched ? validation.errorMessage : null);
      return;
    }
    const validation = validatePhoneNumber(value, null, { country: selectedCountry });
    setFormData((prev) => ({ ...prev, mobilePhoneNumber: validation.formatted }));
    if (!validation.formatted.trim()) {
      setPhoneError(null);
      return;
    }
    if (phoneTouched) setPhoneError(validation.errorMessage);
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    const validation = validatePhoneNumber(formData.mobilePhoneNumber, null, {
      country: selectedCountry,
    });
    setPhoneError(validation.errorMessage);
  };

  const handleCountryChange = (newCountry: CountryCode) => {
    setSelectedCountry(newCountry);
    setPhoneTouched(true);
    const phone = formData.mobilePhoneNumber;
    if (phone) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length > 0) {
        const newCountryInfo = getCountryInfo(newCountry);
        const truncatedDigits = digits.slice(0, newCountryInfo.maxLength);
        const validation = validatePhoneNumber(truncatedDigits, null, { country: newCountry });
        setFormData((prev) => ({ ...prev, mobilePhoneNumber: validation.formatted }));
        setPhoneError(validation.errorMessage);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.mobilePhoneNumber || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Validate phone number with country-aware validation
    const phoneValidation = validatePhoneNumber(formData.mobilePhoneNumber, null, {
      country: selectedCountry,
    });
    if (!phoneValidation.isValid) {
      toast.error(phoneValidation.errorMessage ?? "Please enter a valid phone number");
      return;
    }

    // Build full number with country code and space after dial code: +[dialCode] [digits]
    const digits = formData.mobilePhoneNumber.replace(/\D/g, "");
    const mobilePhoneNumberWithCountryCode = `+${countryInfo.dialCode} ${digits}`;

    dispatch(setLoading(true));

    try {
      const credentials: CreateCustomUserDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobilePhoneNumber: mobilePhoneNumberWithCountryCode,
        email: formData.email,
        password: formData.password,
      };
      await authService.register(credentials);

      toast.success("Account created successfully! Please verify your email.");
      
      // Switch to email verification with password
      onSwitchToVerifyEmail(formData.email, formData.password);
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="register-first-name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            id="register-first-name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={externalLoading}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="John"
            required
          />
        </div>

        <div>
          <label
            htmlFor="register-last-name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Last Name
          </label>
          <input
            type="text"
            id="register-last-name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={externalLoading}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="register-phone"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Mobile Phone Number
        </label>
        {!formData.mobilePhoneNumber && (
          <p className="text-xs text-gray-500 mb-2">{phoneFormatHint}</p>
        )}
        <div className="relative flex items-center border-2 border-gray-300 rounded-xl focus-within:border-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="relative">
            <select
              aria-label="Country code"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value as CountryCode)}
              disabled={externalLoading}
              className="pl-10 pr-6 py-3 appearance-none bg-transparent border-0 focus:outline-none cursor-pointer text-transparent hover:text-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              title={`${countryName} (+${countryInfo.dialCode})`}
              style={{ width: "80px", color: "transparent", borderRadius: "10px" }}
            >
              {allCountries.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  className="bg-white text-gray-700"
                >
                  {country.name} (+{country.dialCode})
                </option>
              ))}
            </select>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-sm font-semibold text-gray-700">
              {selectedCountry}
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300" />
          </div>
          <input
            type="tel"
            id="register-phone"
            value={formData.mobilePhoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={handlePhoneBlur}
            disabled={externalLoading}
            placeholder={phonePlaceholder}
            required
            maxLength={countryInfo.maxLength + 15}
            className="flex-1 px-4 py-3 border-0 focus:outline-none bg-transparent text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
            aria-invalid={phoneError && phoneTouched ? "true" : "false"}
            aria-describedby={phoneError && phoneTouched ? "register-phone-error" : undefined}
          />
        </div>
        {phoneError && phoneTouched && (
          <p
            id="register-phone-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {phoneError}
          </p>
        )}
        {!phoneError && formData.mobilePhoneNumber && phoneTouched && (
          <p className="mt-1 text-xs text-green-600">
            ✓ Valid {countryName} phone number
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          id="register-email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={externalLoading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <PasswordInput
          id="register-password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={externalLoading}
          required
          minLength={6}
          label="Password"
        />
        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
      </div>

      <div>
        <PasswordInput
          id="register-confirm-password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          disabled={externalLoading}
          required
          minLength={6}
          label="Confirm Password"
        />
      </div>

      <button
        type="submit"
        disabled={externalLoading}
        className="w-full bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-bold py-3 px-4 rounded-xl hover:from-[#d8852a] hover:to-[#e88a25] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {externalLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => onSwitchToLogin()}
          disabled={externalLoading}
          className="text-sm text-gray-600 hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Already have an account?{" "}
          <span className="font-semibold">Sign in</span>
        </button>
      </div>
    </form>
  );
}

