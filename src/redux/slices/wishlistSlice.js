import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addWishlistItem, getWishlist, removeWishlistItem } from "@/lib/api/wishlist";

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    return await getWishlist();
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to load wishlist");
  }
});

export const addItemToWishlist = createAsyncThunk(
  "wishlist/addItemToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      return await addWishlistItem(productId);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to add to wishlist");
    }
  },
);

export const removeItemFromWishlist = createAsyncThunk(
  "wishlist/removeItemFromWishlist",
  async (id, { rejectWithValue }) => {
    try {
      await removeWishlistItem(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to remove from wishlist");
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload?.wishlist) ? action.payload.wishlist : [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load wishlist";
      })
      .addCase(addItemToWishlist.fulfilled, (state, action) => {
        const item = action.payload?.wishlist;
        if (item && !state.items.some((existing) => existing._id === item._id)) {
          state.items.push(item);
        }
      })
      .addCase(removeItemFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
