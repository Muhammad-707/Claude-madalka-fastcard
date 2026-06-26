import { useTranslation } from 'react-i18next'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/shared/ui/skeleton'
import type { ActiveCard } from '../hooks/useDashboardPage'

interface ChartPoint {
  month: string
  products: number
  customers: number
  catalogItems: number
}

interface DashboardChartProps {
  activeCard: ActiveCard
  data: ChartPoint[]
  isLoading: boolean
}

const DATA_KEY_MAP: Record<ActiveCard, keyof ChartPoint> = {
  products: 'products',
  customers: 'customers',
  categoriesBrands: 'catalogItems',
}

export function DashboardChart({ activeCard, data, isLoading }: DashboardChartProps) {
  const { t } = useTranslation()
  const dataKey = DATA_KEY_MAP[activeCard]

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />
  }

  return (
    <div className="bg-card border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-4">{t('dashboard.salesRevenue')}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: 12,
            }}
          />
          <Area
            key={dataKey as string}
            type="monotone"
            dataKey={dataKey as string}
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#areaGrad)"
            dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#3b82f6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
