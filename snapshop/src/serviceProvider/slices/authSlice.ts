import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import type { User, AuthState } from "../../types/user";
import { STORAGE_KEYS } from "../../constants";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const localUserData = localStorage.getItem(STORAGE_KEYS.USER);
      if (localUserData) {
        const user = JSON.parse(localUserData);
        if (user.username === credentials.username) {
          const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
          return { user, token };
        }
      }
      
      const res = await api.post("/auth/login", credentials);
      const { token } = res.data;

      const usersRes = await api.get("/users");
      const user = usersRes.data.find((u: any) => u.username === credentials.username);

      if (!user) throw new Error("User not found");

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);

      return { token, user };
    } catch (err: any) {
      return rejectWithValue("Invalid username or password");
    }
  }
);


export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    user: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        username: user.username,
        email: user.email,
      };

      const token = "fake-jwt-token-" + newUser.id;

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);

      return { user: newUser, token };
    } catch (error: any) {
      return rejectWithValue("Registration failed. Try again later.");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userData) throw new Error("No user found");
      const user: User = JSON.parse(userData);
      return user;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch user profile");
    }
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
    restoreSession: (state) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      if (token && userData) {
        state.isAuthenticated = true;
        state.token = token;
        state.user = JSON.parse(userData);
      }
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
