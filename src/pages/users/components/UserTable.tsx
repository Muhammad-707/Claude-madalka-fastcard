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
    <>
      {/* Mobile card list — visible below md */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onToggleAll}
            aria-label="Select all"
          />
          <span className="text-xs text-muted-foreground font-medium">{t('common.delete')} {t('users.allRoles').toLowerCase()}</span>
        </div>
        {users.map((user) => {
          const isSelected = selectedIds.includes(user.id)
          return (
            <div
              key={user.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50 hover:bg-muted/20 transition-colors"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleRow(user.id)}
                aria-label={`Select ${user.userName}`}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user.userName ?? `${user.firstName} ${user.lastName}`}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                {user.phoneNumber && (
                  <p className="text-xs text-muted-foreground">{user.phoneNumber}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={user.role === 'Admin' || user.role === 'SuperAdmin' ? 'default' : 'secondary'} className="text-xs">
                  {user.role ?? 'User'}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop table — hidden below md */}
      <div className="hidden md:block overflow-x-auto">
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
              <th className="pb-3 pr-4 text-left font-medium">{t('users.phone')}</th>
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
                  <td className="py-3 pr-4 text-muted-foreground">{user.phoneNumber}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={user.role === 'Admin' || user.role === 'SuperAdmin' ? 'default' : 'secondary'}>
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
    </>
  )
}
