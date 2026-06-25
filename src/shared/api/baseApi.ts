import {
  createApi,
  fetchBaseQuery,
  type FetchArgs,
  type FetchBaseQueryError,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query/react'
import { removeToken } from '@/shared/lib/jwt'

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY ?? 'access_token'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

const baseQueryWith401: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extra) => {
  const result = await rawBaseQuery(args, api, extra)
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    removeToken()
    window.location.href = '/login'
  }
  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWith401,
  tagTypes: ['Product', 'Category', 'SubCategory', 'Brand', 'Color', 'User', 'Role'],
  endpoints: () => ({}),
})
