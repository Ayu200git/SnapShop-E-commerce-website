import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import type { CartItem, CartState } from "../../types/cart";

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
  loading: false,
  error: null,
};

export const fetchCarts = createAsyncThunk("cart/fetchAll", async () => {
  const res = await api.get("/carts");
  return res.data;
});

export const fetchCartById = createAsyncThunk(
  "cart/fetchById",
  async (id: number) => {
    const res = await api.get(`/carts/${id}`);
    return res.data;
  }
);

export const createCart = createAsyncThunk(
  "cart/create",
  async (cart: any) => {
    const res = await api.post("/carts", cart);
    return res.data;
  }
);

export const updateCart = createAsyncThunk(
  "cart/update",
  async (cart: any) => {
    const res = await api.put(`/carts/${cart.id}`, cart);
    return res.data;
  }
);

export const deleteCart = createAsyncThunk(
  "cart/delete",
  async (id: number) => {
    await api.delete(`/carts/${id}`);
    return id;
  }
);

const saveToLocalStorage = (items: CartItem[]) =>
  localStorage.setItem("cart", JSON.stringify(items));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
     addToCart: (state, action: PayloadAction<Omit<CartItem, "id">>) => {
  const newId = state.items.length
    ? Math.max(...state.items.map(i => i.id)) + 1
    : 1;

  const newItem: CartItem = { ...action.payload, id: newId };

  const existing = state.items.find((i) => i.id === newItem.id);
  if (existing) {
    existing.quantity += newItem.quantity;
  } else {
    state.items.push(newItem);
  }

  saveToLocalStorage(state.items);
},


    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
      saveToLocalStorage(state.items);
    },

    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) item.quantity -= 1;
        else state.items = state.items.filter((i) => i.id !== item.id);
      }
      saveToLocalStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveToLocalStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCarts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.loading = false;

        const apiItems: CartItem[] = action.payload.flatMap(
          (cart: { id: number;products: { productId: number; quantity: number }[] }) =>
            cart.products.map((apiItem) => ({
              id: apiItem.productId,
              quantity: apiItem.quantity,
              price: 0,
              title: `Product ${apiItem.productId}`,
              image: "",
            }))
        );

        state.items = apiItems;
        saveToLocalStorage(state.items);
      })
      .addCase(fetchCarts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch carts";
      })

      .addCase(createCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
        saveToLocalStorage(state.items);
      })

      .addCase(updateCart.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
        saveToLocalStorage(state.items);
      })

      .addCase(deleteCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        saveToLocalStorage(state.items);
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
