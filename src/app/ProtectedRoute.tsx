import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectIsAdmin } from '@/features/auth/model/authSlice'

export function ProtectedRoute() {
  const isAdmin = useAppSelector(selectIsAdmin)
  const location = useLocation()

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
