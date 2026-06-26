import { useTranslation } from 'react-i18next'
import { Search, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

interface UsersToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  roleFilter: string
  onRoleChange: (v: string) => void
  selectedCount: number
  onBulkDelete: () => void
  onAddUser: () => void
}

export function UsersToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  selectedCount,
  onBulkDelete,
  onAddUser,
}: UsersToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={t('users.search')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={t('users.allRoles')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('users.allRoles')}</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 sm:ml-auto">
        {selectedCount > 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={onBulkDelete}
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
        <Button onClick={onAddUser} className="gap-2">
          <UserPlus className="w-4 h-4" />
          {t('users.addUser')}
        </Button>
      </div>
    </div>
  )
}
