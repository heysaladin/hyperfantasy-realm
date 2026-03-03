'use client'

import AdminNav from '@/components/admin-nav'

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      <AdminNav />
      <main className="pb-16">{children}</main>
    </div>
  )
}