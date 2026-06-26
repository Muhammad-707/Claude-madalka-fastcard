import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/skeleton'
import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  iconBg: string
  label: string
  value: number
  secondValue?: number
  secondLabel?: string
  active: boolean
  onClick: () => void
  isLoading: boolean
}

export function StatCard({
  icon,
  iconBg,
  label,
  value,
  secondValue,
  secondLabel,
  active,
  onClick,
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return <Skeleton className="h-[88px] rounded-xl" />
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 rounded-xl p-4 w-full text-left transition-all',
        'border bg-card hover:shadow-md cursor-pointer',
        active && 'ring-2 ring-primary shadow-md',
      )}
    >
      <div className={cn('rounded-full p-3 flex-shrink-0', iconBg)}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {secondValue !== undefined ? (
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold">{value.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-2xl font-bold">{secondValue.toLocaleString()}</span>
          </div>
        ) : (
          <p className="text-2xl font-bold mt-0.5">{value.toLocaleString()}</p>
        )}
        {secondLabel && (
          <p className="text-[10px] text-muted-foreground leading-tight">{secondLabel}</p>
        )}
      </div>
    </button>
  )
}
