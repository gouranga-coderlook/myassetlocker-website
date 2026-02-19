// lib/utils/jwtDecoder.ts
import type { User } from "@/store/slices/authSlice";

/**
 * Decode JWT token and extract payload
 */
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    
    return JSON.parse(jsonPayload);
  } catch (error: unknown) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Extract user information from access token
 */
export function extractUserFromToken(accessToken: string): User | null {
  const payload = decodeJWT(accessToken);
  if (!payload) return null;

  // Extract user info from JWT payload
  // Based on the JWT structure: sub, email, name, given_name, family_name, email_verified
  const userId = payload.sub as string;
  const email = (payload.email || payload.preferred_username) as string;
  const givenName = payload.given_name as string;
  const familyName = payload.family_name as string;
  const name = payload.name as string || `${givenName || ""} ${familyName || ""}`.trim() || email;
  const emailVerified = payload.email_verified as boolean ?? false;

  if (!userId || !email) {
    return null;
  }

  return {
    id: userId,
    email,
    name: name || email,
    firstName: givenName || name?.split(" ")[0] || undefined,
    lastName: familyName || name?.split(" ").slice(1).join(" ") || undefined,
    emailVerified,
  };
}

