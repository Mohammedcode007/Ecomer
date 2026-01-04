import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'src/utils/axios'

/* ================== Types ================== */

export interface ProductSize {
  size: string
  stock: number
}

export interface Category {
  _id: string
  name: string
  parent?: string | null
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  priceBeforeDiscount?: number
  hasDiscount: boolean
  colors: string[]
  images: string[]
  category: Category
  sizes: ProductSize[]
  stockQuantity: number
  ratingsAverage: number
  ratingsQuantity: number
  isMostPopular?: boolean
  createdAt: string
}

export interface ProductsResponse {
  products: Product[]
  page: number
  limit: number
  totalPages: number
  totalProducts: number
}

interface ProductsState {
  products: Product[]
  loading: boolean
  error: string | null
  page: number
  limit: number
  totalPages: number
  totalProducts: number
}

/* ================== Async Thunks ================== */

// جلب المنتجات (pagination + search + filters)
export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  {
    page?: number
    limit?: number
    search?: string
    sortPrice?: 'asc' | 'desc'
    discount?: 'true' | 'false'
    category?: string
  },
  { rejectValue: string }
>('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    const res = await axios.get('/products', { params })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل جلب المنتجات')
  }
})

// جلب منتج واحد
export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/products/${id}`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل جلب المنتج')
  }
})

// إنشاء منتج (Admin)
export const createProduct = createAsyncThunk<
  Product,
  Partial<Product>,
  { rejectValue: string }
>('products/createProduct', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/products', data)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل إنشاء المنتج')
  }
})

// تعديل منتج
export const updateProduct = createAsyncThunk<
  Product,
  { id: string; data: Partial<Product> },
  { rejectValue: string }
>('products/updateProduct', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/products/${id}`, data)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل تعديل المنتج')
  }
})

// حذف منتج
export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`/products/${id}`)
    return res.data.message
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل حذف المنتج')
  }
})

/* ================== Initial State ================== */

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  totalPages: 1,
  totalProducts: 0
}

/* ================== Slice ================== */

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsState: state => {
      state.products = []
      state.loading = false
      state.error = null
      state.page = 1
      state.limit = 10
      state.totalPages = 1
      state.totalProducts = 0
    }
  },
  extraReducers: builder => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<ProductsResponse>) => {
          state.loading = false
          state.products = action.payload.products
          state.page = action.payload.page
          state.limit = action.payload.limit
          state.totalPages = action.payload.totalPages
          state.totalProducts = action.payload.totalProducts
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })

      // fetchProductById
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p._id === action.payload._id)
        if (index === -1) state.products.push(action.payload)
      })

      // createProduct
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.unshift(action.payload)
      })

      // updateProduct
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p._id === action.payload._id)
        if (index !== -1) state.products[index] = action.payload
      })

      // deleteProduct
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.meta.arg)
      })
  }
})

/* ================== Export ================== */

export const { clearProductsState } = productsSlice.actions
export default productsSlice.reducer
