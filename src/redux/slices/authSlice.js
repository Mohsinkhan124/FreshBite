import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
  updateAvatar
} from "@/lib/api/auth";
import { STORAGE_KEYS } from "@/constants/config";
import { fetchCart, resetCart } from "./cartSlice";
import { fetchWishlist, resetWishlist } from "./wishlistSlice";

function persistSession(token, user) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEYS.token, token);
    window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  } catch { }
}

function clearSession() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEYS.token);
    window.localStorage.removeItem(STORAGE_KEYS.refreshToken);
    window.localStorage.removeItem(STORAGE_KEYS.user);
  } catch { }
}

const initialState = {
  user: null,
  status: "idle",
  error: null,
  initialized: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const data = await loginUser({ email, password });

      persistSession(data.token, data.user);

      dispatch(fetchCart());
      dispatch(fetchWishlist());

      return data.user;
    } catch (error) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    try {
      await registerUser({ name, email, password });

      const data = await loginUser({ email, password });

      persistSession(data.token, data.user);

      dispatch(fetchCart());
      dispatch(fetchWishlist());

      return data.user;
    } catch (error) {
      return rejectWithValue(error?.message || "Registration failed");
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProfile();
      return data.user;
    } catch (error) {
      return rejectWithValue(error?.message || "Session expired");
    }
  }
);

// ✅ NEW
export const editProfile = createAsyncThunk(
  "auth/editProfile",
  async (
    { name, email, phone, dateOfBirth, gender },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateProfile({
        name,
        email,
        phone,
        dateOfBirth,
        gender,
      });

      persistSession(
        localStorage.getItem(STORAGE_KEYS.token),
        data.user
      );

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Profile update failed"
      );
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await updateAvatar(formData);

      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.user));

      user.avatar = data.avatar.url;

      persistSession(
        localStorage.getItem(STORAGE_KEYS.token),
        user
      );

      return user;
    } catch (error) {
      return rejectWithValue(error?.message || "Avatar upload failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    clearSession();

    dispatch(resetCart());
    dispatch(resetWishlist());

    return true;
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    hydrateUser(state, action) {
      state.user = action.payload;
    },

    setInitialized(state) {
      state.initialized = true;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.initialized = true;
      })

      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.initialized = true;
      })

      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.initialized = true;
      })

      .addCase(fetchProfile.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.initialized = true;
      })

      // ✅ EDIT PROFILE
      .addCase(editProfile.pending, (state) => {
        state.status = "loading";
      })

      .addCase(editProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })

      .addCase(editProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
        state.initialized = true;
      });
  },
});

export const { hydrateUser, setInitialized } = authSlice.actions;

export default authSlice.reducer;