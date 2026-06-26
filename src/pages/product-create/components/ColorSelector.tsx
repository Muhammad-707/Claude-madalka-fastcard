import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useGetColorsQuery, useAddColorMutation } from '@/shared/api/colorsApi'
import { Skeleton } from '@/shared/ui/skeleton'

interface ColorSelectorProps {
  value: number | null
  onChange: (id: number) => void
}

const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  black: '#111827',
  white: '#f9fafb',
  gray: '#6b7280',
  grey: '#6b7280',
  orange: '#f97316',
  pink: '#ec4899',
}

function getColorHex(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return hex
  }
  return '#94a3b8'
}

export function ColorSelector({ value, onChange }: ColorSelectorProps) {
  const { t } = useTranslation()
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')

  const { data: colorsData, isLoading } = useGetColorsQuery({ PageSize: 50 })
  const [addColor, { isLoading: adding }] = useAddColorMutation()

  const colors = colorsData?.data ?? []

  async function handleAddColor() {
    if (!newName.trim()) return
    try {
      await addColor(newName.trim()).unwrap()
      toast.success(t('common.successAdded'))
      setNewName('')
      setShowNew(false)
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  if (isLoading) return <Skeleton className="h-12 w-full" />

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{t('form.color')}</span>
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Plus className="w-3 h-3" />
          {t('form.newColor')}
        </button>
      </div>

      {showNew && (
        <div className="flex gap-2">
          <Input
            placeholder={t('form.colorName')}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor() } }}
            className="h-8 text-sm"
          />
          <Button type="button" size="sm" onClick={handleAddColor} disabled={adding}>
            {adding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const hex = getColorHex(color.colorName)
          const selected = value === color.id
          return (
            <button
              key={color.id}
              type="button"
              title={color.colorName}
              onClick={() => onChange(color.id)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center',
                selected ? 'border-primary scale-110' : 'border-transparent hover:border-muted-foreground/50',
              )}
              style={{ backgroundColor: hex }}
            >
              {selected && <Check className="w-3 h-3 text-white drop-shadow" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
