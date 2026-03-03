'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, Twitter, Linkedin } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Works',    href: '/projects' },
  { label: 'Articles', href: '/articles' },
  { label: 'About',   href: '/about'    },
  { label: 'Enquiry', href: '/enquiry'  },
]

const SOCIAL = [
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Twitter',   href: '#', icon: Twitter   },
  { label: 'LinkedIn',  href: '#', icon: Linkedin   },
]

const EXCLUDED = ['/projects', '/admin', '/login']

export function Footer() {
  const pathname = usePathname()

  if (EXCLUDED.some(p => pathname.startsWith(p))) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition w-full md:w-40 shrink-0 text-center md:text-left">
            HYPERFANTASY
          </Link>

          {/* Nav links */}
          <div className="flex flex-wrap gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  isActive(href)
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                    : 'text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-40 shrink-0">
            {SOCIAL.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white transition"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 dark:text-white/20 text-center">
          © {new Date().getFullYear()} Hyperfantasy. All rights reserved.
        </div>

      </div>
    </footer>
  )
}
