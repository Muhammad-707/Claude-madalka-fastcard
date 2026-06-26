import { useTranslation } from 'react-i18next'
import { Pencil, Trash2 } from 'lucide-react'
import { Checkbox } from '@/shared/ui/checkbox'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import type { UserProfile } from '@/shared/api/types'

interface UserTableProps {
  users: UserProfile[]
  isLoading: boolean
  selectedIds: string[]
  allSelected: boolean
  onToggleAll: () => void
  onToggleRow: (id: string) => void
  onEdit: (user: UserProfile) => void
  onDelete: (id: string) => void
}

export function UserTable({
  users,
  isLoading,
  selectedIds,
  allSelected,
  onToggleAll,
  onToggleRow,
  onEdit,
  onDelete,
}: UserTableProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="pb-3 pr-3 w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleAll}
                aria-label="Select all"
              />
            </th>
            <th className="pb-3 pr-4 text-left font-medium">{t('users.username')}</th>
            <th className="pb-3 pr-4 text-left font-medium">{t('users.email')}</th>
            <th className="pb-3 pr-4 text-left font-medium hidden md:table-cell">
              {t('users.phone')}
            </th>
            <th className="pb-3 pr-4 text-left font-medium">{t('users.role')}</th>
            <th className="pb-3 text-right font-medium">{t('products.action')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelected = selectedIds.includes(user.id)
            return (
              <tr
                key={user.id}
                className="border-b border-border/40 hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 pr-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleRow(user.id)}
                    aria-label={`Select ${user.userName}`}
                  />
                </td>
                <td className="py-3 pr-4 font-medium">
                  {user.userName ?? `${user.firstName} ${user.lastName}`}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
                <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">
                  {user.phoneNumber}
                </td>
                <td className="py-3 pr-4">
                  <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                    {user.role ?? 'User'}
                  </Badge>
                </td>
                <td className="py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(user)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
