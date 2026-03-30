'use client'

import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'

export default function AdminDraftArticles() {
  const [showDrafts, setShowDrafts] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setShowDrafts(!!data.showDrafts))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggle = async () => {
    const next = !showDrafts
    setShowDrafts(next)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showDrafts: next }),
    })
  }

  return (
    <div className="border border-slate-300 dark:border-white/10 rounded-lg px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-slate-500 dark:text-white/40 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold text-sm">Draft Articles</p>
          <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">
            {showDrafts ? 'Showing published & drafts on /articles' : 'Showing published only on /articles'}
          </p>
        </div>
      </div>

      <button
        role="switch"
        aria-checked={showDrafts}
        aria-label="Show draft articles on public page"
        onClick={toggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 dark:focus-visible:ring-white disabled:opacity-40 ${
          showDrafts ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-white/10'
        }`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-zinc-900 shadow transition-transform duration-200 ${
          showDrafts ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  )
}
