import { baseApi } from '@/shared/api/baseApi'
import type { Paginated, Product, ProductFilters, UpdateProductParams } from '@/shared/api/types'

export const productsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getProducts: b.query<Paginated<Product>, ProductFilters | void>({
      query: (params) => ({
        url: '/Product/get-products',
        params: params ?? {},
        responseHandler: async (response: Response) => {
          const EMPTY: Paginated<Product> = { pageNumber: 1, pageSize: 10, totalPage: 0, totalRecord: 0, data: [], errors: [], statusCode: 200 }
          if (response.status === 204) return EMPTY
          const json = await response.json().catch(() => null) as Record<string, unknown> | null
          if (!json) return EMPTY
          // Actual response: { pageNumber, pageSize, totalPage, totalRecord,
          //   data: { products: Product[], colors: [], brands: [], minMaxPrice: {} },
          //   errors, statusCode }
          const inner = json.data as Record<string, unknown> | null
          const products = inner?.products
          const enriched: Product[] = Array.isArray(products) ? (products as Product[]) : []
          return {
            pageNumber: (json.pageNumber as number) ?? 1,
            pageSize: (json.pageSize as number) ?? 10,
            totalPage: (json.totalPage as number) ?? 0,
            totalRecord: (json.totalRecord as number) ?? 0,
            data: enriched,
            errors: (json.errors as string[]) ?? [],
            statusCode: (json.statusCode as number) ?? 200,
          } satisfies Paginated<Product>
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
