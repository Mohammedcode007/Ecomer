import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/utility/axios";

/* ================== Types ================== */

export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface WishlistResponse {
  page: number;
  limit: number;
  totalPages: number;
  totalProducts: number;
  products: Product[];
}

interface ToggleWishlistPayload {
  productId: string;
}

interface WishlistState {
  products: Product[];
  page: number;
  limit: number;
  totalPages: number;
  totalProducts: number;
  loading: boolean;
  error: string | null;
}

/* ================== Initial State ================== */

const initialState: WishlistState = {
  products: [],
  page: 1,
  limit: 10,
  totalPages: 0,
  totalProducts: 0,
  loading: false,
  error: null,
};

/* ================== Async Thunks ================== */

// جلب المفضلة مع Pagination
export const getWishlist = createAsyncThunk<
  WishlistResponse,
  { page?: number; limit?: number } | void, // يمكن تمرير كائن أو لا شيء
  { rejectValue: string }
>(
  "wishlist/getWishlist",
  async (params, { rejectWithValue }) => {
    // params قد يكون undefined
    try {
      const query = params
        ? `?page=${params.page ?? ""}&limit=${params.limit ?? ""}`
        : "";

      const { data } = await axios.get(`/wishlist${query}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "فشل في جلب المفضلة"
      );
    }
  }
);


// إضافة / إزالة من المفضلة (Toggle)
export const toggleWishlist = createAsyncThunk<
  Product[],
  ToggleWishlistPayload,
  { rejectValue: string }
>("wishlist/toggleWishlist", async ({ productId }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put("/wishlist/toggle", { productId });
    return data.products;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "فشل في تحديث المفضلة"
    );
  }
});

/* ================== Slice ================== */

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist(state) {
      state.products = [];
      state.totalProducts = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== Get Wishlist ===== */
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* ===== Toggle Wishlist ===== */
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.totalProducts = action.payload.length;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

/* ================== Exports ================== */

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
