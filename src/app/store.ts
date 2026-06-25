import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api/baseApi'
import authReducer from '@/features/auth/model/authSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (gdm) => gdm().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
