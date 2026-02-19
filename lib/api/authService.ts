// lib/api/authService.ts
import axios, { AxiosError } from "axios";
import { getCountryCodeFromPhoneNumber, getNationalNumberFromPhoneNumber } from "@/lib/utils/phoneValidation";

// Base API URL from environment or default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089/api";

// Common Response Format (as per API documentation)
export interface CommonResponse<T = unknown> {
  message: string;
  data: T | null;
  success: boolean;
}

// Request DTOs
export interface AuthForm {
  username: string;
  password: string;
}

export interface CreateCustomUserDto {
  firstName: string;
  lastName: string;
  mobilePhoneNumber: string;
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
}

export interface RequestBodyWithEmail {
  email: string;
}

export interface VerifyEmailWithOTP {
  email: string;
  otp: string;
}

export interface ResetPasswordWithOTP {
  otp: string;
  password: string;
  email: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

// Response Data Types
export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponseData {
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RefreshTokenResponseData {
  access_token: string;
  refresh_token: string;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate axios instance for unauthenticated requests (like refresh token)
const unauthenticatedApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to extract error message
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<CommonResponse>;
    return axiosError.response?.data?.message || error.message || "An error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

// Strip sensitive fields from profile/user API responses (e.g. password must never reach client state)
const SENSITIVE_KEYS = ["password", "passwordHash", "refreshToken", "accessToken", "access_token", "refresh_token"];

function sanitizeUserProfile<T extends Record<string, unknown>>(data: T): T {
  const out = { ...data };
  for (const key of SENSITIVE_KEYS) {
    if (key in out) {
      delete out[key];
    }
  }
  return out as T;
}

/** Normalize profile from API so Redux store always gets consistent shape (id string, avatar from media if needed, fullName from firstName+lastName, phoneCountryCode from mobile number). */
function normalizeProfileForStore(data: Record<string, unknown>): UserProfile {
  const sanitized = sanitizeUserProfile(data);
  const id = sanitized.id != null ? String(sanitized.id) : "";
  const media = sanitized.media != null ? String(sanitized.media) : null;
  const avatar = (sanitized.avatar != null && String(sanitized.avatar).trim() !== "")
    ? String(sanitized.avatar)
    : media;
  const firstName = sanitized.firstName != null ? String(sanitized.firstName).trim() : "";
  const lastName = sanitized.lastName != null ? String(sanitized.lastName).trim() : "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || undefined;
  const mobile = sanitized.mobilePhoneNumber != null ? String(sanitized.mobilePhoneNumber).trim() : "";
  const phoneCountryCode = mobile ? getCountryCodeFromPhoneNumber(mobile) : undefined;
  const phoneNumber = mobile ? getNationalNumberFromPhoneNumber(mobile) : undefined;
  return {
    ...sanitized,
    id,
    avatar: avatar ?? undefined,
    fullName,
    phoneCountryCode: phoneCountryCode ?? undefined,
    phoneNumber: phoneNumber ?? undefined,
  } as UserProfile;
}

export const authService = {
  /**
   * Login user with username and password
   * POST /auth/login
   */
  async login(credentials: AuthForm): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await apiClient.post<CommonResponse<LoginResponseData>>(
        "/auth/login",
        credentials
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Login failed");
      }

      // Convert snake_case to camelCase for consistency
      return {
        accessToken: response.data.data.access_token,
        refreshToken: response.data.data.refresh_token,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Register new user
   * POST api/auth/register
   */
  async register(credentials: CreateCustomUserDto): Promise<RegisterResponseData> {
    try {
      const response = await apiClient.post<CommonResponse<RegisterResponseData>>(
        "/auth/register",
        credentials
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed");
      }

      return response.data.data || { message: response.data.message };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Refresh access token
   * POST /auth/refresh-token
   * Payload: { access_token: string, refresh_token: string }
   * Note: This request should NOT include Authorization header
   */
  async refreshToken(
    accessToken: string,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Use unauthenticatedApiClient to avoid adding Authorization header
      const response = await unauthenticatedApiClient.post<CommonResponse<RefreshTokenResponseData>>(
        "/auth/refresh-token",
        {
          access_token: accessToken,
          refresh_token: refreshToken,
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Token refresh failed");
      }

      // Convert snake_case to camelCase for consistency
      return {
        accessToken: response.data.data.access_token,
        refreshToken: response.data.data.refresh_token,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Send forget password email
   * POST api/auth/forget-password
   */
  async forgetPassword(email: string): Promise<void> {
    try {
      const response = await apiClient.post<CommonResponse>(
        "/auth/forget-password",
        { email }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send reset email");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Verify forget password OTP
   * POST api/auth/verify-forget-password-otp
   */
  async verifyForgetPasswordOTP(email: string, otp: string): Promise<void> {
    try {
      const response = await apiClient.post<CommonResponse>(
        "/auth/verify-forget-password-otp",
        { email, otp }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Reset password with OTP
   * POST /auth/reset-password
   */
  async resetPassword(email: string, otp: string, password: string): Promise<void> {
    try {
      const response = await apiClient.post<CommonResponse>(
        "/auth/reset-password",
        { otp, password, email }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Change password (requires authentication)
   * POST api/auth/change-password
   */
  async changePassword(oldPassword: string, newPassword: string, token: string): Promise<void> {
    try {
      const response = await apiClient.post<CommonResponse>(
        "/auth/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Password change failed");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Verify email with OTP
   * POST api/auth/verify-email
   */
  async verifyEmail(email: string, otp: string): Promise<void> {
    try {
      const response = await apiClient.post<CommonResponse>(
        "/auth/verify-email",
        { email, otp }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Email verification failed");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Resend email verification OTP
   * POST api/auth/verify-email-resend-otp
   */
  async resendEmailVerificationOTP(email: string): Promise<void> {
    try {
      const response = await apiClient.post<CommonResponse>(
        "/auth/verify-email-resend-otp",
        { email }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Send mail (generic)
   * POST api/auth/send-mail
   */
  async sendMail(email: string): Promise<void> {
    try {
      const response = await apiClient.post<CommonResponse>(
        "/auth/send-mail",
        { email }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send email");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get user profile details
   * GET /secure/profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<CommonResponse<UserProfile>>(
        "/secure/profile"
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Failed to fetch profile");
      }

      return normalizeProfileForStore(response.data.data as Record<string, unknown>);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update user profile
   * PATCH /secure/profile
   */
  async updateProfile(data: UpdateProfileDto): Promise<UserProfile> {
    try {
      const response = await apiClient.patch<CommonResponse<UserProfile>>(
        "/secure/profile",
        data
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Failed to update profile");
      }

      return normalizeProfileForStore(response.data.data as Record<string, unknown>);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Upload profile picture (multipart)
   * POST /user/profile-picture
   * Payload: files (binary), id (user id)
   * Reports upload progress via onProgress(0-100).
   */
  async uploadProfileImage(
    file: File,
    userId: string,
    onProgress?: (percent: number) => void
  ): Promise<UserProfile> {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("id", userId);

    try {
      const response = await apiClient.post<CommonResponse<UserProfile>>(
        "/user/profile-picture",
        formData,
        {
          onUploadProgress: (event) => {
            if (!onProgress) return;
            const total = (event.total != null && event.total > 0) ? event.total : file.size;
            if (!total || total <= 0) return;
            const percent = Math.min(99, Math.max(0, Math.round((event.loaded / total) * 100)));
            onProgress(percent);
          },
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Failed to upload image");
      }

      if (onProgress) onProgress(100);
      return normalizeProfileForStore(response.data.data as Record<string, unknown>);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete profile picture
   * POST /user/profile-picture/delete/{id}
   */
  async deleteProfilePicture(userId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.post<CommonResponse<UserProfile>>(
        `/user/profile-picture/delete/${userId}`
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message ?? "Failed to delete profile picture");
      }
      return normalizeProfileForStore(response.data.data as Record<string, unknown>);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

// Update profile request (partial)
export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  mobilePhoneNumber?: string;
  avatar?: string | null;
}

// User Profile Interface
export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  /** Full name from firstName + lastName, set when profile is stored. */
  fullName?: string;
  /** Country code (e.g. US, IN) derived from mobile number dial code; set when profile is stored. */
  phoneCountryCode?: string;
  /** National number only (no country code), formatted; set when profile is stored. */
  phoneNumber?: string;
  email: string;
  name?: string;
  mobilePhoneNumber?: string;
  emailVerified?: boolean;
  avatar?: string;
  [key: string]: unknown; // Allow additional fields
}

/**
 * Build URL for viewing media by id (e.g. profile picture after upload).
 * GET /media/view/{id}
 */
export function getMediaViewUrl(mediaId: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  return `${base}/media/view/${mediaId}`;
}

/**
 * Fetch media image as Blob by calling GET /media/view/{id} with auth.
 * Use for profile avatar so the request includes the Bearer token.
 */
export async function fetchMediaBlob(mediaId: string): Promise<Blob> {
  const url = getMediaViewUrl(mediaId);
  const response = await apiClient.get<Blob>(url, { responseType: "blob" });
  return response.data;
}

/**
 * Use as img src for avatar: if avatar is a media id (no http), use media view URL.
 */
export function getAvatarUrl(avatar: string | undefined | null): string | null {
  if (!avatar || !avatar.trim()) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return getMediaViewUrl(avatar);
}

// Export axios instance for use in interceptors
export { apiClient };
