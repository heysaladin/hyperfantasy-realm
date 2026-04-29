'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ThemeToggle } from '@/components/theme-toggle'
import { useEffect, useRef, useState } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Users,
  FileText,
  Home,
  User,
  LogOut,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/portfolios', label: 'Portfolios', icon: Briefcase },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/teams', label: 'Teams', icon: Users },
  { href: '/admin/blogs', label: 'Articles', icon: FileText },
]

interface AdminSidebarProps {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<{ name: string; email: string; avatar: string | null } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const meta = data.user.user_metadata ?? {}
        setUser({
          name: meta.full_name ?? meta.name ?? data.user.email?.split('@')[0] ?? 'Admin',
          email: data.user.email ?? '',
          avatar: meta.avatar_url ?? meta.picture ?? null,
        })
      }
    })
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    setDropdownOpen(false)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-white/10 z-30 transition-all duration-200 w-60 ${collapsed ? 'md:w-16' : 'md:w-60'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-slate-200 dark:border-white/10 min-h-[60px]">
        {collapsed ? (
          /* Collapsed: show logo only (desktop only) */
          <div className="flex items-center justify-center w-full">
            <Image
              src="/logo-pictogram.svg"
              alt="Tamawal"
              width={26}
              height={26}
            />
          </div>
        ) : (
          <>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <Image
                src="/logo-pictogram.svg"
                alt="Tamawal"
                width={24}
                height={24}
              />
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Admin
              </span>
            </Link>
            <div className="flex items-center gap-0.5">
              <ThemeToggle />
              {/* Desktop collapse button */}
              <button
                onClick={() => setCollapsed(true)}
                className="hidden md:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={18} className="text-slate-500 dark:text-white/50" aria-hidden="true" />
              </button>
              {/* Mobile close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                aria-label="Close menu"
              >
                <PanelLeftClose size={18} className="text-slate-500 dark:text-white/50" aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Expand button (collapsed state only) */}
      {collapsed && (
        <div className="flex items-center justify-center py-2 border-b border-slate-200 dark:border-white/10">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={18} className="text-slate-500 dark:text-white/50" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${
                active
                  ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={17} aria-hidden="true" />
              {!collapsed && label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: user profile */}
      <div className="px-2 py-3 border-t border-slate-200 dark:border-white/10">
        {collapsed ? (
          /* Collapsed: just avatar */
          <div className="flex items-center justify-center py-1">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center">
                <User size={15} className="text-slate-500 dark:text-white/40" aria-hidden="true" />
              </div>
            )}
          </div>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
              aria-label="User menu"
            >
              {/* Avatar */}
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name ?? 'User'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                  <User size={15} className="text-slate-500 dark:text-white/40" aria-hidden="true" />
                </div>
              )}

              {/* Name */}
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-white/80 text-left truncate min-w-0">
                {user?.name ?? 'Admin'}
              </span>

              {/* 3-dot icon */}
              <MoreHorizontal
                size={16}
                className="flex-shrink-0 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60"
                aria-hidden="true"
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg py-1 z-50">
                <Link
                  href="/"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Home size={15} aria-hidden="true" />
                  Back to Home
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <User size={15} aria-hidden="true" />
                  Go to Profile
                </Link>
                <div className="my-1 border-t border-slate-100 dark:border-white/10" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut size={15} aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
