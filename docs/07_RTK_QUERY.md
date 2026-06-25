# 07 — RTK Query

Все данные — через RTK Query. Никаких `createAsyncThunk`/axios в компонентах. Кэш + автоинвалидация через теги.

## baseApi → `shared/api/baseApi.ts`
```ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY ?? 'access_token'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Product', 'Category', 'SubCategory', 'Brand', 'Color', 'User', 'Role'],
  endpoints: () => ({}),
})
```
Глобальный 401: обернуть baseQuery своим `baseQueryWithReauth`, который при 401 чистит токен и редиректит на `/login`.

## store → `app/store.ts`
```ts
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api/baseApi'
import authReducer from '@/features/auth/model/authSlice'

export const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer, auth: authReducer },
  middleware: (gdm) => gdm().concat(baseApi.middleware),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

## Эндпоинты (injectEndpoints по доменам)
`shared/api/productsApi.ts`, `categoriesApi.ts`, `subCategoriesApi.ts`, `brandsApi.ts`, `colorsApi.ts`, `usersApi.ts`, `authApi.ts`.

Пример (products):
```ts
export const productsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getProducts: b.query<Paginated<Product>, ProductFilters>({
      query: (params) => ({ url: '/Product/get-products', params }),
      providesTags: ['Product'],
      // 204 → вернуть пустой Paginated (см. transformResponse / валидацию статуса)
    }),
    getProductById: b.query<Product, number>({
      query: (id) => ({ url: '/Product/get-product-by-id', params: { id } }),
      transformResponse: (r: ApiEnvelope<Product>) => r.data!,
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
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
      query: (imageId) => ({ url: '/Product/delete-image-from-product', method: 'DELETE', params: { imageId } }),
      invalidatesTags: ['Product'],
    }),
  }),
})
export const {
  useGetProductsQuery, useGetProductByIdQuery, useAddProductMutation,
  useUpdateProductMutation, useDeleteProductMutation,
  useAddImageToProductMutation, useDeleteImageFromProductMutation,
} = productsApi
```

Аналогично:
- **categoriesApi:** getCategories(providesTags Category), addCategory(FormData), updateCategory(FormData), deleteCategory → invalidates Category.
- **subCategoriesApi:** get/add/update/delete → tag SubCategory.
- **brandsApi:** getBrands(paginated, params), addBrand(query), updateBrand, deleteBrand → tag Brand.
- **colorsApi:** getColors, addColor, updateColor, deleteColor → tag Color.
- **usersApi:** getUsers(get-user-profiles, paginated), getUserById, updateUser(FormData), deleteUser, getRoles, addRole, removeRole → tag User/Role.
- **authApi:** login(mutation `{userName,password}` → JWT).

## Кэш / состояния
- Каждый `useXQuery` даёт `{ data, isLoading, isFetching, isError }` → loading(skeleton)/success/error(NetworkError) (правило 16).
- Mutation `invalidatesTags` → списки сами рефетчатся после add/edit/delete (не нужно ручное обновление).
- `keepUnusedDataFor` для кэша; пагинацию/поиск/фильтры держать в URL (searchParams), передавать в `getX` как params (с debounce).

## FormData (multipart)
`add-product`, `add-category`, `update-category`, `update-user-profile`, `add-image-to-product` — собирать `FormData` вручную (PascalCase ключи как в Swagger), НЕ ставить `Content-Type` руками (браузер выставит boundary).
