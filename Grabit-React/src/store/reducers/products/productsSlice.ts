import axios from '@/utility/axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

/* ================== Types ================== */

export interface ProductSize {
  size: string
  stock: number
}
// أضف هذا النوع
type StatusType = 'topSelling' | 'topRated' | 'trendingItems' | 'newArrivals' | 'dealOfTheDay'

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

export interface ProductsByStatus {
  products: Product[]
  page: number
  limit: number
  totalPages: number
  totalProducts: number
}
export interface ProductsByCategoryResponse {
  category: string
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  products: Product[]
}

interface ProductsState {
  products: Product[]
  loading: boolean
  error: string | null
  page: number
  limit: number
  totalPages: number 
  totalProducts: number
  currentProductLoading: boolean
  currentProductError: string | null
  createProductLoading: boolean
  createProductError: string | null
  updateProductLoading: boolean
  updateProductError: string | null
  deleteProductLoading: boolean
  deleteProductError: string | null
statusProducts: {
  topSelling: ProductsByStatus | null
  topRated: ProductsByStatus | null
  trendingItems: ProductsByStatus | null
  newArrivals: ProductsByStatus | null
  dealOfTheDay: ProductsByStatus | null
  loading: boolean
  error: string | null
}

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
export const fetchProductsByCategory = createAsyncThunk<
  ProductsByCategoryResponse,
  { categoryIds: string[]; page?: number; limit?: number },
  { rejectValue: string }
>(
  'products/fetchProductsByCategory',
  async ({ categoryIds, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      // تحويل المصفوفة إلى سلسلة تفصلها فاصلة
      const categoryIdsParam = categoryIds.join(',');
      const res = await axios.get(
        `/products/by-category`,
        { params: { categoryIds: categoryIdsParam, page, limit } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'فشل جلب المنتجات حسب الفئة'
      );
    }
  }
);


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

// جلب المنتجات حسب النوع (status)
export const fetchProductsByStatus = createAsyncThunk<
  { type: keyof ProductsState['statusProducts']; data: ProductsByStatus },
  { type: 'topSelling' | 'topRated' | 'trendingItems' | 'newArrivals' | 'dealOfTheDay'; page?: number; limit?: number },
  { rejectValue: string }
>('products/fetchProductsByStatus', async ({ type, page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const res = await axios.get('/products/status', { params: { type, page, limit } })
    return { type, data: res.data }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل جلب المنتجات حسب النوع')
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
  totalProducts: 0,
  currentProductLoading: false,
  currentProductError: null,
  createProductLoading: false,
  createProductError: null,
  updateProductLoading: false,
  updateProductError: null,
  deleteProductLoading: false,
  deleteProductError: null,
  statusProducts: {
    topSelling: null,
    topRated: null,
    trendingItems: null,
    newArrivals: null,
    dealOfTheDay: null,
    loading: false,
    error: null
  }
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
      state.currentProductLoading = false
      state.currentProductError = null
      state.createProductLoading = false
      state.createProductError = null
      state.updateProductLoading = false
      state.updateProductError = null
      state.deleteProductLoading = false
      state.deleteProductError = null
      state.statusProducts = {
        topSelling: null,
        topRated: null,
        trendingItems: null,
        newArrivals: null,
        dealOfTheDay: null,
        loading: false,
        error: null
      }
    }
  },
  extraReducers: builder => {
    builder
      // ============ Fetch Products ============
      .addCase(fetchProducts.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductsResponse>) => {
        state.loading = false
        state.products = action.payload.products
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.totalPages = action.payload.totalPages
        state.totalProducts = action.payload.totalProducts
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })
      // ============ Fetch Products By Category ============
.addCase(fetchProductsByCategory.pending, state => {
  state.loading = true
  state.error = null
})
.addCase(
  fetchProductsByCategory.fulfilled,
  (state, action: PayloadAction<ProductsByCategoryResponse>) => {
    state.loading = false
    state.products = action.payload.products
    state.page = action.payload.pagination.page
    state.limit = action.payload.pagination.limit
    state.totalPages = action.payload.pagination.totalPages
    state.totalProducts = action.payload.pagination.total
  }
)
.addCase(fetchProductsByCategory.rejected, (state, action) => {
  state.loading = false
  state.error = action.payload ?? 'حدث خطأ غير متوقع'
})


      // ============ Fetch Single Product ============
      .addCase(fetchProductById.pending, state => {
        state.currentProductLoading = true
        state.currentProductError = null
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.currentProductLoading = false
        const index = state.products.findIndex(p => p._id === action.payload._id)
        if (index === -1) state.products.push(action.payload)
        else state.products[index] = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentProductLoading = false
        state.currentProductError = action.payload ?? 'حدث خطأ غير متوقع'
      })

      // ============ Create Product ============
      .addCase(createProduct.pending, state => {
        state.createProductLoading = true
        state.createProductError = null
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.createProductLoading = false
        state.products.unshift(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createProductLoading = false
        state.createProductError = action.payload ?? 'حدث خطأ غير متوقع'
      })

      // ============ Update Product ============
      .addCase(updateProduct.pending, state => {
        state.updateProductLoading = true
        state.updateProductError = null
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.updateProductLoading = false
        const index = state.products.findIndex(p => p._id === action.payload._id)
        if (index !== -1) state.products[index] = action.payload
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateProductLoading = false
        state.updateProductError = action.payload ?? 'حدث خطأ غير متوقع'
      })

      // ============ Delete Product ============
      .addCase(deleteProduct.pending, state => {
        state.deleteProductLoading = true
        state.deleteProductError = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteProductLoading = false
        state.products = state.products.filter(p => p._id !== action.meta.arg)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteProductLoading = false
        state.deleteProductError = action.payload ?? 'حدث خطأ غير متوقع'
      })

      // ============ Fetch Products By Status ============
      .addCase(fetchProductsByStatus.pending, state => {
        state.statusProducts.loading = true
        state.statusProducts.error = null
      })
  .addCase(fetchProductsByStatus.fulfilled, (state, action) => {
  state.statusProducts.loading = false
  const { type, data } = action.payload
  const key = type as StatusType  // إخطار TypeScript بأن المفتاح صحيح
  state.statusProducts[key] = data
})

      .addCase(fetchProductsByStatus.rejected, (state, action) => {
        state.statusProducts.loading = false
        state.statusProducts.error = action.payload ?? 'حدث خطأ غير متوقع'
      })
  }
})

/* ================== Export ================== */

export const { clearProductsState } = productsSlice.actions
export default productsSlice.reducer
