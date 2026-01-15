import axios from '@/utility/axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

/* ================== Types ================== */

/* Hero Section */
export interface HeroItem {
  title: string
  description?: string
  image: string
  link?: string
}

/* Generic Section */
export interface SectionItem {
  title: string
  _id:string
  discountPercentage?:string
  description?: string
  image?: string
  link?: string
}

/* Feature */
export interface FeatureItem {
  title: string
  description?: string
  icon?: string
    _id:string

}

/* Homepage Model */
export interface Homepage {
  _id: string
  mainTitle?:string
  whatsappNumber?:string
  phoneNumber?:string
  heroSection: HeroItem[]
  sections: SectionItem[]
  promoSections: SectionItem[]
  features: FeatureItem[]
  textImageSections: SectionItem[]
  createdAt?: string
  updatedAt?: string
}

/* Slice State */
interface HomepageState {
  data: Homepage | null
  loading: boolean
  error: string | null
}

/* ================== Async Thunks ================== */

/* جلب بيانات الصفحة الرئيسية */
export const fetchHomepage = createAsyncThunk<
  Homepage,
  void,
  { rejectValue: string }
>('homepage/fetchHomepage', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/home')
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل جلب بيانات الصفحة الرئيسية')
  }
})

/* إنشاء أو تحديث الصفحة الرئيسية بالكامل */
export const createOrUpdateHomepage = createAsyncThunk<
  Homepage,
  Partial<Homepage>,
  { rejectValue: string }
>('homepage/createOrUpdateHomepage', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/home', data)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل حفظ بيانات الصفحة الرئيسية')
  }
})

/* تحديث قسم معين (مع أو بدون index) */
interface UpdateSectionPayload {
  section: string
  index?: number
  data: any
}

export const updateHomepageSection = createAsyncThunk<
  any,
  UpdateSectionPayload,
  { rejectValue: string }
>('homepage/updateHomepageSection', async ({ section, index, data }, { rejectWithValue }) => {
  try {
    const url =
      index !== undefined
        ? `/home/${section}/${index}`
        : `/home/${section}`

    const res = await axios.put(url, data)
    return { section, index, result: res.data }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل تحديث القسم')
  }
})

/* حذف عنصر من قسم */
interface DeleteSectionItemPayload {
  section: string
  index: number
}

export const deleteHomepageSectionItem = createAsyncThunk<
  { section: string; index: number },
  DeleteSectionItemPayload,
  { rejectValue: string }
>('homepage/deleteHomepageSectionItem', async ({ section, index }, { rejectWithValue }) => {
  try {
    await axios.delete(`/home/${section}/${index}`)
    return { section, index }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل حذف العنصر')
  }
})

/* ================== Initial State ================== */

const initialState: HomepageState = {
  data: null,
  loading: false,
  error: null
}

/* ================== Slice ================== */

const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    clearHomepageState: state => {
      state.data = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      /* fetchHomepage */
      .addCase(fetchHomepage.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHomepage.fulfilled, (state, action: PayloadAction<Homepage>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchHomepage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })

      /* createOrUpdateHomepage */
      .addCase(createOrUpdateHomepage.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrUpdateHomepage.fulfilled, (state, action: PayloadAction<Homepage>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(createOrUpdateHomepage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })

      /* updateHomepageSection */
      .addCase(updateHomepageSection.fulfilled, (state, action) => {
        if (!state.data) return

        const { section, index, result } = action.payload

        if (index !== undefined && Array.isArray(state.data[section])) {
          state.data[section][index] = result
        } else {
          state.data[section] = result
        }
      })

      /* deleteHomepageSectionItem */
      .addCase(deleteHomepageSectionItem.fulfilled, (state, action) => {
        if (!state.data) return

        const { section, index } = action.payload
        if (Array.isArray(state.data[section])) {
          state.data[section].splice(index, 1)
        }
      })
  }
})

/* ================== Exports ================== */

export const { clearHomepageState } = homepageSlice.actions
export default homepageSlice.reducer
