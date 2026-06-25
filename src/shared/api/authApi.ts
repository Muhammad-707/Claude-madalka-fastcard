import { baseApi } from '@/shared/api/baseApi'
import type { ApiEnvelope, LoginDto } from '@/shared/api/types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation<ApiEnvelope<string>, LoginDto>({
      query: (body) => ({
        url: '/Account/login',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
