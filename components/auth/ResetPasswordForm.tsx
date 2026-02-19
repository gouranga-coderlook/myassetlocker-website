// components/auth/ResetPasswordForm.tsx
"use client";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setLoading, hideAuthPopup } from "@/store/slices/authSlice";
import { authService } from "@/lib/api/authService";
import OTPInput from "./OTPInput";
import PasswordInput from "./PasswordInput";
import toast from "react-hot-toast";

interface ResetPasswordFormProps {
  email: string;
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

export default function ResetPasswordForm({
  email,
  onSwitchToLogin,
  isLoading: externalLoading,
}: ResetPasswordFormProps) {
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [otpError, setOtpError] = useState(false);

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(setLoading(true));

    try {
      await authService.resetPassword(email, otp, password);
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
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Please enter your new password
        </p>
      </div>

      <div>
        <PasswordInput
          id="reset-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={externalLoading}
          required
          minLength={6}
          label="New Password"
        />
        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
      </div>

      <div>
        <PasswordInput
          id="reset-confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={externalLoading}
          required
          minLength={6}
          label="Confirm New Password"
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
            Resetting password...
          </span>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );
}

