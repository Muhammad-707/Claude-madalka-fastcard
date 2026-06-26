import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from '@/shared/api/categoriesApi'
import type { Category } from '@/shared/api/types'

export function useCategoriesPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: categories, isLoading, isError } = useGetCategoriesQuery()
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation()

  const filtered = (categories ?? []).filter((c) =>
    c.categoryName.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await deleteCategory(deleteId).unwrap()
      toast.success(t('common.successDeleted'))
    } catch {
      toast.error(t('errors.somethingWrong'))
    } finally {
      setDeleteId(null)
    }
  }

  return {
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
  }
}
