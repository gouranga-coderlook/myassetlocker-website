import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | undefined;
  user: {
    id?: string;
    email?: string;
    name?: string;
  } | null;
}

const initialState: AuthState = {
  token: undefined,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | undefined>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = undefined;
      state.user = null;
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

