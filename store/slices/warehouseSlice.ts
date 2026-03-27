import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getWarehouses, type Warehouse } from "@/lib/api/warehouseService";

interface WarehouseState {
  data: Warehouse[];
  loading: boolean;
  error: string | null;
}

const initialState: WarehouseState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchWarehouses = createAsyncThunk(
  "warehouses/fetchWarehouses",
  async (_, { rejectWithValue }) => {
    try {
      return await getWarehouses();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch warehouses";
      return rejectWithValue(message);
    }
  }
);

const warehouseSlice = createSlice({
  name: "warehouses",
  initialState,
  reducers: {
    clearWarehouses: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch warehouses";
      });
  },
});

export const { clearWarehouses } = warehouseSlice.actions;
export default warehouseSlice.reducer;
