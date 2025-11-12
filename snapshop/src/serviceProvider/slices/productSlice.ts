import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import type { Product } from "../../types/product";


interface ProductState {
  items: Product[];
  filtered: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  category: string;
  sortBy: "priceLow" | "priceHigh" | "rating" | "none";
}

const initialState: ProductState = {
  items: [],
  filtered: [],
  loading: false,
  error: null,
  searchTerm: "",
  category: "all",
  sortBy: "none",
};

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/products");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk<Product, number>(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk<Product, Omit<Product, "id">>(
  "products/add",
  async (product, { rejectWithValue }) => {
    try {
      const res = await api.post("/products", product);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk<Product, Product>(
  "products/update",
  async (product, { rejectWithValue }) => {
    try {
      const res = await api.put(`/products/${product.id}`, product);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk<number, number>(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


 

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setSortBy: (
      state,
      action: PayloadAction<"priceLow" | "priceHigh" | "rating" | "none">
    ) => {
      state.sortBy = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    applyFilters: (state) => {
      let filtered = [...state.items];

      if (state.searchTerm.trim()) {
        filtered = filtered.filter((p) =>
          p.title.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }

      if (state.category !== "all") {
        filtered = filtered.filter((p) => p.category === state.category);
      }

      if (state.sortBy === "priceLow") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (state.sortBy === "priceHigh") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (state.sortBy === "rating") {
        filtered.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
      }

      state.filtered = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index != -1){
           state.items[index] = action.payload;
           productSlice.caseReducers.applyFilters(state);
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        productSlice.caseReducers.applyFilters(state);
      });
  },
});

export const { setSearchTerm, setCategory, setSortBy, applyFilters } =
  productSlice.actions;

export default productSlice.reducer;
