'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin-sidebar'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-white/10 z-10 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-slate-600 dark:text-white/70" />
        </button>
        <Link href="/admin" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Image src="/logo-pictogram.svg" alt="Admin" width={22} height={22} />
          <span className="text-sm font-bold tracking-tight">Admin</span>
        </Link>
      </div>

      <main
        className={`min-h-screen pb-16 transition-all duration-200 pt-14 md:pt-0 ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}
      >
        {children}
      </main>
    </div>
  )
}
