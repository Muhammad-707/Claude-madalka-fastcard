import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}
