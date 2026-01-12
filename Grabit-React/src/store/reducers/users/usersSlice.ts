import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'src/utils/axios'

/* ================== Types ================== */
interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
}

interface UsersResponse {
  users: User[]
  page: number
  pages: number
  total: number
}

interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
  page: number
  pages: number
  total: number
}

interface CreateUserPayload {
  name: string
  email: string
  password: string
  phone?: string
  role?: string
}

interface UpdateUserPayload {
  userId?: string // اختياري، admin/owner يمكنهم تعديل أي مستخدم
  name?: string
  email?: string
  phone?: string
  role?: string
}

interface DeleteUserPayload {
  userId?: string // اختياري، admin/owner يمكنهم حذف أي مستخدم
}

/* ================== Async Thunks ================== */

// جلب المستخدمين مع pagination
export const fetchUsers = createAsyncThunk<
  UsersResponse,
  { page?: number; limit?: number },
  { rejectValue: string }
>('users/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const res = await axios.get('/auth/users', { params })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل جلب المستخدمين')
  }
})

// إنشاء مستخدم جديد
export const createUser = createAsyncThunk<
  User,
  CreateUserPayload,
  { rejectValue: string }
>('users/createUser', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/auth/register', data)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل إنشاء المستخدم')
  }
})

// تعديل مستخدم
export const updateUser = createAsyncThunk<
  User,
  UpdateUserPayload,
  { rejectValue: string }
>('users/updateUser', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.put('/auth/user', data)
    return res.data.user
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل تعديل المستخدم')
  }
})

// حذف مستخدم
export const deleteUser = createAsyncThunk<
  string,
  DeleteUserPayload,
  { rejectValue: string }
>('users/deleteUser', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.delete('/auth/user', { data })
    return res.data.message
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل حذف المستخدم')
  }
})

/* ================== Initial State ================== */
const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  total: 0
}

/* ================== Slice ================== */
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersState: state => {
      state.users = []
      state.loading = false
      state.error = null
      state.page = 1
      state.pages = 1
      state.total = 0
    }
  },
  extraReducers: builder => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.loading = false
        state.users = action.payload.users
        state.page = action.payload.page
        state.pages = action.payload.pages
        state.total = action.payload.total
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })
      // createUser
      .addCase(createUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.users.unshift(action.payload) // إضافة المستخدم الجديد في البداية
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })
      // updateUser
      .addCase(updateUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        const index = state.users.findIndex(u => u.id === action.payload.id)
        if (index !== -1) state.users[index] = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })
      // deleteUser
      .addCase(deleteUser.pending, state => {
        state.loading = true
        state.error = null
      })
   .addCase(deleteUser.fulfilled, (state, action) => {
  state.loading = false
  const userId = (action.meta.arg as DeleteUserPayload).userId
  if (userId) {
    state.users = state.users.filter(u => u.id !== userId)
  }
})

      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })
  }
})

export const { clearUsersState } = usersSlice.actions
export default usersSlice.reducer
