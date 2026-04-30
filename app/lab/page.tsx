import Link from 'next/link'
import { Folder, FileCode, ExternalLink, ArrowUpRight } from 'lucide-react'

const ENTRIES = [
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
    type: 'external' as const,
    label: 'heysaladin',
    description: 'index.html',
    href: 'https://heysaladindesign.web.app/',
  },
  {
    type: 'file' as const,
    label: 'heysaladin playful',
    description: 'index.html',
    href: '/lab/heysaladin-design-playful/index.html',
  },
  {
    type: 'external' as const,
    label: 'colab',
    description: 'Collaboration Space',
    href: 'https://heysaladinme.web.app/colab/',
  },
  {
    type: 'external' as const,
    label: 'ikhbar',
    description: 'Newsletter Creator',
    href: 'https://heysaladinme.web.app/ikhbar',
  },
]

function CardIcon({ type }: { type: 'internal' | 'external' | 'file' }) {
  if (type === 'file') return <FileCode size={16} className="text-slate-400 dark:text-white/30" aria-hidden="true" />
  return <Folder size={16} className="text-slate-400 dark:text-white/30" aria-hidden="true" />
}

function CardArrow({ type }: { type: 'internal' | 'external' | 'file' }) {
  if (type === 'external') return <ExternalLink size={13} aria-hidden="true" />
  return <ArrowUpRight size={13} aria-hidden="true" />
}

function Card({ entry }: { entry: typeof ENTRIES[number] }) {
  const className =
    "group relative flex flex-col justify-between gap-8 p-5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition"

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <CardIcon type={entry.type} />
        <span className="text-slate-400 dark:text-white/20 group-hover:text-slate-600 dark:group-hover:text-white/50 transition">
          <CardArrow type={entry.type} />
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold leading-snug">{entry.label}</p>
        <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5 truncate">{entry.description}</p>
      </div>
    </>
  )

  if (entry.type === 'external') {
    return (
      <a href={entry.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={entry.href} className={className}>
      {inner}
    </Link>
  )
}

export default function LabPage() {
  return (
    <div className="bg-white dark:bg-black text-slate-900 dark:text-white min-h-screen transition-colors pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Folder size={18} className="text-slate-400 dark:text-white/30" aria-hidden="true" />
            <span className="text-xs text-slate-400 dark:text-white/30 font-mono">/lab</span>
          </div>
          <h1 className="text-2xl font-bold">Lab</h1>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">Experimental works and linked projects.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ENTRIES.map((entry) => (
            <Card key={entry.href} entry={entry} />
          ))}
        </div>

        <p className="text-xs text-slate-400 dark:text-white/20 mt-4 font-mono">{ENTRIES.length} entries</p>
      </div>
    </div>
  )
}
