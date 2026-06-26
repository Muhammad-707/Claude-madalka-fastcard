import { useState, useRef, useEffect, useCallback } from 'react'
import type { ElementType, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Package, Users, Tag, Boxes } from 'lucide-react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useGetProductsQuery } from '@/shared/api/productsApi'
import { useGetUsersQuery } from '@/shared/api/usersApi'
import { useGetBrandsQuery } from '@/shared/api/brandsApi'
import { useGetCategoriesQuery } from '@/shared/api/categoriesApi'

export function GlobalSearch() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const term = useDebounce(query.trim(), 300)
  const active = term.length >= 2

  const { data: productsData } = useGetProductsQuery(
    { ProductName: term, PageSize: 5 },
    { skip: !active },
  )
  const { data: usersData } = useGetUsersQuery(
    { UserName: term, PageSize: 5 },
    { skip: !active },
  )
  const { data: brandsData } = useGetBrandsQuery(
    { BrandName: term, PageSize: 5 },
    { skip: !active },
  )
  const { data: allCategories } = useGetCategoriesQuery(undefined, { skip: !active })

  const products = productsData?.data ?? []
  const users = usersData?.data ?? []
  const brands = brandsData?.data ?? []
  const categories = active
    ? (allCategories ?? []).filter((c) =>
        c.categoryName.toLowerCase().includes(term.toLowerCase()),
      )
    : []

  const hasResults = products.length + users.length + brands.length + categories.length > 0
  const showDropdown = open && active && hasResults

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  const go = useCallback(
    (path: string) => {
      navigate(path)
      setOpen(false)
      setQuery('')
    },
    [navigate],
  )

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40 pointer-events-none z-10" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => {
          if (active) setOpen(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            setQuery('')
          }
        }}
        placeholder={t('common.search')}
        className="w-full h-9 pl-9 pr-4 rounded-lg bg-white/10 text-sidebar-foreground placeholder:text-sidebar-foreground/40 text-sm outline-none focus:bg-white/15 transition-colors"
      />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="max-h-72 overflow-y-auto">
            {products.length > 0 && (
              <ResultSection icon={Package} label={t('nav.products')}>
                {products.map((p) => (
                  <ResultRow key={p.id} onClick={() => go('/products')}>
                    {p.productName}
                  </ResultRow>
                ))}
              </ResultSection>
            )}
            {users.length > 0 && (
              <ResultSection icon={Users} label={t('nav.customers')}>
                {users.map((u) => (
                  <ResultRow key={u.userId || u.id} onClick={() => go('/users')}>
                    {u.userName ?? `${u.firstName} ${u.lastName}`}
                  </ResultRow>
                ))}
              </ResultSection>
            )}
            {brands.length > 0 && (
              <ResultSection icon={Boxes} label={t('nav.brands')}>
                {brands.map((b) => (
                  <ResultRow key={b.id} onClick={() => go('/brands')}>
                    {b.brandName}
                  </ResultRow>
                ))}
              </ResultSection>
            )}
            {categories.length > 0 && (
              <ResultSection icon={Tag} label={t('nav.categories')}>
                {categories.map((c) => (
                  <ResultRow key={c.id} onClick={() => go('/categories')}>
                    {c.categoryName}
                  </ResultRow>
                ))}
              </ResultSection>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ResultSection({
  icon: Icon,
  label,
  children,
}: {
  icon: ElementType
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div>{children}</div>
    </div>
  )
}

function ResultRow({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors truncate block"
    >
      {children}
    </button>
  )
}
