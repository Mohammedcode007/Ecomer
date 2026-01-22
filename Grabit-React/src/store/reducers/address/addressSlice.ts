import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utility/axios";

/* ================== Types ================== */

export interface Address {
  _id: string;
  user: string;
  name?: string;
  phone?: string;
  postalCode: string;
  details?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  street?: string;
}

interface AddressesState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

/* ================== Async Thunks ================== */

// جلب كل العناوين للمستخدم الحالي
export const fetchMyAddresses = createAsyncThunk<Address[], void, { rejectValue: string }>(
  "addresses/fetchMyAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/addresses/me");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "فشل جلب العناوين");
    }
  }
);

// إضافة عنوان جديد
export const addAddress = createAsyncThunk<Address, Partial<Address>, { rejectValue: string }>(
  "addresses/addAddress",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/addresses", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "فشل إضافة العنوان");
    }
  }
);

// تعديل عنوان
export const updateAddress = createAsyncThunk<
  Address,
  { id: string; data: Partial<Address> },
  { rejectValue: string }
>("addresses/updateAddress", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/addresses/${id}`, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "فشل تعديل العنوان");
  }
});

// حذف عنوان
export const deleteAddress = createAsyncThunk<string, string, { rejectValue: string }>(
  "addresses/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/addresses/${id}`);
      return id; // نعيد المعرف لحذف العنوان من الـ state
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "فشل حذف العنوان");
    }
  }
);

/* ================== Initial State ================== */

const initialState: AddressesState = {
  addresses: [],
  loading: false,
  error: null,
};

/* ================== Slice ================== */

const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    clearAddressesState: (state) => {
      state.addresses = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchMyAddresses
    builder.addCase(fetchMyAddresses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
      state.loading = false;
      state.addresses = action.payload;
    });
    builder.addCase(fetchMyAddresses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "حدث خطأ غير متوقع";
    });

    // addAddress
    builder.addCase(addAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addAddress.fulfilled, (state, action: PayloadAction<Address>) => {
      state.loading = false;
      state.addresses.unshift(action.payload); // إضافة في أول القائمة
    });
    builder.addCase(addAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "حدث خطأ غير متوقع";
    });

    // updateAddress
    builder.addCase(updateAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
      state.loading = false;
      const index = state.addresses.findIndex((a) => a._id === action.payload._id);
      if (index !== -1) state.addresses[index] = action.payload;
    });
    builder.addCase(updateAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "حدث خطأ غير متوقع";
    });

    // deleteAddress
    builder.addCase(deleteAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.addresses = state.addresses.filter((a) => a._id !== action.payload);
    });
    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "حدث خطأ غير متوقع";
    });
  },
});

/* ================== Exports ================== */

export const { clearAddressesState } = addressesSlice.actions;
export default addressesSlice.reducer;
