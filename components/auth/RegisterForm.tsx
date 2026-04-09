// components/auth/RegisterForm.tsx
"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { setLoading } from "@/store/slices/authSlice";
import { authService, type CreateCustomUserDto } from "@/lib/api/authService";
import {
  validatePhoneNumber,
  getAllCountries,
  getCountryInfo,
  type CountryCode,
} from "@/lib/utils/phoneValidation";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import AppStoreButtons from "@/components/AppStoreButtons";
interface RegisterFormProps {
  onSwitchToLogin: (email?: string) => void;
  onSwitchToVerifyEmail: (email: string, password?: string) => void;
  isLoading: boolean;
}

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  mobilePhoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm({
  onSwitchToLogin,
  onSwitchToVerifyEmail,
  isLoading: externalLoading,
}: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    setValue,
    watch,
    clearErrors,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobilePhoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const allCountries = useMemo(
    () => getAllCountries().sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const countryInfo = useMemo(
    () => getCountryInfo(selectedCountry),
    [selectedCountry],
  );
  const phonePlaceholder = countryInfo.placeholder;
  const phoneFormatHint = countryInfo.hint;
  const mobilePhoneNumber = watch("mobilePhoneNumber");
  const password = watch("password");

  const headline = "Download the App Today!";

  const handlePhoneChange = (value: string) => {
    const maxDigits = countryInfo.maxLength;
    const digits = value.replace(/\D/g, "");
    if (digits.length > maxDigits) {
      const truncated = digits.slice(0, maxDigits);
      const validation = validatePhoneNumber(truncated, null, {
        country: selectedCountry,
      });
      setValue("mobilePhoneNumber", validation.formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setPhoneError(phoneTouched ? validation.errorMessage : null);
      return;
    }
    const validation = validatePhoneNumber(value, null, {
      country: selectedCountry,
    });
    setValue("mobilePhoneNumber", validation.formatted, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (!validation.formatted.trim()) {
      setPhoneError(null);
      return;
    }
    if (phoneTouched) setPhoneError(validation.errorMessage);
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    const validation = validatePhoneNumber(mobilePhoneNumber, null, {
      country: selectedCountry,
    });
    setPhoneError(validation.errorMessage);
  };

  const handleCountryChange = (newCountry: CountryCode) => {
    setSelectedCountry(newCountry);
    setPhoneTouched(true);
    const phone = mobilePhoneNumber;
    if (phone) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length > 0) {
        const newCountryInfo = getCountryInfo(newCountry);
        const truncatedDigits = digits.slice(0, newCountryInfo.maxLength);
        const validation = validatePhoneNumber(truncatedDigits, null, {
          country: newCountry,
        });
        setValue("mobilePhoneNumber", validation.formatted, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setPhoneError(validation.errorMessage);
      }
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    // Validate phone number with country-aware validation
    const phoneValidation = validatePhoneNumber(
      values.mobilePhoneNumber,
      null,
      {
        country: selectedCountry,
      },
    );
    if (!phoneValidation.isValid) {
      toast.error(
        phoneValidation.errorMessage ?? "Please enter a valid phone number",
      );
      return;
    }

    // Build full number with country code and space after dial code: +[dialCode] [digits]
    const digits = values.mobilePhoneNumber.replace(/\D/g, "");
    const mobilePhoneNumberWithCountryCode = `+${countryInfo.dialCode} ${digits}`;

    dispatch(setLoading(true));

    try {
      const credentials: CreateCustomUserDto = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        mobilePhoneNumber: mobilePhoneNumberWithCountryCode,
        email: values.email.trim(),
        password: values.password,
      };
      await authService.register(credentials);

      toast.success("Account created successfully! Please verify your email.");

      // Switch to email verification with password
      onSwitchToVerifyEmail(values.email.trim(), values.password);
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onInvalid = () => {
    toast.error("Please fill in all required fields");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="register-first-name"
            type="text"
            label="First Name"
            disabled={externalLoading}
            placeholder="John"
            required
            error={errors.firstName?.message}
            onFocus={() => clearErrors("firstName")}
            {...register("firstName", {
              required: "First name is required.",
              validate: (value) =>
                value.trim().length > 0 || "First name is required.",
            })}
          />

          <Input
            id="register-last-name"
            type="text"
            label="Last Name"
            disabled={externalLoading}
            placeholder="Doe"
            required
            error={errors.lastName?.message}
            onFocus={() => clearErrors("lastName")}
            {...register("lastName", {
              required: "Last name is required.",
              validate: (value) =>
                value.trim().length > 0 || "Last name is required.",
            })}
          />
        </div>

        <div>
          <label
            htmlFor="register-phone"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Mobile Phone Number
            <span className="ml-1 text-red-500">*</span>
          </label>
          {!mobilePhoneNumber && (
            <p className="text-xs text-gray-500 mb-2">{phoneFormatHint}</p>
          )}
          <div className="relative flex items-center border-2 border-gray-300 rounded-xl focus-within:border-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <div className="relative">
              <select
                aria-label="Country code"
                value={selectedCountry}
                onChange={(e) =>
                  handleCountryChange(e.target.value as CountryCode)
                }
                disabled={externalLoading}
                className="pl-10 pr-6 py-3 appearance-none bg-transparent border-0 focus:outline-none cursor-pointer text-transparent hover:text-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                title={`+${countryInfo.dialCode}`}
                style={{
                  width: "80px",
                  color: "transparent",
                  borderRadius: "10px",
                }}
              >
                {allCountries.map((country) => (
                  <option
                    key={country.code}
                    value={country.code}
                    className="bg-white text-gray-700"
                  >
                    +{country.dialCode} ({country.code})
                  </option>
                ))}
              </select>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-sm font-semibold text-gray-700">
                +{countryInfo.dialCode}
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
              value={mobilePhoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={handlePhoneBlur}
              onFocus={() => clearErrors("mobilePhoneNumber")}
              disabled={externalLoading}
              placeholder={phonePlaceholder}
              maxLength={countryInfo.maxLength + 15}
              className="flex-1 px-4 py-3 border-0 focus:outline-none bg-transparent text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
              aria-invalid={
                (phoneError && phoneTouched) || !!errors.mobilePhoneNumber
                  ? "true"
                  : "false"
              }
              aria-describedby={
                phoneError && phoneTouched
                  ? "register-phone-error"
                  : errors.mobilePhoneNumber
                    ? "register-phone-error"
                    : undefined
              }
            />
          </div>
          <input
            type="hidden"
            {...register("mobilePhoneNumber", {
              required: "Mobile phone number is required.",
              validate: (value) => {
                if (!value.trim()) return "Mobile phone number is required.";
                const validation = validatePhoneNumber(value, null, {
                  country: selectedCountry,
                });
                return (
                  validation.isValid ||
                  validation.errorMessage ||
                  "Please enter a valid phone number."
                );
              },
            })}
          />
          {(phoneError && phoneTouched) || errors.mobilePhoneNumber ? (
            <p
              id="register-phone-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {phoneError || errors.mobilePhoneNumber?.message}
            </p>
          ) : null}
          {!phoneError && mobilePhoneNumber && phoneTouched && (
            <p className="mt-1 text-xs text-green-600">
              ✓ Valid +{countryInfo.dialCode} phone number
            </p>
          )}
        </div>

        <Input
          id="register-email"
          type="email"
          label="Email Address"
          required
          disabled={externalLoading}
          placeholder="you@example.com"
          error={errors.email?.message}
          onFocus={() => clearErrors("email")}
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address.",
            },
          })}
        />

        <div>
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            label="Password"
            required
            onFocus={() => clearErrors("password")}
            disabled={externalLoading}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters.",
              },
              validate: (value) =>
                value.trim().length > 0 || "Password is required.",
            })}
            rightAdornment={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={externalLoading}
                className="text-gray-500 hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18M10.584 10.587a3 3 0 004.243 4.243M9.88 9.88a3 3 0 014.243 4.243M6.53 6.53A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-4.163 5.357M6.53 6.53A9.97 9.97 0 002.457 12c1.274 4.057 5.064 7 9.543 7 1.61 0 3.13-.34 4.5-.953"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 6 characters
          </p>
        </div>

        <div>
          <Input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            onFocus={() => clearErrors("confirmPassword")}
            disabled={externalLoading}
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            required
            {...register("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) =>
                value === password || "Passwords do not match.",
            })}
            rightAdornment={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={externalLoading}
                className="text-gray-500 hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18M10.584 10.587a3 3 0 004.243 4.243M9.88 9.88a3 3 0 014.243 4.243M6.53 6.53A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-4.163 5.357M6.53 6.53A9.97 9.97 0 002.457 12c1.274 4.057 5.064 7 9.543 7 1.61 0 3.13-.34 4.5-.953"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            }
          />
        </div>

        <button
          type="submit"
          disabled={externalLoading || !isValid || !!phoneError}
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
          <span className="font-semibold">Already have an account? </span>
          <button
            type="button"
            onClick={() => onSwitchToLogin()}
            disabled={externalLoading}
            className="text-sm text-gray-600 hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-semibold underline">Sign in</span>
          </button>
        </div>
      </form>
      <div className="text-center">
        {/* Headline */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 my-4 uppercase text-center">
          {headline}
        </h2>

        {/* App Store Buttons */}
        <AppStoreButtons className="mx-auto" />
      </div>
    </>
  );
}
