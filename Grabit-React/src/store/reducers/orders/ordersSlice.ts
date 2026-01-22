import axios from '@/utility/axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

/* ================== Types ================== */

type OrderStatus =
  | "pending"
  | "processing"
  | "inway"
  | "completed"
  | "cancelled";


export type PaymentStatus = 'pending' | 'paid'

export interface OrderItem {
  product: {
    _id: string
    name: string
    price: number
    images?: string[]
  }
  size: string
  quantity: number
  price: number
}

export interface Address {
  _id: string
  city: string
  street: string
  phone: string
}

export interface Order {
  _id: string
  user: string
  items: OrderItem[]
  totalPrice: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  address: Address
  createdAt: string
}

/* ================== State ================== */

interface OrdersState {
  orders: Order[]
  selectedOrder: Order | null
  loading: boolean
  error: string | null
}

/* ================== Payloads ================== */

interface CreateOrderPayload {
  addressId: string
}

interface UpdateOrderStatusPayload {
  orderId: string
  status: OrderStatus
}

interface DeleteOrderPayload {
  orderId: string
}

/* ================== Async Thunks ================== */

// إنشاء طلب
export const createOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: string }
>('orders/createOrder', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post('/orders', data)
    return res.data.order
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل إنشاء الطلب')
  }
})

// جلب طلباتي
export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>('orders/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/orders')
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل جلب الطلبات')
  }
})

// جلب طلب واحد
export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>('orders/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/orders/${id}`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل جلب الطلب')
  }
})

// تحديث حالة الطلب (Admin)
export const updateOrderStatus = createAsyncThunk<
  Order,
  UpdateOrderStatusPayload,
  { rejectValue: string }
>('orders/updateOrderStatus', async ({ orderId, status }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/orders/${orderId}/status`, { status })
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل تحديث الحالة')
  }
})

// تأكيد الدفع كاش
export const confirmCashPayment = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>('orders/confirmCashPayment', async (orderId, { rejectWithValue }) => {
  try {
const res = await axios.put(`/orders/${orderId}/confirm-payment`, {})
    return res.data.order
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل تأكيد الدفع')
  }
})

// حذف طلب
export const deleteOrder = createAsyncThunk<
  string,
  DeleteOrderPayload,
  { rejectValue: string }
>('orders/deleteOrder', async ({ orderId }, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`/orders/${orderId}`)
    return res.data.message
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'فشل حذف الطلب')
  }
})

/* ================== Initial State ================== */

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null
}

/* ================== Slice ================== */

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersState: state => {
      state.orders = []
      state.selectedOrder = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: builder => {
    builder

      // createOrder
      .addCase(createOrder.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        state.orders.unshift(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })

      // fetchMyOrders
      .addCase(fetchMyOrders.pending, state => {
        state.loading = true
      })
      .addCase(fetchMyOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'حدث خطأ غير متوقع'
      })

      // fetchOrderById
      .addCase(fetchOrderById.pending, state => {
        state.loading = true
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        state.selectedOrder = action.payload
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload
        }
      })

      // confirmCashPayment
      .addCase(confirmCashPayment.fulfilled, (state, action: PayloadAction<Order>) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
      })

      // deleteOrder
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const deletedId = (action.meta.arg as DeleteOrderPayload).orderId
        state.orders = state.orders.filter(o => o._id !== deletedId)
      })
  }
})

/* ================== Exports ================== */

export const { clearOrdersState } = ordersSlice.actions
export default ordersSlice.reducer
