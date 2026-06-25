import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PageLoader } from '@/shared/ui/PageLoader'
import { ProtectedRoute } from '@/app/ProtectedRoute'
import AdminLayout from '@/app/layouts/AdminLayout'

const LoginPage = lazy(() => import('@/pages/login'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))
const UsersPage = lazy(() => import('@/pages/users'))
const ProductsPage = lazy(() => import('@/pages/products'))
const ProductCreatePage = lazy(() => import('@/pages/product-create'))
const ProductEditPage = lazy(() => import('@/pages/product-edit'))
const CategoriesPage = lazy(() => import('@/pages/categories'))
const BrandsPage = lazy(() => import('@/pages/brands'))
const BannersPage = lazy(() => import('@/pages/banners'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

function s(node: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: s(<LoginPage />),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/dashboard', element: s(<DashboardPage />) },
          { path: '/users', element: s(<UsersPage />) },
          { path: '/products', element: s(<ProductsPage />) },
          { path: '/products/create', element: s(<ProductCreatePage />) },
          { path: '/products/:id/edit', element: s(<ProductEditPage />) },
          { path: '/categories', element: s(<CategoriesPage />) },
          { path: '/brands', element: s(<BrandsPage />) },
          { path: '/banners', element: s(<BannersPage />) },
        ],
      },
    ],
  },
  {
    path: '*',
    element: s(<NotFoundPage />),
  },
])
