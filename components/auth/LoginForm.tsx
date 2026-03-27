// components/auth/LoginForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import {
  setAuthData,
  setLoading,
  hideAuthPopup,
} from "@/store/slices/authSlice";
import { authService, type AuthForm } from "@/lib/api/authService";
import {
  saveAccessToken,
  saveRefreshToken,
  saveUser,
} from "@/lib/utils/tokenStorage";
import { extractUserFromToken } from "@/lib/utils/jwtDecoder";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import AppStoreButtons from "../AppStoreButtons";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  isLoading: boolean;
}

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginForm({
  onSwitchToRegister,
  onSwitchToForgotPassword,
  isLoading: externalLoading,
}: LoginFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const headline = "DOWNLOAD THE APP TODAY!";

  const getPostLoginRedirectPath = (): string => {
    if (typeof window === "undefined") return "/dashboard";

    const fallbackPath = "/dashboard";
    const storedReturnUrl = sessionStorage.getItem("authReturnUrl");
    if (!storedReturnUrl) return fallbackPath;

    sessionStorage.removeItem("authReturnUrl");

    if (storedReturnUrl.startsWith("/")) return storedReturnUrl;

    try {
      const parsedUrl = new URL(storedReturnUrl);
      if (parsedUrl.origin === window.location.origin) {
        return (
          `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}` ||
          fallbackPath
        );
      }
    } catch {
      // Ignore malformed URLs and use fallback.
    }

    return fallbackPath;
  };

  const onSubmit = async (values: LoginFormValues) => {
    dispatch(setLoading(true));

    // Safety timeout to ensure loading state is reset even if promise hangs
    const loadingTimeout = setTimeout(() => {
      dispatch(setLoading(false));
    }, 30000); // 30 second timeout

    try {
      const credentials: AuthForm = {
        username: values.username,
        password: values.password,
      };
      const response = await authService.login(credentials);

      // Clear timeout on success
      clearTimeout(loadingTimeout);

      // Extract user info from access token
      const user = extractUserFromToken(response.accessToken);
      if (!user) {
        throw new Error("Failed to extract user information from token");
      }

      // Save tokens and user data
      dispatch(
        setAuthData({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user,
        }),
      );

      // Persist to localStorage
      saveAccessToken(response.accessToken);
      saveRefreshToken(response.refreshToken);
      saveUser(user);

      toast.success("Welcome back!");

      const redirectPath = getPostLoginRedirectPath();
      dispatch(hideAuthPopup());
      router.push(redirectPath);
    } catch (error: unknown) {
      // Clear timeout on error
      clearTimeout(loadingTimeout);
      // Ensure loading is reset immediately on error
      dispatch(setLoading(false));
      const errorMessage =
        (error as { message?: string })?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      // Clear timeout and ensure loading is reset
      clearTimeout(loadingTimeout);
      dispatch(setLoading(false));
    }
  };

  const onInvalid = () => {
    toast.error("Please fill out these details.");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-4">
        <Input
          type="text"
          id="login-username"
          label="Username or Email"
          onFocus={() => clearErrors("username")}
          error={errors.username?.message}
          disabled={externalLoading}
          placeholder="username or email"
          required
          {...register("username", {
            required: "Username or email is required.",
            validate: (value) =>
              value.trim().length > 0 || "Username or email is required.",
          })}
        />

        <div>
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            label="Password"
            onFocus={() => clearErrors("password")}
            disabled={externalLoading}
            placeholder="••••••••"
            error={errors.password?.message}
            required
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters.",
              },
              validate: (value) =>
                value.trim().length > 0 || "Password is required.",
            })}
            labelRightAdornment={
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                disabled={externalLoading}
                className="text-sm text-[#f8992f] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forgot password?
              </button>
            }
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
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="text-center">
          <span className="font-semibold">Create Account? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            disabled={externalLoading}
            className="text-sm text-gray-600 hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed underline"
          >
            <span className="font-semibold hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Sign up
            </span>
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
