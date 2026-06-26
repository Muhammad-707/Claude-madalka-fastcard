import { baseApi } from '@/shared/api/baseApi'
import type { Paginated, Product, ProductFilters, UpdateProductParams } from '@/shared/api/types'

export const productsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getProducts: b.query<Paginated<Product>, ProductFilters | void>({
      query: (params) => ({
        url: '/Product/get-products',
        params: params ?? {},
        responseHandler: async (response: Response) => {
          if (response.status === 204) {
            return { data: [], totalRecord: 0, totalPage: 0, pageNumber: 1, pageSize: 10, errors: [], statusCode: 204 }
          }
          const json = await response.json()
          // Server wraps paginated response: { data: Paginated<T>, errors, statusCode }
          return json?.data ?? json
        },
      }),
      providesTags: ['Product'],
    }),
    getProductById: b.query<Product, number>({
      query: (id) => ({ url: '/Product/get-product-by-id', params: { id } }),
      transformResponse: (r: { data: Product | null }) => r.data!,
      providesTags: (_r, _e, id) => [{ type: 'Product' as const, id }],
    }),
    addProduct: b.mutation<unknown, FormData>({
      query: (body) => ({ url: '/Product/add-product', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: b.mutation<unknown, UpdateProductParams>({
      query: (params) => ({ url: '/Product/update-product', method: 'PUT', params }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: b.mutation<unknown, number>({
      query: (id) => ({ url: '/Product/delete-product', method: 'DELETE', params: { id } }),
      invalidatesTags: ['Product'],
    }),
    addImageToProduct: b.mutation<unknown, FormData>({
      query: (body) => ({ url: '/Product/add-image-to-product', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    deleteImageFromProduct: b.mutation<unknown, number>({
      query: (imageId) => ({
        url: '/Product/delete-image-from-product',
        method: 'DELETE',
        params: { imageId },
      }),
      invalidatesTags: ['Product'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddImageToProductMutation,
  useDeleteImageFromProductMutation,
} = productsApi
