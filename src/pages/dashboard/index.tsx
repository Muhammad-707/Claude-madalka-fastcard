import { useTranslation } from 'react-i18next'
import { Package, Users, LayoutGrid } from 'lucide-react'
import { useDashboardPage } from './hooks/useDashboardPage'
import { StatCard } from './components/StatCard'
import { DashboardChart } from './components/DashboardChart'
import { TopSellingProducts } from './components/TopSellingProducts'
import { RecentCustomers } from './components/RecentCustomers'
import { TopProductsByUnits } from './components/TopProductsByUnits'

export default function DashboardPage() {
  const { t } = useTranslation()
  const {
    activeCard,
    setActiveCard,
    totalProducts,
    totalUsers,
    totalCategories,
    totalBrands,
    topProducts,
    recentUsers,
    allProducts,
    chartData,
    productsLoading,
    usersLoading,
    categoriesLoading,
    brandsLoading,
  } = useDashboardPage()

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<Package className="w-5 h-5 text-rose-500" />}
              iconBg="bg-rose-100 dark:bg-rose-900/30"
              label={t('dashboard.products')}
              value={totalProducts}
              active={activeCard === 'products'}
              onClick={() => setActiveCard('products')}
              isLoading={productsLoading}
            />
            <StatCard
              icon={<Users className="w-5 h-5 text-orange-500" />}
              iconBg="bg-orange-100 dark:bg-orange-900/30"
              label={t('dashboard.customers')}
              value={totalUsers}
              active={activeCard === 'customers'}
              onClick={() => setActiveCard('customers')}
              isLoading={usersLoading}
            />
            <StatCard
              icon={<LayoutGrid className="w-5 h-5 text-emerald-500" />}
              iconBg="bg-emerald-100 dark:bg-emerald-900/30"
              label={t('dashboard.categoriesBrands')}
              value={totalCategories}
              secondValue={totalBrands}
              secondLabel={`${t('nav.categories')} / ${t('nav.brands')}`}
              active={activeCard === 'categoriesBrands'}
              onClick={() => setActiveCard('categoriesBrands')}
              isLoading={categoriesLoading || brandsLoading}
            />
          </div>

          <DashboardChart
            activeCard={activeCard}
            data={chartData}
            isLoading={productsLoading || usersLoading}
          />
        </div>

        <TopSellingProducts products={topProducts} isLoading={productsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCustomers users={recentUsers} isLoading={usersLoading} />
        <TopProductsByUnits products={allProducts} isLoading={productsLoading} />
      </div>
    </div>
  )
}
