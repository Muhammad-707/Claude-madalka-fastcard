import { Toaster } from '@/shared/ui/sonner'
import { ReduxProvider } from './ReduxProvider'
import { ThemeProvider } from './ThemeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </ReduxProvider>
  )
}
