import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/shared/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-9 w-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {theme === 'dark'
        ? <Sun className="h-5 w-5" />
        : <Moon className="h-5 w-5" />
      }
    </Button>
  )
}
