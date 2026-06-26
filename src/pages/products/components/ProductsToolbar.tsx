import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import type { StockFilter } from '../hooks/useProductsPage'

interface ProductsToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  stockFilter: StockFilter
  onStockFilterChange: (v: StockFilter) => void
}

export function ProductsToolbar({
  search,
  onSearchChange,
  stockFilter,
  onStockFilterChange,
}: ProductsToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={stockFilter}
        onValueChange={(v) => onStockFilterChange(v as StockFilter)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('products.filter')}</SelectItem>
          <SelectItem value="in">{t('products.inStock')}</SelectItem>
          <SelectItem value="out">{t('products.outOfStock')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
