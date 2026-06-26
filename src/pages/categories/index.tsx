import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Search, Pencil, Trash2, Plus, FolderOpen } from 'lucide-react'
import { useCategoriesPage } from './hooks/useCategoriesPage'
import { AddCategoryDialog } from './components/AddCategoryDialog'
import { EditCategoryDialog } from './components/EditCategoryDialog'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { NetworkError } from '@/shared/ui/NetworkError'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/skeleton'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { getImageUrl } from '@/shared/lib/getImageUrl'
import { cn } from '@/shared/lib/utils'

const TAB_LINKS = [
  { to: '/categories', label: 'nav.categories' },
  { to: '/brands', label: 'nav.brands' },
  { to: '/banners', label: 'nav.banners' },
]

export default function CategoriesPage() {
  const { t } = useTranslation()
  const {
    filtered,
    isLoading,
    isError,
    search,
    setSearch,
    showAdd,
    setShowAdd,
    editCategory,
    setEditCategory,
    deleteId,
    setDeleteId,
    deleting,
    handleDelete,
  } = useCategoriesPage()

  if (isError) return <NetworkError onRetry={() => window.location.reload()} />

  return (
    <div className="p-6 space-y-6">
      {/* Tabs + Add button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
          {TAB_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {t(label)}
            </NavLink>
          ))}
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('category.addCategory')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={t('empty.noData')}
          action={
            <Button onClick={() => setShowAdd(true)}>
              + {t('category.addCategory')}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((category) => (
            <div
              key={category.id}
              className="relative group border bg-card rounded-xl p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow"
            >
              {/* Action icons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setEditCategory(category)}
                  className="w-6 h-6 flex items-center justify-center rounded text-primary hover:bg-primary/10"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(category.id)}
                  className="w-6 h-6 flex items-center justify-center rounded text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {category.categoryImage ? (
                  <img
                    src={getImageUrl(category.categoryImage)}
                    alt={category.categoryName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FolderOpen className="w-8 h-8 text-muted-foreground/40" strokeWidth={1.5} />
                )}
              </div>

              {/* Name */}
              <p className="text-sm font-medium text-center leading-tight">
                {category.categoryName}
              </p>
            </div>
          ))}
        </div>
      )}

      <AddCategoryDialog open={showAdd} onOpenChange={setShowAdd} />
      <EditCategoryDialog category={editCategory} onClose={() => setEditCategory(null)} />
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        title={t('category.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
