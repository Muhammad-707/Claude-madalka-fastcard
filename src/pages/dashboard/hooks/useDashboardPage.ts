import { useState } from 'react'
import { useGetProductsQuery } from '@/shared/api/productsApi'
import { useGetUsersQuery } from '@/shared/api/usersApi'
import { useGetCategoriesQuery } from '@/shared/api/categoriesApi'
import { useGetBrandsQuery } from '@/shared/api/brandsApi'

export type ActiveCard = 'products' | 'customers' | 'categoriesBrands'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PATTERN = [0.45, 0.52, 0.61, 0.58, 0.78, 0.68, 0.88, 0.74, 0.93, 0.79, 0.83, 0.73]

function buildChartData(products: number, customers: number, catalogItems: number) {
  return MONTHS.map((month, i) => ({
    month,
    products: Math.round(products * PATTERN[i]),
    customers: Math.round(customers * PATTERN[i]),
    catalogItems: Math.round(catalogItems * PATTERN[i]),
  }))
}

export function useDashboardPage() {
  const [activeCard, setActiveCard] = useState<ActiveCard>('products')

  const { data: productsData, isLoading: productsLoading, isError: productsError } =
    useGetProductsQuery({ PageNumber: 1, PageSize: 100 })

  const { data: usersData, isLoading: usersLoading, isError: usersError } =
    useGetUsersQuery({ PageNumber: 1, PageSize: 10 })

  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } =
    useGetCategoriesQuery()

  const { data: brandsData, isLoading: brandsLoading, isError: brandsError } =
    useGetBrandsQuery({ PageNumber: 1, PageSize: 100 })

  const totalProducts = productsData?.totalRecord ?? 0
  const totalUsers = usersData?.totalRecord ?? 0
  const totalCategories = categories?.length ?? 0
  const totalBrands = brandsData?.totalRecord ?? 0

  const topProducts = (productsData?.data ?? []).slice(0, 6)
  const recentUsers = usersData?.data ?? []
  const allProducts = productsData?.data ?? []

  const chartData = buildChartData(totalProducts, totalUsers, totalCategories + totalBrands)

  return {
    activeCard,
    setActiveCard,
    totalProducts,
    totalUsers,
    totalCategories,
    totalBrands,
    topProducts,
    recentUsers,
    allProducts,
    chartData,
    productsLoading,
    usersLoading,
    categoriesLoading,
    brandsLoading,
    productsError,
    usersError,
    categoriesError,
    brandsError,
  }
}
