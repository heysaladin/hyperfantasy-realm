'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`min-h-screen pb-16 transition-all duration-200 ${collapsed ? 'ml-16' : 'ml-60'}`}
      >
        {children}
      </main>
    </div>
  )
}
