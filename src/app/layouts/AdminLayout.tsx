import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/widgets/sidebar'
import { Header } from '@/widgets/header'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar (desktop: fixed left; mobile: drawer) */}
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main content — offset by sidebar on desktop */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[240px]">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
