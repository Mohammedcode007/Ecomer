import axios from '@/utility/axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

/* ================== Types ================== */

// الفئة الفرعية
export interface SubCategory {
  _id: string
  name: string
  description?: string
  productsCount?: number
    icon?: string

}

// الفئة الرئيسية
export interface Category {
  _id: string
  name: string
  description?: string
  parent?: string | null
  productsCount?: number
  subCategories?: SubCategory[]
    icon?: string


}

// Response جلب كل الفئات
interface CategoriesResponse {
  categories: Category[] | Category[]
}

// حالة الـ Slice
interface CategoriesState {
  categories: Category[]
  loading: boolean
  error: string | null
}

/* ================== Payloads ================== */

interface CreateCategoryPayload {
  name: string
  description?: string
  parent?: string | null
}

interface UpdateCategoryPayload {
  categoryId: string
  name?: string
  description?: string
  parent?: string | null
}

interface DeleteCategoryPayload {
  categoryId: string
}

/* ================== Async Thunks ================== */

// جلب جميع الفئات (رئيسية + فرعية + عدد المنتجات)
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/categories')
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل جلب الفئات')
  }
})
export const fetchSubCategories = createAsyncThunk<
  { parentId: string; subCategories: Category[] },
  string,
  { rejectValue: string }
>('categories/fetchSubCategories', async (parentId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/categories/${parentId}/children`)
    return { parentId, subCategories: res.data }
  } catch (err: any) {
    return rejectWithValue('فشل تحميل الفئات الفرعية')
  }
})

// جلب فئة واحدة بالـ ID
export const fetchCategoryById = createAsyncThunk<
  { category: Category; subCategories: Category[] },
  string,
  { rejectValue: string }
>('categories/fetchCategoryById', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/categories/${id}`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل جلب الفئة')
  }
})

// إنشاء فئة جديدة
export const createCategory = createAsyncThunk<
  Category,
  CreateCategoryPayload,
  { rejectValue: string }
>('categories/createCategory', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/categories', data)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل إنشاء الفئة')
  }
})

// تعديل فئة
export const updateCategory = createAsyncThunk<
  Category,
  UpdateCategoryPayload,
  { rejectValue: string }
>('categories/updateCategory', async ({ categoryId, ...data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/categories/${categoryId}`, data)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل تعديل الفئة')
  }
})

// حذف فئة
export const deleteCategory = createAsyncThunk<
  string,
  DeleteCategoryPayload,
  { rejectValue: string }
>('categories/deleteCategory', async ({ categoryId }, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`/categories/${categoryId}`)
    return res.data.message
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل حذف الفئة')
  }
})

/* ================== Initial State ================== */

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null
}

/* ================== Slice ================== */

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoriesState: state => {
      state.categories = []
      state.loading = false
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })

      // createCategory
      .addCase(createCategory.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false
        state.categories.unshift(action.payload)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })
.addCase(fetchSubCategories.fulfilled, (state, action) => {
  const parent = state.categories.find(c => c._id === action.payload.parentId)
  if (parent) {
    parent.subCategories = action.payload.subCategories
  }
})

      // updateCategory
      .addCase(updateCategory.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false
        const index = state.categories.findIndex(c => c._id === action.payload._id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })

      // deleteCategory
      .addCase(deleteCategory.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false
        const deletedId = (action.meta.arg as DeleteCategoryPayload).categoryId
        state.categories = state.categories.filter(c => c._id !== deletedId)
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })
  }
})

/* ================== Exports ================== */

export const { clearCategoriesState } = categoriesSlice.actions
export default categoriesSlice.reducer
