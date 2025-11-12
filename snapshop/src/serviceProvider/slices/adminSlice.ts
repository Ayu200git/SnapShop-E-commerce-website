import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AdminState {
  usersCount: number;
  productsCount: number;
  cartCount: number;
  revenue: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
}
const initialState: AdminState = {
  usersCount: 0,
  productsCount: 0,
  cartCount: 0,
  revenue: 0,
  status: "idle",
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  "admin/fetchDashboardData",
  async () => {
    const [usersRes, productsRes, cartsRes] = await Promise.all([
      fetch("https://fakestoreapi.com/users"),
      fetch("https://fakestoreapi.com/products"),
      fetch("https://fakestoreapi.com/carts"),
    ]);

    const [users, products, carts] = await Promise.all([
      usersRes.json(),
      productsRes.json(),
      cartsRes.json(),
    ]);

    const revenue = carts.reduce((total: number, cart: any) => {
      const cartValue = cart.products?.reduce(
        (sum: number, p: any) => sum + (p.price || 0) * (p.quantity || 1),
        0
      );
      return total + (cartValue || 0);
    }, 0);

    return {
      usersCount: users.length,
      productsCount: products.length,
      cartCount: carts.length,
      revenue: parseFloat(revenue.toFixed(2)),
    };
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchDashboardData.fulfilled,
        (state, action: PayloadAction<Omit<AdminState, "status" | "error">>) => {
          state.status = "succeeded";
          state.usersCount = action.payload.usersCount;
          state.productsCount = action.payload.productsCount;
          state.cartCount = action.payload.cartCount;
          state.revenue = action.payload.revenue;
        }
      )
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load dashboard";
      });
  },
});

export default adminSlice.reducer;
