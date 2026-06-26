import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Skeleton } from '@/shared/ui/skeleton'
import { getImageUrl } from '@/shared/lib/getImageUrl'
import type { Product } from '@/shared/api/types'

interface TopSellingProductsProps {
  products: Product[]
  isLoading: boolean
}

export function TopSellingProducts({ products, isLoading }: TopSellingProductsProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-card border rounded-xl p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">{t('dashboard.topSelling')}</h3>
        <Link
          to="/products"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          {t('dashboard.seeAll')}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))
          : products.map((product) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={getImageUrl(product.images[0].imageName)}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">
                    {product.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">{product.brandName ?? '—'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold">{product.quantity.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.inSales')}</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
