import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ShoppingBag, Plus } from 'lucide-react'
import { useProductsPage } from './hooks/useProductsPage'
import { ProductsToolbar } from './components/ProductsToolbar'
import { ProductTable } from './components/ProductTable'
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

export default function ProductsPage() {
  const { t } = useTranslation()
  const {
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
    toggleAll,
    toggleRow,
    allSelected,
    deleteId,
    setDeleteId,
    deleting,
    handleDelete,
  } = useProductsPage()

  const totalPages = data?.totalPage ?? 1
  const totalRecord = data?.totalRecord ?? 0
  const isEmpty = !isLoading && filteredProducts.length === 0

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
        <h1 className="text-2xl font-bold">{t('products.title')}</h1>
        <Button asChild className="gap-2">
          <Link to="/products/create">
            <Plus className="w-4 h-4" />
            {t('products.addNew2')}
          </Link>
        </Button>
      </div>

      <ProductsToolbar
        search={search}
        onSearchChange={setSearch}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
      />

      <div className="bg-card border rounded-xl overflow-hidden">
        {isEmpty ? (
          <EmptyState
            icon={ShoppingBag}
            title={t('empty.noProducts')}
            description={t('empty.addFirstProduct')}
            action={
              <Button asChild>
                <Link to="/products/create">
                  + {t('products.addNew2')}
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="p-4">
            <ProductTable
              products={filteredProducts}
              isLoading={isLoading}
              selectedIds={selectedIds}
              allSelected={allSelected}
              onToggleAll={toggleAll}
              onToggleRow={toggleRow}
              onDelete={setDeleteId}
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

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        title={t('products.deleteProduct')}
        description={t('products.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
