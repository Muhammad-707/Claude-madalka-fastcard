import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { cn } from '@/shared/lib/utils'

const TAB_LINKS = [
  { to: '/categories', label: 'nav.categories' },
  { to: '/brands', label: 'nav.brands' },
  { to: '/banners', label: 'nav.banners' },
]

interface BannerItem {
  id: string
  preview: string
  title: string
}

function BannerPanel({ title }: { title: string }) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<BannerItem[]>([])
  const [formTitle, setFormTitle] = useState('')

  function addFile(f: File) {
    const preview = URL.createObjectURL(f)
    setFormTitle('')
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), preview, title: f.name },
    ])
    setFile(null)
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="border bg-card rounded-xl p-5 space-y-5">
      <h2 className="text-base font-semibold">{title}</h2>

      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault()
          const f = e.dataTransfer.files[0]
          if (f) addFile(f)
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Upload className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm">
            <span className="text-primary font-medium">{t('banner.clickUpload')}</span>
            {' '}{t('banner.orDrag')}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">SVG, PNG, JPG or GIF (max 900×400)</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) addFile(f)
          e.target.value = ''
        }}
      />

      {/* Existing items list */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg">
              <img src={item.preview} alt={item.title} className="w-12 h-10 object-cover rounded" />
              <span className="text-sm flex-1 truncate">{item.title}</span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 text-destructive"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>{t('banner.bannerTitle')}</Label>
          <Input
            placeholder={t('banner.bannerTitle')}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t('banner.bannerLink')}</Label>
          <Input placeholder="https://" />
        </div>
        <Button className="w-full" onClick={() => {}} type="button">
          {t('banner.addBanner')}
        </Button>
      </div>
    </div>
  )
}

export default function BannersPage() {
  const { t } = useTranslation()

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
        {TAB_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            {t(label)}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 bg-muted/30 rounded-lg border border-dashed">
        <ImageIcon className="w-4 h-4 shrink-0" />
        <span>{t('banner.noApiNote')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BannerPanel title={t('banner.mainSliders')} />
        <BannerPanel title={t('banner.bannerSection')} />
      </div>
    </div>
  )
}
