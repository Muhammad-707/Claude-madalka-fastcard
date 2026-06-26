import { baseApi } from '@/shared/api/baseApi'
import type { Paginated, Brand, BrandFilters } from '@/shared/api/types'

export const brandsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getBrands: b.query<Paginated<Brand>, BrandFilters | void>({
      query: (params) => ({ url: '/Brand/get-brands', params: params ?? {} }),
      providesTags: ['Brand'],
    }),
    addBrand: b.mutation<unknown, string>({
      query: (BrandName) => ({ url: '/Brand/add-brand', method: 'POST', params: { BrandName } }),
      invalidatesTags: ['Brand'],
    }),
    updateBrand: b.mutation<unknown, { Id: number; BrandName: string }>({
      query: (params) => ({ url: '/Brand/update-brand', method: 'PUT', params }),
      invalidatesTags: ['Brand'],
    }),
    deleteBrand: b.mutation<unknown, number>({
      query: (id) => ({ url: '/Brand/delete-brand', method: 'DELETE', params: { id } }),
      invalidatesTags: ['Brand'],
    }),
  }),
})

export const {
  useGetBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi
