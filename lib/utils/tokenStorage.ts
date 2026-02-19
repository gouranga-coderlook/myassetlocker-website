// lib/utils/tokenStorage.ts

const ACCESS_TOKEN_KEY = "myassetlocker_access_token";
const REFRESH_TOKEN_KEY = "myassetlocker_refresh_token";
const USER_KEY = "myassetlocker_user";

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  emailVerified?: boolean;
}

/**
 * Save access token to localStorage
 */
export function saveAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  if (!token || token === "undefined" || token === "null") {
    return;
  }
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (error: unknown) {
    console.error("Error saving access token:", error);
  }
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token || token === "undefined" || token === "null") {
      return null;
    }
    return token;
  } catch (error: unknown) {
    console.error("Error getting access token:", error);
    return null;
  }
}

/**
 * Save refresh token to localStorage
 */
export function saveRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  if (!token || token === "undefined" || token === "null") {
    return;
  }
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error: unknown) {
    console.error("Error saving refresh token:", error);
  }
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!token || token === "undefined" || token === "null") {
      return null;
    }
    return token;
  } catch (error: unknown) {
    console.error("Error getting refresh token:", error);
    return null;
  }
}

/**
 * Save user data to localStorage
 */
export function saveUser(user: StoredUser): void {
  if (typeof window === "undefined") return;
  if (!user || !user.id || !user.email) {
    return;
  }
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error: unknown) {
    console.error("Error saving user data:", error);
    // Silently handle localStorage errors
  }
}

/**
 * Get user data from localStorage
 */
export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr || userStr === "undefined" || userStr === "null") {
      return null;
    }
    const parsed = JSON.parse(userStr) as StoredUser;
    // Validate parsed user data
    if (!parsed || !parsed.id || !parsed.email) {
      // Invalid data, remove it
      localStorage.removeItem(USER_KEY);
      return null;
    }
    return parsed;
  } catch (error: unknown) {
    console.error("Error parsing user data:", error);
    // Remove invalid data
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      // Ignore removal errors
    }
    return null;
  }
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error: unknown) {
    console.error("Error clearing auth data:", error);
    // Silently handle localStorage errors
  }
}

/**
 * Clean up invalid data from localStorage
 * Removes any "undefined" or "null" string values
 */
export function cleanupInvalidAuthData(): void {
  if (typeof window === "undefined") return;
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (accessToken === "undefined" || accessToken === "null") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    if (refreshToken === "undefined" || refreshToken === "null") {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    if (userStr === "undefined" || userStr === "null") {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error: unknown) {
    console.error("Error cleaning up invalid auth data:", error);
    // Silently handle cleanup errors
  }
}

/**
 * Check if user is authenticated (has valid tokens)
 */
export function isAuthenticated(): boolean {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken || refreshToken);
}

