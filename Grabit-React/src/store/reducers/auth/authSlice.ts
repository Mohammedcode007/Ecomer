import axios from '@/utility/axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

/* ================== Types ================== */

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  phone: string
}

interface LoginResponse {
  id: string
  name: string
  email: string
  role: string
    phone?: string

  token: string
  wishlist: any[]
  cart: any[]
}

interface RegisterResponse {
  id: string
  name: string
  email: string
  phone: string
  role: string
  token: string
}

interface AuthState {
  user: {
    id: string
    name: string
    email: string
    role: string
  } | null
  token: string | null
  wishlist: any[]
  cart: any[]
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

/* ================== REGISTER ================== */

 const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/auth/register', {
      ...data,
      role: 'user'
    })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل إنشاء الحساب')
  }
})

/* ================== LOGIN ================== */

 const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/auth/login', data)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل تسجيل الدخول')
  }
})

/* ================== Initial State ================== */

const initialState: AuthState = {
  user: null,
  token: null,
  wishlist: [],
  cart: [],
  loading: false,
  error: null,
  isAuthenticated: false
}

/* ================== Slice ================== */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.wishlist = []
      state.cart = []
      localStorage.removeItem('token')
    }
  },
  extraReducers: builder => {
    builder
      /* ===== LOGIN ===== */
      .addCase(loginUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role
        }
        state.token = action.payload.token
        state.wishlist = action.payload.wishlist
        state.cart = action.payload.cart
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })

      /* ===== REGISTER ===== */
      .addCase(registerUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role
        }
        state.token = action.payload.token
        state.wishlist = []
        state.cart = []
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'فشل إنشاء الحساب'
      })
  }
})

export const { logout } = authSlice.actions
export { loginUser, registerUser }
export default authSlice.reducer
