import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "../../types/Order";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: JSON.parse(localStorage.getItem("orders") || "[]"),
  loading: false,
  error: null,
};

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (order: Omit<Order, "_id" | "createdAt">, { rejectWithValue }) => {
    try {
      const orders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
      const newOrder: Order = {
        ...order,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      return newOrder;
    } catch (error: any) {
      return rejectWithValue("Failed to place order");
    }
  }
);

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const orders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
  return orders;
});

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (order: Order, { rejectWithValue }) => {
    try {
      let orders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
      orders = orders.map((o) => (o._id === order._id ? order : o));
      localStorage.setItem("orders", JSON.stringify(orders));
      return order;
    } catch (error: any) {
      return rejectWithValue("Failed to update order");
    }
  }
);


export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (_id: string, { rejectWithValue }) => {
    try {
      let orders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
      orders = orders.filter((o) => o._id !== _id);
      localStorage.setItem("orders", JSON.stringify(orders));
      return _id;
    } catch (error: any) {
      return rejectWithValue("Failed to delete order");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.orders = action.payload;
      })

    
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })

    
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<string>) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      });
  },
});

export default orderSlice.reducer;
