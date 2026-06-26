import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Checkbox } from '@/shared/ui/checkbox'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { getImageUrl } from '@/shared/lib/getImageUrl'
import type { Product } from '@/shared/api/types'

interface ProductTableProps {
  products: Product[]
  isLoading: boolean
  selectedIds: number[]
  allSelected: boolean
  onToggleAll: () => void
  onToggleRow: (id: number) => void
  onDelete: (id: number) => void
}

export function ProductTable({
  products,
  isLoading,
  selectedIds,
  allSelected,
  onToggleAll,
  onToggleRow,
  onDelete,
}: ProductTableProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="pb-3 pr-3 w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleAll}
                aria-label="Select all"
              />
            </th>
            <th className="pb-3 pr-4 text-left font-medium">{t('products.product')}</th>
            <th className="pb-3 pr-4 text-left font-medium">{t('products.inventory')}</th>
            <th className="pb-3 pr-4 text-left font-medium hidden md:table-cell">
              {t('form.brand')}
            </th>
            <th className="pb-3 pr-4 text-left font-medium">{t('products.price')}</th>
            <th className="pb-3 text-right font-medium">{t('products.action')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id)
            const inStock = product.quantity > 0
            return (
              <tr
                key={product.id}
                className="border-b border-border/40 hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 pr-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleRow(product.id)}
                    aria-label={`Select ${product.productName}`}
                  />
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={getImageUrl(product.images[0].imageName)}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="font-medium truncate max-w-[180px]">
                      {product.productName}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  {inStock ? (
                    <span className="text-muted-foreground">
                      {product.quantity} {t('products.inStock')}
                    </span>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      {t('products.outOfStock')}
                    </Badge>
                  )}
                </td>
                <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">
                  {product.brandName ?? '—'}
                </td>
                <td className="py-3 pr-4 font-medium">
                  ${product.price.toFixed(2)}
                  {product.hasDiscount && product.discountPrice && (
                    <span className="ml-1 text-xs text-emerald-600 dark:text-emerald-400">
                      → ${product.discountPrice.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:text-primary/80"
                      asChild
                    >
                      <Link to={`/products/${product.id}/edit`}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/80"
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
