import { useTranslation } from 'react-i18next'
import { ClipboardList } from 'lucide-react'
import { useUsersPage } from './hooks/useUsersPage'
import { UsersToolbar } from './components/UsersToolbar'
import { UserTable } from './components/UserTable'
import { AddUserDialog } from './components/AddUserDialog'
import { EditUserDialog } from './components/EditUserDialog'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { NetworkError } from '@/shared/ui/NetworkError'
import { Button } from '@/shared/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'

export default function UsersPage() {
  const { t } = useTranslation()
  const {
    data,
    filteredUsers,
    isLoading,
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
  } = useUsersPage()

  const totalPages = data?.totalPage ?? 1
  const totalRecord = data?.totalRecord ?? 0
  const isEmpty = !isLoading && filteredUsers.length === 0

  if (isError) {
    return <NetworkError onRetry={() => window.location.reload()} />
  }

  function buildPages() {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('ellipsis')
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i)
      }
      if (page < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('users.title')}</h1>
        {someSelected && (
          <span className="text-sm text-muted-foreground">
            {selectedIds.length} {t('common.delete').toLowerCase()}
          </span>
        )}
      </div>

      <UsersToolbar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setDeleteIds(selectedIds)}
        onAddUser={() => setShowAddDialog(true)}
      />

      <div className="bg-card border rounded-xl overflow-hidden">
        {isEmpty ? (
          <EmptyState
            icon={ClipboardList}
            title={t('empty.noOrdersYet')}
            description={t('users.search')}
            action={
              <Button onClick={() => setShowAddDialog(true)}>
                + {t('users.addUser')}
              </Button>
            }
          />
        ) : (
          <div className="p-4">
            <UserTable
              users={filteredUsers}
              isLoading={isLoading}
              selectedIds={selectedIds}
              allSelected={allSelected}
              onToggleAll={toggleAll}
              onToggleRow={toggleRow}
              onEdit={setEditUser}
              onDelete={(id) => setDeleteIds([id])}
            />
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalRecord} {t('products.results')}
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1) }}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {buildPages().map((p, i) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => { e.preventDefault(); setPage(p) }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1) }}
                  aria-disabled={page >= totalPages}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AddUserDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <EditUserDialog
        key={editUser?.userId || editUser?.id || 'no-edit'}
        user={editUser}
        onClose={() => setEditUser(null)}
      />

      <ConfirmDialog
        open={!!deleteIds}
        onOpenChange={(open) => { if (!open) setDeleteIds(null) }}
        title={t('common.confirmDelete')}
        description={
          deleteIds && deleteIds.length > 1
            ? t('common.confirmDeleteCount', { count: deleteIds.length })
            : t('common.confirmDelete')
        }
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  )
}
