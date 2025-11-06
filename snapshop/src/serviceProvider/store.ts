import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../serviceProvider/slices/authSlice";
import productReducer from "../serviceProvider/slices/productSlice";
import cartReducer from "../serviceProvider/slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

