import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/utility/axios";

/* ===================== Types ===================== */

export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

interface ApplyCouponResponse {
  message: string;
  coupon: Coupon;
  totalDiscount: number;
}

interface CouponState {
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  totalDiscount: number;
  loading: boolean;
  error: string | null;
}

/* ===================== Initial State ===================== */

const initialState: CouponState = {
  coupons: [],
  appliedCoupon: null,
  totalDiscount: 0,
  loading: false,
  error: null,
};

/* ===================== Async Thunks ===================== */

/* جلب جميع الكوبونات */
export const getAllCoupons = createAsyncThunk(
  "coupon/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/coupon");
      return data.coupons;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

/* إنشاء كوبون */
export const createCoupon = createAsyncThunk(
  "coupon/create",
  async (
    payload: {
      code: string;
      discountPercentage: number;
      expiresAt: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post("/coupon", payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

/* حذف كوبون */
export const deleteCoupon = createAsyncThunk(
  "coupon/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/coupon/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

/* تطبيق كوبون */
export const applyCoupon = createAsyncThunk(
  "coupon/apply",
  async (code: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ApplyCouponResponse>(
        "/coupon/apply",
        { code }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

/* إزالة الكوبون */
export const removeCoupon = createAsyncThunk(
  "coupon/remove",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete("/coupon/remove");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

/* ===================== Slice ===================== */

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    resetCouponState: state => {
      state.appliedCoupon = null;
      state.totalDiscount = 0;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder

      /* ========== Get All ========== */
      .addCase(getAllCoupons.pending, state => {
        state.loading = true;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ========== Create ========== */
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload);
      })

      /* ========== Delete ========== */
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(
          coupon => coupon._id !== action.payload
        );
      })

      /* ========== Apply ========== */
      .addCase(applyCoupon.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.coupon;
        state.totalDiscount = action.payload.totalDiscount;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ========== Remove ========== */
      .addCase(removeCoupon.fulfilled, state => {
        state.appliedCoupon = null;
        state.totalDiscount = 0;
      });
  },
});

export const { resetCouponState } = couponSlice.actions;
export default couponSlice.reducer;
