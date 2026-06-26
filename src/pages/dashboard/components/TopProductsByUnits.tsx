import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/ui/skeleton'
import { getImageUrl } from '@/shared/lib/getImageUrl'
import type { Product } from '@/shared/api/types'

interface TopProductsByUnitsProps {
  products: Product[]
  isLoading: boolean
}

export function TopProductsByUnits({ products, isLoading }: TopProductsByUnitsProps) {
  const { t } = useTranslation()

  const sorted = [...products].sort((a, b) => b.quantity - a.quantity)

  return (
    <div className="bg-card border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-4">{t('dashboard.topByUnits')}</h3>

      <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 text-xs text-muted-foreground mb-2">
        <span>{t('form.name')}</span>
        <span className="text-right">{t('products.price')}</span>
        <span className="text-right">{t('dashboard.units')}</span>
      </div>

      <div
        className="space-y-3 overflow-y-auto max-h-60 scrollbar-hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))
          : sorted.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2"
              >
                <div className="w-8 h-8 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={getImageUrl(product.images[0].imageName)}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <p className="text-sm truncate">{product.productName}</p>
                <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                <p className="text-sm font-medium">{product.quantity}</p>
              </div>
            ))}
      </div>
    </div>
  )
}
