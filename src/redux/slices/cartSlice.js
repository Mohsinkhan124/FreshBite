import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCartItem, clearCartItems, getCart, removeCartItem, updateCartItem } from "@/lib/api/cart";

const initialState = {
  items: [],
  grandTotal: 0,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  isDrawerOpen: false,
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    return await getCart();
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to load cart");
  }
});

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ product, quantity = 1 }, { rejectWithValue }) => {
    try {
      return await addCartItem({ product, quantity });
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to add to cart");
    }
  },
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const data = await updateCartItem(id, quantity);
      return { id, cart: data?.cart };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update quantity");
    }
  },
);

export const removeItemFromCart = createAsyncThunk("cart/removeItemFromCart", async (id, { rejectWithValue }) => {
  try {
    await removeCartItem(id);
    return id;
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to remove item");
  }
});

export const clearCart = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    await clearCartItems();
    return true;
  } catch (error) {
    return rejectWithValue(error?.message || "Failed to clear cart");
  }
});

/** Defensive recalculation in case a response ever omits grandTotal. */
function recalcTotal(items) {
  return items.reduce((sum, item) => sum + (item.priceAtTime ?? item.product?.price ?? 0) * item.quantity, 0);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart() {
      return initialState;
    },
    openCartDrawer(state) {
      state.isDrawerOpen = true;
    },
    closeCartDrawer(state) {
      state.isDrawerOpen = false;
    },
    toggleCartDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload?.cartItems) ? action.payload.cartItems : [];
        state.grandTotal = Number(action.payload?.grandTotal ?? recalcTotal(state.items));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load cart";
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const cart = action.payload?.cart;
        if (!cart) return;
        const index = state.items.findIndex((item) => item._id === cart._id);
        if (index >= 0) state.items[index] = cart;
        else state.items.push(cart);
        state.grandTotal = recalcTotal(state.items);
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { id, cart } = action.payload;
        const index = state.items.findIndex((item) => item._id === id);
        if (index >= 0 && cart) state.items[index] = cart;
        state.grandTotal = recalcTotal(state.items);
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.grandTotal = recalcTotal(state.items);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.grandTotal = 0;
      });
  },
});

export const { resetCart, openCartDrawer, closeCartDrawer, toggleCartDrawer } = cartSlice.actions;
export default cartSlice.reducer;
