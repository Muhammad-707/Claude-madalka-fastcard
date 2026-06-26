import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetProductsQuery, useDeleteProductMutation } from '@/shared/api/productsApi'
import { useDebounce } from '@/shared/hooks/useDebounce'

export type StockFilter = 'all' | 'in' | 'out'

export function useProductsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data, isLoading, isError } = useGetProductsQuery({
    ProductName: debouncedSearch || undefined,
    PageNumber: page,
    PageSize: 10,
  })

  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation()

  const allProducts = data?.data ?? []
  const filteredProducts =
    stockFilter === 'in'
      ? allProducts.filter((p) => p.quantity > 0)
      : stockFilter === 'out'
        ? allProducts.filter((p) => p.quantity === 0)
        : allProducts

  const allIds = filteredProducts.map((p) => p.id)
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
  const someSelected = selectedIds.length > 0

  function toggleAll() {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allIds])])
    }
  }

  function toggleRow(id: number) {
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

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await deleteProduct(deleteId).unwrap()
      toast.success(t('common.successDeleted'))
    } catch {
      toast.error(t('errors.somethingWrong'))
    } finally {
      setDeleteId(null)
    }
  }

  return {
    data,
    filteredProducts,
    isLoading,
    isError,
    search,
    setSearch,
    stockFilter,
    setStockFilter,
    page,
    setPage,
    selectedIds,
    someSelected,
    toggleAll,
    toggleRow,
    allSelected,
    deleteId,
    setDeleteId,
    deleting,
    handleDelete,
  }
}
