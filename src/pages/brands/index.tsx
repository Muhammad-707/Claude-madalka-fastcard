import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Search, Pencil, Trash2, Loader2, Tag } from 'lucide-react'
import { useBrandsPage } from './hooks/useBrandsPage'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { NetworkError } from '@/shared/ui/NetworkError'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/skeleton'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { cn } from '@/shared/lib/utils'

const TAB_LINKS = [
  { to: '/categories', label: 'nav.categories' },
  { to: '/brands', label: 'nav.brands' },
  { to: '/banners', label: 'nav.banners' },
]

export default function BrandsPage() {
  const { t } = useTranslation()
  const {
    filtered,
    isLoading,
    isError,
    search,
    setSearch,
    newBrandName,
    setNewBrandName,
    adding,
    handleAdd,
    editBrand,
    editName,
    setEditName,
    updating,
    startEdit,
    cancelEdit,
    handleUpdate,
    deleteId,
    setDeleteId,
    deleting,
    handleDelete,
  } = useBrandsPage()

  if (isError) return <NetworkError onRetry={() => window.location.reload()} />

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
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

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Brand list */}
        <div className="border bg-card rounded-xl p-5 space-y-4">
          <h2 className="text-base font-semibold">{t('brand.title')}</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* List */}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Tag} title={t('empty.noData')} />
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((brand) => (
                <li key={brand.id} className="flex items-center justify-between py-3 gap-2">
                  {editBrand?.id === brand.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdate()
                          if (e.key === 'Escape') cancelEdit()
                        }}
                      />
                      <Button size="sm" onClick={handleUpdate} disabled={updating || !editName.trim()}>
                        {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t('form.save')}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        {t('form.cancel')}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium flex-1">{brand.brandName}</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(brand)}
                          className="w-7 h-7 flex items-center justify-center rounded text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(brand.id)}
                          className="w-7 h-7 flex items-center justify-center rounded text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Add new brand */}
        <div className="border bg-card rounded-xl p-5 space-y-4 h-fit">
          <h2 className="text-base font-semibold">{t('brand.addBrand')}</h2>

          <div className="space-y-1.5">
            <Label htmlFor="new-brand-name">{t('brand.brandName')}</Label>
            <Input
              id="new-brand-name"
              placeholder={t('brand.brandName')}
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
            />
          </div>

          <Button
            onClick={handleAdd}
            disabled={adding || !newBrandName.trim()}
            className="w-full"
          >
            {adding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('common.add')}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        title={t('brand.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
