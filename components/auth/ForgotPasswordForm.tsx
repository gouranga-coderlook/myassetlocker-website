// components/auth/ForgotPasswordForm.tsx
"use client";
import { useAppDispatch } from "@/store/hooks";
import { setLoading } from "@/store/slices/authSlice";
import { authService } from "@/lib/api/authService";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
  onSwitchToResetPassword: (email: string) => void;
  isLoading: boolean;
}

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordForm({
  onSwitchToLogin,
  onSwitchToResetPassword,
  isLoading: externalLoading,
}: ForgotPasswordFormProps) {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    dispatch(setLoading(true));

    try {
      await authService.forgetPassword(values.email);
      toast.success("Password reset OTP sent to your email!");
      onSwitchToResetPassword(values.email);
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Failed to send reset email";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Enter your email address and we&apos;ll send you an OTP to reset your password.
        </p>
      </div>

      <Input
        id="forgot-email"
        type="email"
        label="Email Address"
        required
        disabled={externalLoading}
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email", {
          required: "Please enter your email address.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address.",
          },
        })}
      />

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
            Sending...
          </span>
        ) : (
          "Send Reset Code"
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={externalLoading}
          className="text-sm text-gray-600 hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Remember your password?{" "}
          <span className="font-semibold">Sign in</span>
        </button>
      </div>
    </form>
  );
}

