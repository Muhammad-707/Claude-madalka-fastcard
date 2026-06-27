import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  Tag,
  Layers,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Sheet, SheetContent } from '@/shared/ui/sheet'
import logo from '@/assets/Group 1116606595 (3).png'

const OTHER_PATHS = ['/categories', '/brands', '/sub-categories']

interface SidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function SidebarContent() {
  const { t } = useTranslation()
  const location = useLocation()
  const isOtherActive = OTHER_PATHS.some((p) => location.pathname.startsWith(p))
  const [otherOpen, setOtherOpen] = useState(isOtherActive)

  return (
    <div className="flex flex-col h-full" style={{ background: 'hsl(var(--sidebar))' }}>
      {/* Logo */}
      <div className="flex items-center h-16 px-6 shrink-0 border-b border-sidebar-border">
        <img src={logo} alt="fastcart" className="h-12 object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Dashboard */}
        <NavItem to="/dashboard" icon={LayoutDashboard} label={t('nav.dashboard')} />

        {/* Customers */}
        <NavItem to="/users" icon={Users} label={t('nav.customers')} />

        {/* Products */}
        <NavItem to="/products" icon={Package} label={t('nav.products')} />

        {/* Other — expandable */}
        <div>
          <button
            onClick={() => setOtherOpen(!otherOpen)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isOtherActive
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/10',
            )}
          >
            <Boxes className="h-5 w-5 shrink-0" />
            <span className="flex-1 text-left">{t('nav.other')}</span>
            {otherOpen
              ? <ChevronUp className="h-4 w-4" />
              : <ChevronDown className="h-4 w-4" />
            }
          </button>

          {otherOpen && (
            <div className="mt-1 ml-4 pl-4 border-l border-sidebar-border space-y-1">
              <NavItem to="/categories" icon={Tag} label={t('nav.categories')} sub />
              <NavItem to="/brands" icon={Boxes} label={t('nav.brands')} sub />
              <NavItem to="/sub-categories" icon={Layers} label={t('nav.subCategory')} sub />
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

interface NavItemProps {
  to: string
  icon: React.ElementType
  label: string
  sub?: boolean
}

function NavItem({ to, icon: Icon, label, sub = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
          sub ? 'px-2 py-2' : 'px-3 py-2.5',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/10',
        )
      }
    >
      <Icon className={cn('shrink-0', sub ? 'h-4 w-4' : 'h-5 w-5')} />
      <span>{label}</span>
    </NavLink>
  )
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-[240px] z-30">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-[240px] border-r-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
