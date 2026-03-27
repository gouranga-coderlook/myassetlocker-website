// components/auth/VerifyEmailForm.tsx
"use client";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setLoading } from "@/store/slices/authSlice";
import { authService } from "@/lib/api/authService";
import OTPInput from "./OTPInput";
import toast from "react-hot-toast";

interface VerifyEmailFormProps {
  email: string;
  password?: string;
  onSwitchToLogin: () => void;
  onVerificationSuccess?: () => void;
  isLoading: boolean;
}

export default function VerifyEmailForm({
  email,
  onSwitchToLogin,
  onVerificationSuccess,
  isLoading: externalLoading,
}: VerifyEmailFormProps) {
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      setError(true);
      return;
    }

    dispatch(setLoading(true));
    setError(false);

    try {
      await authService.verifyEmail(email, otp);
      // If onVerificationSuccess is provided, use it (auto-login), otherwise switch to login
      if (onVerificationSuccess) {
        onVerificationSuccess?.();
      } else {
        toast.success("Email verified successfully!");
        onSwitchToLogin();
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Invalid OTP";
      toast.error(errorMessage);
      setError(true);
      setOtp("");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    dispatch(setLoading(true));
    try {
      await authService.resendEmailVerificationOTP(email);
      toast.success("OTP resent to your email!");
      setResendCooldown(60); // 60 second cooldown
      
      // Countdown timer
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Failed to resend OTP";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          We&apos;ve sent a verification code to
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
          error={error}
        />
        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">
            Invalid code. Please try again.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleVerify}
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
          "Verify Email"
        )}
      </button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={externalLoading || resendCooldown > 0}
          className="text-sm text-[#f8992f] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Didn't receive the code? Resend"}
        </button>
        <div>
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
    </div>
  );
}

