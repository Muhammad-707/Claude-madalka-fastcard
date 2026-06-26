import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bell, LogOut, Menu } from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout, selectUser } from '@/features/auth/model/authSlice'
import { ThemeToggle } from '@/features/theme-toggle'
import { LangSwitcher } from '@/features/lang-switcher'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'
  const displayName = user?.name ?? 'Admin'

  function handleLogout() {
    dispatch(logout())
    toast.success(t('nav.logout'))
    navigate('/login', { replace: true })
  }

  return (
    <header
      className="flex items-center h-16 px-4 lg:px-6 gap-4 shrink-0"
      style={{ background: 'hsl(var(--sidebar))' }}
    >
      {/* Burger — mobile only */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-9 w-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/10"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Global search */}
      <GlobalSearch />

      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Lang switcher */}
        <LangSwitcher />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 ml-2 group outline-none">
              <Avatar className="h-8 w-8 bg-emerald-500">
                <AvatarFallback className="bg-emerald-500 text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-sidebar-foreground/90 group-hover:text-sidebar-foreground transition-colors max-w-[120px] truncate">
                {displayName}
              </span>
              <svg className="h-4 w-4 text-sidebar-foreground/50" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive gap-2 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {t('nav.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
