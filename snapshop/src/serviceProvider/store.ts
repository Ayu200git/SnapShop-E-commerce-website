import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../serviceProvider/slices/authSlice";
import productReducer from "../serviceProvider/slices/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

