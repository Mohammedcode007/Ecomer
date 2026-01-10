// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import authReducer from './auth/authSlice'
import usersReducer from './users/usersSlice'
import productsReducer from './products/productsSlice' // ✅ جديد
import categoriesReducer from './categories/categoriesSlice' // ✅ جديد
import ordersReducer from './orders/ordersSlice' // ✅ جديد


export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
        auth: authReducer,
            users: usersReducer,
    products: productsReducer ,
    categories:categoriesReducer,
        orders:ordersReducer




  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
