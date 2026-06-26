import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/ui/badge'
import { Skeleton } from '@/shared/ui/skeleton'
import type { UserProfile } from '@/shared/api/types'

interface RecentCustomersProps {
  users: UserProfile[]
  isLoading: boolean
}

export function RecentCustomers({ users, isLoading }: RecentCustomersProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-card border rounded-xl p-4 overflow-hidden">
      <h3 className="text-sm font-semibold mb-4">{t('dashboard.recentCustomers')}</h3>

      {/* Fixed header — stays visible during scroll */}
      <div className="grid grid-cols-[1fr_1fr_auto] gap-3 text-xs text-muted-foreground font-medium pb-3 border-b border-border/40">
        <span>{t('users.username')}</span>
        <span>{t('users.email')}</span>
        <span className="text-right">{t('users.role')}</span>
      </div>

      {/* Scrollable rows — exactly 6 rows visible (6 × 40px = 240px) */}
      <div className="overflow-y-auto max-h-[240px] scrollbar-hidden overscroll-contain">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="py-1.5">
                <Skeleton className="h-8 w-full" />
              </div>
            ))
          : users.map((user) => (
              <div
                key={user.userId || user.id}
                className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center py-2.5 border-b border-border/40 hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-medium truncate min-w-0">
                  {user.userName ?? `${user.firstName} ${user.lastName}`}
                </span>
                <span className="text-sm text-muted-foreground truncate min-w-0">
                  {user.email}
                </span>
                <Badge
                  variant={
                    (user.role ?? user.userRoles?.[0]?.name) === 'Admin' ||
                    (user.role ?? user.userRoles?.[0]?.name) === 'SuperAdmin'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {user.role ?? user.userRoles?.[0]?.name ?? 'User'}
                </Badge>
              </div>
            ))}
      </div>
    </div>
  )
}
