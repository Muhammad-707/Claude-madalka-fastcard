import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  useGetBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from '@/shared/api/brandsApi'
import type { Brand } from '@/shared/api/types'

export function useBrandsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [newBrandName, setNewBrandName] = useState('')
  const [editBrand, setEditBrand] = useState<Brand | null>(null)
  const [editName, setEditName] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data, isLoading, isError } = useGetBrandsQuery()
  const [addBrand, { isLoading: adding }] = useAddBrandMutation()
  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation()
  const [deleteBrand, { isLoading: deleting }] = useDeleteBrandMutation()

  const brands = data?.data ?? []
  const filtered = brands.filter((b) =>
    b.brandName.toLowerCase().includes(search.toLowerCase()),
  )

  function startEdit(brand: Brand) {
    setEditBrand(brand)
    setEditName(brand.brandName)
  }

  function cancelEdit() {
    setEditBrand(null)
    setEditName('')
  }

  async function handleAdd() {
    const name = newBrandName.trim()
    if (!name) return
    try {
      await addBrand(name).unwrap()
      toast.success(t('common.successAdded'))
      setNewBrandName('')
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  async function handleUpdate() {
    if (!editBrand || !editName.trim()) return
    try {
      await updateBrand({ Id: editBrand.id, BrandName: editName.trim() }).unwrap()
      toast.success(t('common.successUpdated'))
      cancelEdit()
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await deleteBrand(deleteId).unwrap()
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
  }
}
