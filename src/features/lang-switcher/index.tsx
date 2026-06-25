import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Button } from '@/shared/ui/button'
import { ChevronDown } from 'lucide-react'

const LANGS = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'tj', label: 'TJ' },
]

export function LangSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.slice(0, 2).toUpperCase() ?? 'RU'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/10 font-medium text-xs px-2"
        >
          {current}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[80px]">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => i18n.changeLanguage(l.code)}
            className={i18n.language?.startsWith(l.code) ? 'font-semibold text-primary' : ''}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
