// components/auth/LoginForm.tsx
"use client";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAuthData, setLoading, hideAuthPopup } from "@/store/slices/authSlice";
import { authService, type AuthForm } from "@/lib/api/authService";
import { saveAccessToken, saveRefreshToken, saveUser } from "@/lib/utils/tokenStorage";
import { extractUserFromToken } from "@/lib/utils/jwtDecoder";
import PasswordInput from "./PasswordInput";
import toast from "react-hot-toast";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  isLoading: boolean;
}

export default function LoginForm({
  onSwitchToRegister,
  onSwitchToForgotPassword,
  isLoading: externalLoading,
}: LoginFormProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    dispatch(setLoading(true));
    
    // Safety timeout to ensure loading state is reset even if promise hangs
    const loadingTimeout = setTimeout(() => {
      dispatch(setLoading(false));
    }, 30000); // 30 second timeout

    try {
      const credentials: AuthForm = {
        username: formData.username,
        password: formData.password,
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
        })
      );

      // Persist to localStorage
      saveAccessToken(response.accessToken);
      saveRefreshToken(response.refreshToken);
      saveUser(user);

      toast.success("Welcome back!");

      // Close popup after successful authentication
      setTimeout(() => {
        dispatch(hideAuthPopup());
      }, 500);
    } catch (error: unknown) {
      // Clear timeout on error
      clearTimeout(loadingTimeout);
      // Ensure loading is reset immediately on error
      dispatch(setLoading(false));
      const errorMessage = (error as { message?: string })?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      // Clear timeout and ensure loading is reset
      clearTimeout(loadingTimeout);
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="login-username"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Username or Email
        </label>
        <input
          type="text"
          id="login-username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          disabled={externalLoading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="username or email"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="login-password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            disabled={externalLoading}
            className="text-sm text-[#f8992f] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Forgot password?
          </button>
        </div>
        <PasswordInput
          id="login-password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={externalLoading}
          required
          minLength={6}
          showLabel={false}
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
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToRegister}
          disabled={externalLoading}
          className="text-sm text-gray-600 hover:text-[#f8992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Don&apos;t have an account?{" "}
          <span className="font-semibold">Sign up</span>
        </button>
      </div>
    </form>
  );
}

