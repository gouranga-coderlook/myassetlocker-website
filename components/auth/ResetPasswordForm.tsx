// components/auth/ResetPasswordForm.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { setLoading, hideAuthPopup } from "@/store/slices/authSlice";
import { authService } from "@/lib/api/authService";
import OTPInput from "./OTPInput";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

interface ResetPasswordFormProps {
  email: string;
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordForm({
  email,
  onSwitchToLogin,
  isLoading: externalLoading,
}: ResetPasswordFormProps) {
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [otpError, setOtpError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    watch,
    clearErrors,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const password = watch("password");

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      setOtpError(true);
      return;
    }

    dispatch(setLoading(true));
    setOtpError(false);

    try {
      await authService.verifyForgetPasswordOTP(email, otp);
      toast.success("OTP verified! Please set your new password.");
      setStep("password");
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Invalid OTP";
      toast.error(errorMessage);
      setOtpError(true);
      setOtp("");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onResetPassword = async (values: ResetPasswordFormValues) => {
    dispatch(setLoading(true));

    try {
      await authService.resetPassword(email, otp, values.password);
      toast.success("Password reset successfully! Please login with your new password.");
      dispatch(hideAuthPopup());
      setTimeout(() => {
        onSwitchToLogin();
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onInvalid = () => {
    toast.error("Please fill in all required fields");
  };

  if (step === "otp") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            We&apos;ve sent a password reset code to
          </p>
          <p className="font-semibold text-gray-800">{email}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
            Enter Verification Code
          </label>
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            disabled={externalLoading}
            error={otpError}
          />
          {otpError && (
            <p className="text-sm text-red-500 mt-2 text-center">
              Invalid code. Please try again.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleVerifyOTP}
          disabled={externalLoading || otp.length !== 6}
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
              Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            disabled={externalLoading}
            className="text-sm text-gray-600 hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back to <span className="font-semibold">Sign in</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onResetPassword, onInvalid)} noValidate className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Please enter your new password
        </p>
      </div>

      <div>
        <Input
          id="reset-password"
          type={showPassword ? "text" : "password"}
          label="New Password"
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.584 10.587a3 3 0 004.243 4.243M9.88 9.88a3 3 0 014.243 4.243M6.53 6.53A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-4.163 5.357M6.53 6.53A9.97 9.97 0 002.457 12c1.274 4.057 5.064 7 9.543 7 1.61 0 3.13-.34 4.5-.953" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          }
        />
        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
      </div>

      <div>
        <Input
          id="reset-confirm-password"
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm New Password"
          onFocus={() => clearErrors("confirmPassword")}
          disabled={externalLoading}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Confirm password is required.",
            validate: (value) =>
              value === password || "Passwords do not match.",
          })}
          rightAdornment={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={externalLoading}
              className="text-gray-500 hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.584 10.587a3 3 0 004.243 4.243M9.88 9.88a3 3 0 014.243 4.243M6.53 6.53A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-4.163 5.357M6.53 6.53A9.97 9.97 0 002.457 12c1.274 4.057 5.064 7 9.543 7 1.61 0 3.13-.34 4.5-.953" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          }
        />
      </div>

      <button
        type="submit"
        disabled={externalLoading || !isValid}
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
            Resetting password...
          </span>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );
}

