import { baseApi } from '@/shared/api/baseApi'
import type { Paginated, Color, ColorFilters } from '@/shared/api/types'

export const colorsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getColors: b.query<Paginated<Color>, ColorFilters | void>({
      query: (params) => ({ url: '/Color/get-colors', params: params ?? {} }),
      providesTags: ['Color'],
    }),
    addColor: b.mutation<unknown, string>({
      query: (ColorName) => ({ url: '/Color/add-color', method: 'POST', params: { ColorName } }),
      invalidatesTags: ['Color'],
    }),
    updateColor: b.mutation<unknown, { Id: number; ColorName: string }>({
      query: (params) => ({ url: '/Color/update-color', method: 'PUT', params }),
      invalidatesTags: ['Color'],
    }),
    deleteColor: b.mutation<unknown, number>({
      query: (id) => ({ url: '/Color/delete-color', method: 'DELETE', params: { id } }),
      invalidatesTags: ['Color'],
    }),
  }),
})

export const {
  useGetColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorsApi
