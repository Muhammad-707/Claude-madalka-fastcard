import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Plus, Pencil, Trash2, Layers, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  useGetCategoriesQuery,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from '@/shared/api/categoriesApi'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { NetworkError } from '@/shared/ui/NetworkError'
import { Skeleton } from '@/shared/ui/skeleton'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { cn } from '@/shared/lib/utils'

const TAB_LINKS = [
  { to: '/categories', label: 'nav.categories' },
  { to: '/brands', label: 'nav.brands' },
  { to: '/sub-categories', label: 'nav.subCategory' },
]

interface SubCategoryRow {
  id: number
  subCategoryName: string
  categoryId: number
  categoryName: string
}

interface SubCategoryFormState {
  categoryId: number
  name: string
}

const EMPTY_FORM: SubCategoryFormState = { categoryId: 0, name: '' }

export default function SubCategoriesPage() {
  const { t } = useTranslation()

  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery()
  const [addSubCategory, { isLoading: adding }] = useAddSubCategoryMutation()
  const [updateSubCategory, { isLoading: updating }] = useUpdateSubCategoryMutation()
  const [deleteSubCategory, { isLoading: deleting }] = useDeleteSubCategoryMutation()

  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<SubCategoryFormState>(EMPTY_FORM)
  const [editItem, setEditItem] = useState<SubCategoryRow | null>(null)
  const [editForm, setEditForm] = useState<SubCategoryFormState>(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const allRows: SubCategoryRow[] = categories.flatMap((cat) =>
    (cat.subCategories ?? []).map((sc) => ({
      id: sc.id,
      subCategoryName: sc.subCategoryName,
      categoryId: cat.id,
      categoryName: cat.categoryName,
    })),
  )

  const filtered = search.trim()
    ? allRows.filter(
        (row) =>
          row.subCategoryName.toLowerCase().includes(search.toLowerCase()) ||
          row.categoryName.toLowerCase().includes(search.toLowerCase()),
      )
    : allRows

  function openEdit(row: SubCategoryRow) {
    setEditItem(row)
    setEditForm({ categoryId: row.categoryId, name: row.subCategoryName })
  }

  function closeAdd() {
    setShowAdd(false)
    setAddForm(EMPTY_FORM)
  }

  async function handleAdd() {
    if (!addForm.categoryId || !addForm.name.trim()) {
      toast.error(t('errors.required'))
      return
    }
    try {
      await addSubCategory({
        CategoryId: addForm.categoryId,
        SubCategoryName: addForm.name.trim(),
      }).unwrap()
      toast.success(t('common.successAdded'))
      closeAdd()
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  async function handleUpdate() {
    if (!editItem || !editForm.categoryId || !editForm.name.trim()) {
      toast.error(t('errors.required'))
      return
    }
    try {
      await updateSubCategory({
        Id: editItem.id,
        CategoryId: editForm.categoryId,
        SubCategoryName: editForm.name.trim(),
      }).unwrap()
      toast.success(t('common.successUpdated'))
      setEditItem(null)
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await deleteSubCategory(deleteId).unwrap()
      toast.success(t('common.successDeleted'))
    } catch {
      toast.error(t('errors.somethingWrong'))
    } finally {
      setDeleteId(null)
    }
  }

  if (isError) return <NetworkError onRetry={() => window.location.reload()} />

  return (
    <div className="p-6 space-y-6">
      {/* Tabs + Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
          {t('subCategory.add')}
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

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={t('empty.noData')}
            action={
              <Button onClick={() => setShowAdd(true)}>
                + {t('subCategory.add')}
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-4 py-3 text-left font-medium w-12">#</th>
                  <th className="px-4 py-3 text-left font-medium">{t('form.category')}</th>
                  <th className="px-4 py-3 text-left font-medium">{t('subCategory.name')}</th>
                  <th className="px-4 py-3 text-right font-medium">{t('products.action')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{row.categoryName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.subCategoryName}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="w-8 h-8 flex items-center justify-center rounded text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(row.id)}
                          className="w-8 h-8 flex items-center justify-center rounded text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={(open) => { if (!open) closeAdd() }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('subCategory.add')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>{t('form.category')}</Label>
              <Select
                value={addForm.categoryId > 0 ? String(addForm.categoryId) : ''}
                onValueChange={(v) => setAddForm((f) => ({ ...f, categoryId: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('subCategory.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('subCategory.name')}</Label>
              <Input
                placeholder={t('subCategory.name')}
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleAdd() }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closeAdd}>
                {t('form.cancel')}
              </Button>
              <Button onClick={() => void handleAdd()} disabled={adding}>
                {adding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('form.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => { if (!open) setEditItem(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('subCategory.edit')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>{t('form.category')}</Label>
              <Select
                value={editForm.categoryId > 0 ? String(editForm.categoryId) : ''}
                onValueChange={(v) => setEditForm((f) => ({ ...f, categoryId: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('subCategory.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('subCategory.name')}</Label>
              <Input
                placeholder={t('subCategory.name')}
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleUpdate() }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditItem(null)}>
                {t('form.cancel')}
              </Button>
              <Button onClick={() => void handleUpdate()} disabled={updating}>
                {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('form.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        title={t('subCategory.deleteConfirm')}
        onConfirm={() => void handleDelete()}
        loading={deleting}
      />
    </div>
  )
}
