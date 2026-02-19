// lib/api/axiosInterceptor.ts
import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "./authService";
import { authService } from "./authService";
import { getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken, clearAuthData } from "../utils/tokenStorage";
import { setTokens, logout, showAuthPopup } from "@/store/slices/authSlice";

let isRefreshing = false;
let redirectInProgress = false; // Prevent multiple redirects
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Setup axios interceptors for automatic token refresh
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupAxiosInterceptors(store: any) {
  // Request interceptor - Add access token to requests
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = getAccessToken() || getRefreshToken();
      
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Let browser set Content-Type with boundary for FormData (e.g. profile picture upload)
      if (config.data instanceof FormData && config.headers) {
        delete config.headers["Content-Type"];
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle token refresh on 401
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Don't try to refresh token for auth endpoints (401 means invalid credentials, not expired token)
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                            originalRequest.url?.includes('/auth/register') ||
                            originalRequest.url?.includes('/auth/verify-email') ||
                            originalRequest.url?.includes('/auth/forget-password') ||
                            originalRequest.url?.includes('/auth/reset-password') ||
                            originalRequest.url?.includes('/auth/refresh-token');

      // If error is not 401, or it's an auth endpoint, reject immediately
      if (error.response?.status !== 401 || isAuthEndpoint) {
        return Promise.reject(error);
      }

      // If already retried and still 401, token refresh failed - redirect to signin
      if (originalRequest._retry) {
        store.dispatch(logout());
        clearAuthData();
        redirectToSignIn(store);
        return Promise.reject(error);
      }

      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ 
            resolve, 
            reject: (err) => {
              // Don't redirect here - processQueue will handle it
              reject(err);
            }
          });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const currentAccessToken = store.getState().auth.accessToken || getAccessToken();
      const currentRefreshToken = store.getState().auth.refreshToken || getRefreshToken();

      if (!currentRefreshToken) {
        processQueue(new Error("No refresh token available"), null);
        store.dispatch(logout());
        clearAuthData();
        
        // Redirect to home page with signin popup
        redirectToSignIn(store);
        
        return Promise.reject(error);
      }

      try {
        // Send both access_token and refresh_token in the payload
        const response = await authService.refreshToken(
          currentAccessToken || "",
          currentRefreshToken
        );
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response;

        // Update tokens in store and storage
        store.dispatch(setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        }));
        saveAccessToken(newAccessToken);
        saveRefreshToken(newRefreshToken);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        store.dispatch(logout());
        clearAuthData();
        
        // Redirect to home page with signin popup when token refresh fails
        redirectToSignIn(store);
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

/**
 * Helper function to redirect to home page with signin popup
 * Uses a flag to prevent multiple simultaneous redirects
 * Navigates without changing URL (no query params) and opens auth popup via Redux
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function redirectToSignIn(store: any) {
  if (typeof window === "undefined") return;
  
  // Prevent multiple redirects
  if (redirectInProgress) return;
  
  // Get current path for returnUrl (only if not already on home page)
  const currentPath = window.location.pathname + window.location.search;
  const isOnHomePage = currentPath === "/" || currentPath === "";
  
  // Only navigate if we're not already on the home page
  if (!isOnHomePage) {
    redirectInProgress = true;
    
    // Store returnUrl in sessionStorage for redirect after login
    sessionStorage.setItem("authReturnUrl", currentPath);
    
    // Set flag to open auth popup after navigation
    sessionStorage.setItem("openAuthPopup", "true");
    
    // Navigate to home page without query parameters
    window.location.href = "/";
  } else {
    // Already on home page, just open the popup directly via Redux
    // No need to set sessionStorage flag since we're opening immediately
    store.dispatch(showAuthPopup());
    redirectInProgress = false;
  }
}

