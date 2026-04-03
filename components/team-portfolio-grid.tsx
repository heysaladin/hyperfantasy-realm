'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Dialog as RadixDialog } from 'radix-ui'
import { ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArticleContent } from '@/components/article-content'
import { resolveContent } from '@/lib/tiptap-content'

export type TeamPortfolio = {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  category: string | null
  tags: string[]
  stack: string[]
  liveUrl: string | null
  projectDate: string | null
  complexity: string | null
}

// ---------- masonry ----------

const MASONRY_GAP = 32

function useCols(): number {
  const [cols, setCols] = useState(1)
  useEffect(() => {
    const update = () => setCols(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return cols
}

function MasonryGrid({ items, gap, renderItem }: {
  items: TeamPortfolio[]
  gap: number
  renderItem: (item: TeamPortfolio, index: number) => React.ReactNode
}) {
  const cols = useCols()
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [positions, setPositions] = useState<{ x: number; y: number; w: number }[]>([])
  const [containerH, setContainerH] = useState(0)

  const compute = useCallback(() => {
    const el = containerRef.current
    if (!el || el.offsetWidth === 0) return
    const totalW = el.offsetWidth
    const colW = (totalW - gap * (cols - 1)) / cols
    const colHeights = new Array(cols).fill(0)
    const newPos = items.map((_, i) => {
      const h = itemRefs.current[i]?.offsetHeight || 200
      const col = colHeights.indexOf(Math.min(...colHeights))
      const pos = { x: col * (colW + gap), y: colHeights[col], w: colW }
      colHeights[col] += h + gap
      return pos
    })
    setPositions(newPos)
    setContainerH(Math.max(0, Math.max(0, ...colHeights) - gap))
  }, [items, cols, gap])

  useLayoutEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length)
    compute()
  }, [items, cols]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(compute)
    obs.observe(el)
    return () => obs.disconnect()
  }, [compute])

  useEffect(() => {
    const observers: ResizeObserver[] = []
    itemRefs.current.forEach(el => {
      if (!el) return
      const obs = new ResizeObserver(compute)
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [items, compute])

  return (
    <div ref={containerRef} style={{ position: 'relative', height: containerH }}>
      {items.map((item, i) => {
        const pos = positions[i]
        return (
          <div
            key={item.id}
            ref={el => { itemRefs.current[i] = el }}
            style={{
              position: 'absolute',
              left: pos?.x ?? 0,
              top: pos?.y ?? 0,
              width: pos?.w ?? '100%',
              transition: 'top 0.25s ease, left 0.25s ease',
            }}
          >
            {renderItem(item, i)}
          </div>
        )
      })}
    </div>
  )
}

// ---------- main component ----------

export function TeamPortfolioGrid({
  portfolios,
  emptyMessage,
}: {
  portfolios: TeamPortfolio[]
  emptyMessage?: string
}) {
  const [selected, setSelected] = useState<TeamPortfolio | null>(null)

  if (portfolios.length === 0) {
    return (
      <p className="text-center text-slate-400 dark:text-white/30 text-sm py-16">
        {emptyMessage ?? 'No projects available.'}
      </p>
    )
  }

  return (
    <>
      {/* ── Grid ── */}
      <MasonryGrid
        items={portfolios}
        gap={MASONRY_GAP}
        renderItem={(p) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelected(p)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(p) } }}
            className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition cursor-pointer"
          >
            {p.imageUrl && (
              <div className="overflow-hidden bg-slate-200 dark:bg-white/5">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block transition group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
              {p.category && (
                <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1.5">{p.category}</p>
              )}
              <h3 className="text-base font-semibold leading-snug group-hover:text-slate-600 dark:group-hover:text-white/60 transition">{p.title}</h3>
              {p.projectDate && (
                <p className="text-xs text-slate-400 dark:text-white/30 mt-1.5">
                  {new Date(p.projectDate).getFullYear()}
                </p>
              )}
              {p.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/50 rounded">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      />

      {/* ── Modal ── */}
      <RadixDialog.Root open={!!selected} onOpenChange={() => setSelected(null)}>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <RadixDialog.Content
            aria-describedby={undefined}
            className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:pt-10 sm:px-4 sm:pb-4 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            onClick={() => setSelected(null)}
          >
            {selected && (
              <>
                <RadixDialog.Title className="sr-only">{selected.title}</RadixDialog.Title>
                <div
                  className="w-full max-w-4xl bg-white dark:bg-zinc-900 flex flex-col rounded-none sm:rounded-2xl overflow-hidden shadow-2xl h-full sm:h-auto sm:max-h-[88vh]"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-5 pb-4 border-b border-slate-100 dark:border-white/10 flex-shrink-0">
                    <div className="min-w-0">
                      {selected.category && (
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1">
                          {selected.category}
                        </p>
                      )}
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">{selected.title}</h2>
                    </div>
                    <RadixDialog.Close className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition">
                      <X size={20} />
                    </RadixDialog.Close>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-3 pb-7 space-y-6 min-h-0">
                    {selected.description && (
                      <ArticleContent
                        html={resolveContent(selected.description)}
                        className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-img:mt-0"
                      />
                    )}

                    {selected.stack?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2">Stack</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selected.stack.map(tech => (
                            <span key={tech} className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/70 rounded-md">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selected.tags?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selected.tags.map(tag => (
                            <span key={tag} className="text-xs px-2.5 py-1 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-3">
                        <Link href={`/projects/${selected.id}`}>
                          <Button variant="outline" size="sm" className="cursor-pointer px-3">View Full Project</Button>
                        </Link>
                        {selected.liveUrl && (
                          <a href={selected.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <ExternalLink size={13} className="mr-1.5" aria-hidden="true" />Live Site
                            </Button>
                          </a>
                        )}
                      </div>
                      {selected.projectDate && (
                        <span className="text-xs text-slate-400 dark:text-white/30 tabular-nums shrink-0">
                          {new Date(selected.projectDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    </>
  )
}
