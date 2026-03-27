// components/AuthPopup.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideAuthPopup, setAuthData, setLoading } from "@/store/slices/authSlice";
import { authService, type AuthForm } from "@/lib/api/authService";
import { saveAccessToken, saveRefreshToken, saveUser } from "@/lib/utils/tokenStorage";
import { extractUserFromToken } from "@/lib/utils/jwtDecoder";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import ForgotPasswordForm from "./auth/ForgotPasswordForm";
import VerifyEmailForm from "./auth/VerifyEmailForm";
import ResetPasswordForm from "./auth/ResetPasswordForm";
import toast from "react-hot-toast";

type AuthView = "login" | "register" | "forgot-password" | "verify-email" | "reset-password";

export default function AuthPopup() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showAuthPopup, isLoading, user } = useAppSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}` || fallbackPath;
      }
    } catch {
      // Ignore malformed URLs and use fallback.
    }

    return fallbackPath;
  };

  // Reset to login view when popup opens
  useEffect(() => {
    if (showAuthPopup) {
      setCurrentView("login");
      setEmail("");
    }
  }, [showAuthPopup]);

  // Disable background scroll when popup is open
  useEffect(() => {
    if (showAuthPopup) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [showAuthPopup]);

  const handleClose = () => {
    if (!isLoading) {
      dispatch(hideAuthPopup());
      
      // If popup was opened due to 401 redirect, clean up URL and sessionStorage
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const signin = urlParams.get("signin");
        
        // Clear the openAuthPopup flag if it exists
        sessionStorage.removeItem("openAuthPopup");
        
        // If we're on home page with signin=true, clean up the URL
        if (signin === "true" && window.location.pathname === "/") {
          // Clear returnUrl from sessionStorage since user chose not to login
          sessionStorage.removeItem("authReturnUrl");
          
          // Remove query parameters and redirect to clean home page
          router.push("/");
        }
      }
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case "login":
        return "Welcome Back";
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Forgot Password";
      case "verify-email":
        return "Verify Email";
      case "reset-password":
        return "Reset Password";
      default:
        return "Authentication";
    }
  };

  // Don't show if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <AnimatePresence>
      {showAuthPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <AnimatePresence mode="wait">
                  {currentView === "login" && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LoginForm
                        onSwitchToRegister={() => setCurrentView("register")}
                        onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}

                  {currentView === "register" && (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RegisterForm
                        onSwitchToLogin={(email) => {
                          if (email) setEmail(email);
                          if (password) setPassword(password);
                          setCurrentView("login");
                        }}
                        onSwitchToVerifyEmail={(email, password) => {
                          setEmail(email);
                          if (password) {
                            setPassword(password);
                          }
                          setCurrentView("verify-email");
                        }}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}

                  {currentView === "forgot-password" && (
                    <motion.div
                      key="forgot-password"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ForgotPasswordForm
                        onSwitchToLogin={() => setCurrentView("login")}
                        onSwitchToResetPassword={(email) => {
                          setEmail(email);
                          setCurrentView("reset-password");
                        }}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}

                  {currentView === "verify-email" && (
                    <motion.div
                      key="verify-email"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <VerifyEmailForm
                        email={email}
                        password={password}
                        onSwitchToLogin={() => setCurrentView("login")}
                        onVerificationSuccess={async () => {
                          // Login with email and password
                          if (!password) {
                            toast.error("Password is required for login");
                            return;
                          }
                          dispatch(setLoading(true));
                          try {
                            const credentials: AuthForm = {
                              username: email,
                              password: password,
                            };
                            const response = await authService.login(credentials);

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

                            toast.success("Email verified! Welcome!");

                            const redirectPath = getPostLoginRedirectPath();
                            dispatch(hideAuthPopup());
                            router.push(redirectPath);
                          } catch (error: unknown) {
                            const errorMessage = (error as { message?: string })?.message || "Login failed";
                            toast.error(errorMessage);
                          } finally {
                            dispatch(setLoading(false));
                          }
                        }}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}

                  {currentView === "reset-password" && (
                    <motion.div
                      key="reset-password"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ResetPasswordForm
                        email={email}
                        onSwitchToLogin={() => setCurrentView("login")}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
