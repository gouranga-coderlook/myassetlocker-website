import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { authService, type UserProfile } from "@/lib/api/authService";
import { updateUser } from "./authSlice";

export interface ProfileState {
  profileData: UserProfile | null;
  loading: boolean;
  error: string | null;
  /** True while profile picture is uploading (show loading in header avatar). */
  avatarUploading: boolean;
  /** 0-100 while uploading avatar; null when idle. */
  avatarUploadProgress: number | null;
}

const initialState: ProfileState = {
  profileData: null,
  loading: false,
  error: null,
  avatarUploading: false,
  avatarUploadProgress: null,
};

/**
 * Fetches profile from API only when we don't already have it for the current user.
 * Keeps a single source of truth and avoids duplicate API calls.
 */
export const fetchProfileIfNeeded = createAsyncThunk<
  UserProfile | null,
  void,
  { state: RootState }
>(
  "profile/fetchProfileIfNeeded",
  async (_, { getState, dispatch }) => {
    const { auth, profile } = getState();
    const user = auth.user;
    if (!user?.id) return null;
    // Already have profile for this user
    if (profile.profileData?.id === user.id) return profile.profileData;

    const data = await authService.getProfile();
    dispatch(updateUser(data));
    return data;
  },
  {
    condition: (_, { getState }) => {
      const { auth, profile } = getState();
      if (!auth.user?.id) return false;
      if (profile.profileData?.id === auth.user.id) return false;
      if (profile.loading) return false;
      return true;
    },
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profileData = action.payload;
      state.error = null;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProfileError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.profileData = null;
      state.loading = false;
      state.error = null;
      state.avatarUploading = false;
      state.avatarUploadProgress = null;
    },
    setAvatarUploading: (state, action: PayloadAction<boolean>) => {
      state.avatarUploading = action.payload;
    },
    setAvatarUploadProgress: (state, action: PayloadAction<number | null>) => {
      state.avatarUploadProgress = action.payload;
    },
    setProfilePhoneCountryCode: (state, action: PayloadAction<string | null>) => {
      if (state.profileData) {
        state.profileData.phoneCountryCode = action.payload ?? undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileIfNeeded.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileIfNeeded.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload ?? null;
        state.error = null;
      })
      .addCase(fetchProfileIfNeeded.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load profile";
      })
      .addCase("auth/logout", (state) => {
        state.profileData = null;
        state.loading = false;
        state.error = null;
        state.avatarUploading = false;
        state.avatarUploadProgress = null;
      });
  },
});

export const { setProfile, setProfileLoading, setProfileError, clearProfile, setAvatarUploading, setAvatarUploadProgress, setProfilePhoneCountryCode } =
  profileSlice.actions;
export default profileSlice.reducer;
