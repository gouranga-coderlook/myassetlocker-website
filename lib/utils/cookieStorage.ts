// lib/utils/cookieStorage.ts
import type { BookingCart } from "@/store/slices/cartSlice";

const CART_COOKIE_KEY_PREFIX = "myassetlocker_guest_cart_";
const CURRENT_CART_ID_KEY = "myassetlocker_current_cart_id";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Generate UUID v4
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Set a cookie with the given name, value, and options
 */
function setCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + maxAge * 1000);

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
}

/**
 * Delete a cookie by name
 */
function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Get current cart ID from cookies
 */
export function getCurrentCartId(): string | null {
  return getCookie(CURRENT_CART_ID_KEY);
}

/**
 * Set current cart ID in cookies
 */
export function setCurrentCartId(cartId: string): void {
  setCookie(CURRENT_CART_ID_KEY, cartId);
}

/**
 * Save guest cart data to cookies with UUID
 * Returns the cart ID
 */
export function saveGuestCartToCookie(cart: BookingCart): string {
  try {
    // Get or generate cart ID
    let cartId = getCurrentCartId();
    if (!cartId) {
      cartId = generateUUID();
      setCurrentCartId(cartId);
    }

    // Store cart data with UUID as key
    const cartKey = `${CART_COOKIE_KEY_PREFIX}${cartId}`;
    const serialized = JSON.stringify(cart);
    setCookie(cartKey, serialized);

    return cartId;
  } catch (error: unknown) {
    console.error("Error saving guest cart to cookie:", error);
    // Generate a new ID if save fails
    const cartId = generateUUID();
    setCurrentCartId(cartId);
    return cartId;
  }
}

/**
 * Load guest cart data from cookies by cart ID
 * If no cartId provided, loads the current cart
 */
export function loadGuestCartFromCookie(cartId?: string): Partial<BookingCart> | null {
  try {
    // Use provided cartId or get current one
    const targetCartId = cartId || getCurrentCartId();
    if (!targetCartId) return null;

    const cartKey = `${CART_COOKIE_KEY_PREFIX}${targetCartId}`;
    const serialized = getCookie(cartKey);
    if (!serialized) return null;

    const cart = JSON.parse(serialized) as Partial<BookingCart>;
    return cart;
  } catch (error: unknown) {
    console.error("Error loading guest cart from cookie:", error);
    return null;
  }
}

/**
 * Clear guest cart data from cookies
 * If cartId provided, clears that specific cart, otherwise clears current cart
 */
export function clearGuestCartFromCookie(cartId?: string): void {
  try {
    const targetCartId = cartId || getCurrentCartId();
    if (targetCartId) {
      const cartKey = `${CART_COOKIE_KEY_PREFIX}${targetCartId}`;
      deleteCookie(cartKey);
    }
    
    // Clear current cart ID if clearing current cart
    if (!cartId) {
      deleteCookie(CURRENT_CART_ID_KEY);
    }
  } catch (error: unknown) {
    // Silently handle cookie clear errors
    console.error("Error clearing guest cart from cookie:", error);
  }
}

/**
 * Get current cart ID (for use in navigation)
 */
export function getCartId(): string | null {
  return getCurrentCartId();
}

