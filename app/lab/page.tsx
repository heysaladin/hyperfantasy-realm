import Link from 'next/link'
import { Folder, FileCode, ExternalLink, ArrowUpRight } from 'lucide-react'

const ENTRIES = [
  {
    type: 'internal' as const,
    label: 'Home',
    description: 'Back to main site',
    href: '/',
  },
  {
    type: 'internal' as const,
    label: 'Admin',
    description: 'Manage your content',
    href: '/admin',
  },
  {
    type: 'external' as const,
    label: 'Hyperfantasy',
    description: 'hyperfantasy.web.app',
    href: 'https://hyperfantasy.web.app/',
  },
  {
    type: 'external' as const,
    label: 'Hey Saladin Design',
    description: 'heysaladindesign.web.app',
    href: 'https://heysaladindesign.web.app/',
  },
  {
    type: 'external' as const,
    label: 'Hey Hey Saladin',
    description: 'heyheysaladin.web.app',
    href: 'https://heyheysaladin.web.app/',
  },
  {
    type: 'external' as const,
    label: 'Farooqa Studio',
    description: 'farooq-agent.web.app',
    href: 'https://farooq-agent.web.app/',
  },
  {
    type: 'file' as const,
    label: 'heysaladin',
    description: 'index.html',
    href: '/lab/heysaladin/index.html',
  },
]

export default function LabPage() {
  return (
    <div className="bg-white dark:bg-black text-slate-900 dark:text-white min-h-screen transition-colors pt-16">
      <div className="max-w-xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Folder size={18} className="text-slate-400 dark:text-white/30" aria-hidden="true" />
            <span className="text-xs text-slate-400 dark:text-white/30 font-mono">/lab</span>
          </div>
          <h1 className="text-2xl font-bold">Lab</h1>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">Experimental works and linked projects.</p>
        </div>

        {/* Entry list */}
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
          {ENTRIES.map((entry) =>
            entry.type === 'external' ? (
              <a
                key={entry.href}
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Folder size={14} className="shrink-0 text-slate-400 dark:text-white/30" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium block truncate">{entry.label}</span>
                    <span className="text-xs text-slate-400 dark:text-white/30 block truncate">{entry.description}</span>
                  </div>
                </div>
                <ExternalLink size={14} className="shrink-0 ml-3 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60 transition" aria-hidden="true" />
              </a>
            ) : entry.type === 'file' ? (
              <Link
                key={entry.href}
                href={entry.href}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileCode size={14} className="shrink-0 text-slate-400 dark:text-white/30" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium block truncate">{entry.label}</span>
                    <span className="text-xs text-slate-400 dark:text-white/30 block truncate">{entry.description}</span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="shrink-0 ml-3 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60 transition" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Folder size={14} className="shrink-0 text-slate-400 dark:text-white/30" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium block truncate">{entry.label}</span>
                    <span className="text-xs text-slate-400 dark:text-white/30 block truncate">{entry.description}</span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="shrink-0 ml-3 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60 transition" aria-hidden="true" />
              </Link>
            )
          )}
        </div>

        <p className="text-xs text-slate-400 dark:text-white/20 mt-4 font-mono">{ENTRIES.length} entries</p>
      </div>
    </div>
  )
}
