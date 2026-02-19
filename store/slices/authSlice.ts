import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  mobilePhoneNumber?: string;
  emailVerified?: boolean;
  avatar?: string;
}

interface AuthState {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  user: User | null;
  showAuthPopup: boolean;
  isLoading: boolean;
  /** True after auth has been restored from storage (or determined to be absent). Prevents flash of sign-in UI. */
  authHydrated: boolean;
}

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  user: null,
  showAuthPopup: false,
  isLoading: false,
  authHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setAccessToken: (state, action: PayloadAction<string | undefined>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string | undefined>) => {
      state.refreshToken = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setAuthData: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.user = null;
    },
    showAuthPopup: (state) => {
      state.showAuthPopup = true;
    },
    hideAuthPopup: (state) => {
      state.showAuthPopup = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthHydrated: (state, action: PayloadAction<boolean>) => {
      state.authHydrated = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setTokens,
  setAccessToken,
  setRefreshToken,
  setUser,
  setAuthData,
  logout,
  showAuthPopup,
  hideAuthPopup,
  setLoading,
  setAuthHydrated,
  updateUser,
} = authSlice.actions;
export default authSlice.reducer;

