import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/utility/axios";

/* ================== Types ================== */

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    sizes?: { size: string; stock: number }[];
  };
  size: string;
  quantity: number;
    coupon?: {
    _id: string;
    code: string;
    discountPercentage: number;
  } | null;

  discountAmount?: number;
}

interface CartResponse {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  items: CartItem[];
}

interface AddToCartPayload {
  productId: string;
  quantity?: number;
  size: string;
}

interface UpdateCartItemPayload {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

/* ================== Initial State ================== */

const initialState: CartState = {
  items: [],
  page: 1,
  limit: 10,
  totalPages: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

/* ================== Async Thunks ================== */

// جلب العربة مع Pagination
export const getCart = createAsyncThunk<
  CartResponse,
  { page?: number; limit?: number } | void,
  { rejectValue: string }
>("cart/getCart", async (params, { rejectWithValue }) => {
  try {
    const query = params
      ? `?page=${params.page ?? ""}&limit=${params.limit ?? ""}`
      : "";
    const { data } = await axios.get(`/cart${query}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "فشل في جلب العربة");
  }
});

// إضافة منتج للعربة
export const addToCart = createAsyncThunk<
  CartResponse,
  AddToCartPayload,
  { rejectValue: string }
>("cart/addToCart", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("/cart/add", payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "فشل في إضافة المنتج");
  }
});

// تحديث كمية منتج
export const updateCartItem = createAsyncThunk<
  CartResponse,
  UpdateCartItemPayload,
  { rejectValue: string }
>("cart/updateCartItem", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.put("/cart/update", payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "فشل في تعديل الكمية");
  }
});

// حذف منتج من العربة
export const removeFromCart = createAsyncThunk<
  CartResponse,
  string,
  { rejectValue: string }
>("cart/removeFromCart", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/cart/remove/${productId}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "فشل في حذف المنتج");
  }
});

/* ================== Slice ================== */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.totalItems = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== Get Cart ===== */
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* ===== Add to Cart ===== */
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* ===== Update Cart Item ===== */
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* ===== Remove From Cart ===== */
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

/* ================== Exports ================== */

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
