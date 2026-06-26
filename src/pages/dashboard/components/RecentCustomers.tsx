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
    <div className="bg-card border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-4">{t('dashboard.recentCustomers')}</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs">
              <th className="text-left pb-3 font-medium">{t('users.username')}</th>
              <th className="text-left pb-3 font-medium">{t('users.email')}</th>
              <th className="text-right pb-3 font-medium">{t('users.role')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={3} className="py-1.5">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              : users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-2.5 font-medium">
                      {user.userName ?? `${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="py-2.5 text-muted-foreground max-w-[180px] truncate">
                      {user.email}
                    </td>
                    <td className="py-2.5 text-right">
                      <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                        {user.role ?? 'User'}
                      </Badge>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
