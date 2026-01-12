import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'src/utils/axios'

/* ================== Types ================== */

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  id: string
  name: string
  email: string
  role: string
  token: string
  wishlist: any[]
  cart: any[]
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

/* ================== Async Thunk ================== */

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/auth/login', data)
    return res.data
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'فشل تسجيل الدخول'
    )
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
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
