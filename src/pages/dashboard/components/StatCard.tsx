import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/skeleton'
import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  iconBg: string
  label: string
  value: number
  active: boolean
  onClick: () => void
  isLoading: boolean
}

export function StatCard({ icon, iconBg, label, value, active, onClick, isLoading }: StatCardProps) {
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
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value.toLocaleString()}</p>
      </div>
    </button>
  )
}
