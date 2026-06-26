import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetUsersQuery, useDeleteUserMutation } from '@/shared/api/usersApi'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { UserProfile } from '@/shared/api/types'

function getUserId(u: UserProfile): string {
  return u.userId || u.id
}

function getUserRole(u: UserProfile): string {
  return (u.role ?? u.userRoles?.[0]?.name ?? '').toLowerCase()
}

export function useUsersPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteIds, setDeleteIds] = useState<string[] | null>(null)
  const [editUser, setEditUser] = useState<UserProfile | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const { data, isLoading, isError, isFetching } = useGetUsersQuery({
    UserName: debouncedSearch || undefined,
    PageNumber: page,
    PageSize: 10,
  })

  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation()

  const allUsers = data?.data ?? []
  const filteredUsers = roleFilter === 'all'
    ? allUsers
    : allUsers.filter((u) => getUserRole(u) === roleFilter.toLowerCase())

  const allIds = filteredUsers.map(getUserId)
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
  const someSelected = selectedIds.length > 0

  function toggleAll() {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allIds])])
    }
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function setPage(p: number) {
    setSearchParams((prev) => {
      prev.set('page', String(p))
      return prev
    })
    setSelectedIds([])
  }

  async function handleDeleteConfirm() {
    if (!deleteIds?.length) return
    try {
      await Promise.all(deleteIds.map((id) => deleteUser(id).unwrap()))
      toast.success(t('common.successDeleted'))
      setSelectedIds([])
    } catch {
      toast.error(t('errors.somethingWrong'))
    } finally {
      setDeleteIds(null)
    }
  }

  return {
    data,
    filteredUsers,
    isLoading,
    isFetching,
    isError,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    page,
    setPage,
    selectedIds,
    someSelected,
    toggleAll,
    toggleRow,
    allSelected,
    deleteIds,
    setDeleteIds,
    deleting,
    handleDeleteConfirm,
    editUser,
    setEditUser,
    showAddDialog,
    setShowAddDialog,
    getUserId,
  }
}
