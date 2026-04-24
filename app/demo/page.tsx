import { Folder } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className="bg-white dark:bg-black text-slate-900 dark:text-white min-h-screen transition-colors pt-16">
      <div className="max-w-xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Folder size={18} className="text-slate-400 dark:text-white/30" aria-hidden="true" />
            <span className="text-xs text-slate-400 dark:text-white/30 font-mono">/demo</span>
          </div>
          <h1 className="text-2xl font-bold">Demo</h1>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">Demos and prototypes. Nothing here yet.</p>
        </div>

        {/* Empty state */}
        <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-xl px-6 py-12 flex flex-col items-center text-center">
          <Folder size={32} className="text-slate-300 dark:text-white/10 mb-3" aria-hidden="true" />
          <p className="text-sm text-slate-400 dark:text-white/30">No entries yet</p>
        </div>

        <p className="text-xs text-slate-400 dark:text-white/20 mt-4 font-mono">0 entries</p>
      </div>
    </div>
  )
}
