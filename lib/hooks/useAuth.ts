// lib/hooks/useAuth.ts
"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showAuthPopup as showAuthPopupAction, hideAuthPopup, logout } from "@/store/slices/authSlice";
import { clearAuthData } from "@/lib/utils/tokenStorage";

/**
 * Custom hook for authentication functionality
 * Provides easy access to auth state and actions
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, accessToken, refreshToken, showAuthPopup: isAuthPopupVisible, isLoading, authHydrated } = useAppSelector((state) => state.auth);

  const openAuthPopup = () => {
    dispatch(showAuthPopupAction());
  };

  const closeAuthPopup = () => {
    dispatch(hideAuthPopup());
  };

  const signOut = () => {
    dispatch(logout()); // auth slice clears user/tokens; profile slice clears on "auth/logout"
    clearAuthData();
    router.push("/");
    dispatch(showAuthPopupAction());
  };

  const isAuthenticated = !!user && (!!accessToken || !!refreshToken);

  return {
    user,
    accessToken,
    refreshToken,
    token: accessToken, // For backward compatibility
    isAuthenticated,
    isLoading,
    authHydrated,
    showAuthPopup: isAuthPopupVisible,
    openAuthPopup,
    closeAuthPopup,
    signOut,
  };
}

