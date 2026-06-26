import { baseApi } from '@/shared/api/baseApi'
import type { Category, SubCategory } from '@/shared/api/types'

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getCategories: b.query<Category[], void>({
      query: () => '/Category/get-categories',
      transformResponse: (r: { data: Category[] | null }) => r.data ?? [],
      providesTags: ['Category'],
    }),
    addCategory: b.mutation<unknown, FormData>({
      query: (body) => ({ url: '/Category/add-category', method: 'POST', body }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: b.mutation<unknown, FormData>({
      query: (body) => ({ url: '/Category/update-category', method: 'PUT', body }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: b.mutation<unknown, number>({
      query: (id) => ({ url: '/Category/delete-category', method: 'DELETE', params: { id } }),
      invalidatesTags: ['Category'],
    }),
    getSubCategories: b.query<SubCategory[], void>({
      query: () => '/SubCategory/get-sub-category',
      transformResponse: (r: { data: SubCategory[] | null }) => r.data ?? [],
      providesTags: ['SubCategory'],
    }),
    addSubCategory: b.mutation<unknown, { SubCategoryName: string; CategoryId: number }>({
      query: (params) => ({ url: '/SubCategory/add-sub-category', method: 'POST', params }),
      invalidatesTags: ['SubCategory', 'Category'],
    }),
    updateSubCategory: b.mutation<unknown, { Id: number; CategoryId: number; SubCategoryName: string }>({
      query: (params) => ({ url: '/SubCategory/update-sub-category', method: 'PUT', params }),
      invalidatesTags: ['SubCategory', 'Category'],
    }),
    deleteSubCategory: b.mutation<unknown, number>({
      query: (id) => ({ url: '/SubCategory/delete-sub-category', method: 'DELETE', params: { id } }),
      invalidatesTags: ['SubCategory', 'Category'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubCategoriesQuery,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = categoriesApi
