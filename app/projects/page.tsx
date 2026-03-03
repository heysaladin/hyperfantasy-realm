'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Dialog as RadixDialog } from 'radix-ui'
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpNarrowWide, ChevronDown, ExternalLink, Image, LayoutGrid, Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resolveContent, resolveContentAsText } from '@/lib/tiptap-content'
import { ArticleContent } from '@/components/article-content'

const PAGE_SIZE = 9

const CATEGORIES = [
  { value: '',                label: 'All'},
  { value: 'UI-UX',           label: 'UI/UX'},
  { value: 'Illustration',    label: 'Illustration'},
  { value: 'Graphic Design',  label: 'Graphic Design'},
  { value: 'Branding',        label: 'Branding'},
  { value: 'Development',     label: 'Development'},
]

const COMPLEXITIES = [
  { value: '',      label: 'All'   },
  { value: 'short', label: 'Short' },
  { value: 'long',  label: 'Long'  },
]

const SORT_OPTIONS = [
  { value: 'order',  label: 'Default', icon: LayoutGrid },
  { value: 'newest', label: 'Newest',  icon: ArrowDownWideNarrow },
  { value: 'oldest', label: 'Oldest',  icon: ArrowUpNarrowWide },
  { value: 'title',  label: 'A–Z',     icon: ArrowDownAZ },
]

// ---------- sub-components ----------

function useLazyVisible() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { rootMargin: '0px 0px 120px 0px', threshold: 0 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function PortfolioCard({ portfolio, index, onClick, showMeta }: { portfolio: any; index: number; onClick: () => void; showMeta: boolean }) {
  const { ref, visible } = useLazyVisible()
  // Stagger only for the first page (initial load); scroll-in cards animate instantly
  const delay = index < PAGE_SIZE ? index * 50 : 0
  return (
    <div ref={ref} onClick={onClick} className="group block cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.35s ease-out ${delay}ms, transform 0.35s ease-out ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition hover:border-slate-300 dark:hover:border-white/20">
        {portfolio.imageUrl && (
          <div className="aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-white/5">
            <img src={portfolio.imageUrl} alt={portfolio.title} loading="lazy" decoding="async"
              className="object-cover w-full h-full transition group-hover:scale-105" />
          </div>
        )}
        {showMeta && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              {portfolio.category && (
                <span className="text-xs text-slate-500 dark:text-white/40 uppercase tracking-wider">{portfolio.category}</span>
              )}
            </div>
            <h3 className="text-xl font-semibold group-hover:text-slate-600 dark:group-hover:text-white/60 transition">{portfolio.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/60 line-clamp-2">{resolveContentAsText(portfolio.description)}</p>
            {portfolio.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {portfolio.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-slate-200 dark:bg-white/10 rounded">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SkeletonCard({ showMeta }: { showMeta: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
      <div className="aspect-[16/10] bg-slate-200 dark:bg-white/10 animate-pulse" />
      {showMeta && (
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <div className="h-4 w-16 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-12 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- date range slider ----------

function RangeSlider({ min, max, value, onChange }: {
  min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<0 | 1 | null>(null)

  const span = max - min || 1
  // Inverted: newest (max) on left, oldest (min) on right
  const l = ((max - value[1]) / span) * 100   // left thumb = max/newest
  const r = ((max - value[0]) / span) * 100   // right thumb = min/oldest

  const yearFromPointer = (e: React.PointerEvent) => {
    const rect = trackRef.current!.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    return Math.round(max - pct * span)  // inverted
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current === null) return
    const y = yearFromPointer(e)
    if (dragging.current === 0) onChange([value[0], Math.max(y, value[0])])  // left = maxYear
    else                        onChange([Math.min(y, value[1]), value[1]])  // right = minYear
  }

  const thumb = (idx: 0 | 1, pct: number) => (
    <div
      className="absolute w-4 h-4 rounded-full bg-white border-2 border-slate-700 dark:border-white/70 -translate-x-1/2 shadow cursor-grab active:cursor-grabbing touch-none"
      style={{ left: `${pct}%`, zIndex: idx === 1 ? 4 : 3 }}
      onPointerDown={e => {
        e.preventDefault()
        dragging.current = idx
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { dragging.current = null }}
    />
  )

  return (
    <div ref={trackRef} className="relative h-5 flex items-center select-none">
      <div className="absolute inset-x-0 h-[3px] rounded-full bg-slate-200 dark:bg-white/10" />
      <div className="absolute h-[3px] rounded-full bg-slate-700 dark:bg-white/50"
        style={{ left: `${l}%`, right: `${100 - r}%` }} />
      {thumb(0, l)}
      {thumb(1, r)}
    </div>
  )
}

// ---------- main page ----------

export default function ProjectsPage() {
  // All portfolios fetched once
  const [allPortfolios, setAllPortfolios] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('order')
  const [category, setCategory] = useState('')
  const [complexity, setComplexity] = useState('')
  const [showMeta, setShowMeta] = useState(true)
  const [yearRange, setYearRange] = useState<[number, number] | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  // How many filtered results to display (infinite scroll)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const sentinelInView = useRef(false)
  const filterPanelRef = useRef<HTMLDivElement>(null)
  const sortPanelRef = useRef<HTMLDivElement>(null)

  // Fetch all visible portfolios once on mount
  useEffect(() => {
    fetch('/api/portfolios?limit=500&offset=0&visible=true')
      .then(r => r.json())
      .then(data => {
        const items: any[] = data.items || []
        setAllPortfolios(items)
        const years = items
          .filter(p => p.projectDate)
          .map(p => new Date(p.projectDate).getFullYear())
        if (years.length >= 2) {
          const mn = Math.min(...years), mx = Math.max(...years)
          if (mn < mx) setYearRange([mn, mx])
        }
      })
      .catch(() => setAllPortfolios([]))
      .finally(() => setIsLoading(false))
  }, [])

  // Stable slider bounds (full date range of all portfolios)
  const dataYears = useMemo(() => {
    const years = allPortfolios.filter(p => p.projectDate).map(p => new Date(p.projectDate).getFullYear())
    if (!years.length) return null
    const mn = Math.min(...years), mx = Math.max(...years)
    return mn < mx ? { min: mn, max: mx } : null
  }, [allPortfolios])

  // Client-side filter + sort (instant, no network)
  const filtered = useMemo(() => {
    let result = [...allPortfolios]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q))
      )
    }

    if (category)   result = result.filter(p => p.category === category)
    if (complexity) result = result.filter(p =>
      complexity === 'long' ? p.complexity !== 'short' : p.complexity === complexity
    )

    if (yearRange && dataYears && (yearRange[0] > dataYears.min || yearRange[1] < dataYears.max)) {
      result = result.filter(p => {
        if (!p.projectDate) return false
        const y = new Date(p.projectDate).getFullYear()
        return y >= yearRange[0] && y <= yearRange[1]
      })
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.projectDate ?? 0).getTime() - new Date(a.projectDate ?? 0).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.projectDate ?? 0).getTime() - new Date(b.projectDate ?? 0).getTime())
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        result.sort((a, b) => {
          const orderDiff = (b.orderIndex ?? 0) - (a.orderIndex ?? 0)  // desc
          if (orderDiff !== 0) return orderDiff
          return new Date(b.projectDate ?? 0).getTime() - new Date(a.projectDate ?? 0).getTime()  // desc
        })
    }

    return result
  }, [allPortfolios, search, sort, category, complexity, yearRange, dataYears])

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [search, sort, category, complexity, yearRange])

  const displayed = filtered.slice(0, displayCount)
  const hasMore = displayCount < filtered.length

  // Load more items when sentinel enters view
  const loadMore = () => {
    if (hasMore) setDisplayCount(c => Math.min(c + PAGE_SIZE, filtered.length))
  }

  // Re-check after displayCount updates (handles the case where sentinel stays in view)
  useEffect(() => {
    if (sentinelInView.current && hasMore) loadMore()
  }, [displayCount, filtered.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sentinel observer
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        sentinelInView.current = entry.isIntersecting
        if (entry.isIntersecting) loadMore()
      },
      { rootMargin: '400px' }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [hasMore]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close panels on outside click
  useEffect(() => {
    if (!isFilterOpen && !isSortOpen) return
    const handler = (e: MouseEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false)
      }
      if (sortPanelRef.current && !sortPanelRef.current.contains(e.target as Node)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isFilterOpen, isSortOpen])

  const resetAll = () => {
    setCategory('')
    setComplexity('')
    if (dataYears) setYearRange([dataYears.min, dataYears.max])
  }

  const activeSortCount = sort !== 'order' ? 1 : 0
  const activeFilterCount = [
    category !== '',
    complexity !== '',
    dataYears && yearRange && (yearRange[0] > dataYears.min || yearRange[1] < dataYears.max),
  ].filter(Boolean).length

  const handleClick = (portfolio: any) => {
    setSelectedPortfolio(portfolio)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Work</h1>
          <p className="text-xl text-slate-600 dark:text-white/60">Selected projects showcasing our expertise</p>
        </div>
      </div>

      {/* Search + Sort & Filter */}
      <div className="border-b border-slate-200 dark:border-white/10 sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">

            {/* Left: Search + meta toggle */}
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search projects…"
                  className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-slate-400 dark:focus:border-white/30 transition placeholder:text-slate-400 dark:placeholder:text-white/30"
                />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60 transition">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                title={showMeta ? 'Image only' : 'Show details'}
                onClick={() => setShowMeta(v => !v)}
                className={`px-2.5 py-2.5 rounded-lg border transition flex-shrink-0 ${
                  !showMeta
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Image size={15} />
              </button>
            </div>

            {/* Right: Sort dropdown */}
            <div className="relative flex-shrink-0" ref={sortPanelRef}>
              <button
                onClick={() => { setIsSortOpen(v => !v); setIsFilterOpen(false) }}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition ${
                  isSortOpen || activeSortCount > 0
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <span>Sort</span>
                {activeSortCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {activeSortCount}
                  </span>
                )}
                <ChevronDown size={13} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-20">
                  <div className="p-3 space-y-1">
                    {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => { setSort(value); setIsSortOpen(false) }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                          sort === value
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                            : 'text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <Icon size={13} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter dropdown */}
            <div className="relative flex-shrink-0" ref={filterPanelRef}>
              <button
                onClick={() => { setIsFilterOpen(v => !v); setIsSortOpen(false) }}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition ${
                  isFilterOpen || activeFilterCount > 0
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown size={13} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-20">

                  {/* Category section */}
                  <div className="p-4 border-b border-slate-100 dark:border-white/10">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3">Category</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            category === cat.value
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Complexity section */}
                  <div className="p-4 border-b border-slate-100 dark:border-white/10">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3">Complexity</p>
                    <div className="flex gap-1.5">
                      {COMPLEXITIES.map(c => (
                        <button
                          key={c.value}
                          onClick={() => setComplexity(c.value)}
                          className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            complexity === c.value
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date range section */}
                  {dataYears && yearRange && (
                    <div className="p-4 border-b border-slate-100 dark:border-white/10">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3">Date Range</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs tabular-nums text-slate-500 dark:text-white/40 w-10 text-right shrink-0">{yearRange[1]}</span>
                        <div className="flex-1">
                          <RangeSlider min={dataYears.min} max={dataYears.max} value={yearRange} onChange={setYearRange} />
                        </div>
                        <span className="text-xs tabular-nums text-slate-500 dark:text-white/40 w-10 shrink-0">{yearRange[0]}</span>
                      </div>
                    </div>
                  )}

                  {/* Footer: Reset All + Apply */}
                  <div className="p-4 flex gap-2">
                    <button
                      onClick={resetAll}
                      className="flex-1 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 py-2 text-sm rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-white/90 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} showMeta={showMeta} />)
            : displayed.map((portfolio, index) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} index={index} onClick={() => handleClick(portfolio)} showMeta={showMeta} />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-slate-400 dark:text-white/30 text-lg mb-2">No projects found</p>
            <p className="text-slate-400 dark:text-white/20 text-sm">Try adjusting your search</p>
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="h-1" />

        {/* End */}
        {!isLoading && !hasMore && filtered.length > 0 && (
          <p className="text-center text-sm text-slate-400 dark:text-white/30 py-12">All projects loaded</p>
        )}
      </div>

      {/* Shot modal — Dribbble style */}
      <RadixDialog.Root open={!!selectedPortfolio} onOpenChange={() => setSelectedPortfolio(null)}>
        <RadixDialog.Portal>
          {/* Overlay */}
          <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

          {/* Content wrapper */}
          <RadixDialog.Content
            aria-describedby={undefined}
            className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 pb-4 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          >
            {selectedPortfolio && (
              <>
                <RadixDialog.Title className="sr-only">{selectedPortfolio.title}</RadixDialog.Title>

                  {/* ── Info panel ── */}
                  <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 flex flex-col rounded-2xl overflow-hidden shadow-2xl max-h-[88vh]">

                    {/* Panel header */}
                    <div className="flex items-start justify-between gap-3 px-8 py-4 border-b border-slate-100 dark:border-white/10 flex-shrink-0">
                      <div className="min-w-0">
                        {selectedPortfolio.category && (
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1">
                            {selectedPortfolio.category}
                          </p>
                        )}
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                          {selectedPortfolio.title}
                        </h2>
                      </div>
                      <RadixDialog.Close className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition">
                        <X size={20} />
                      </RadixDialog.Close>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 min-h-0">

                      {selectedPortfolio.description && (
                        <ArticleContent
                          html={resolveContent(selectedPortfolio.description)}
                          className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-img:mt-0"
                        />
                      )}

                      {selectedPortfolio.stack?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2">Stack</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPortfolio.stack.map((tech: string) => (
                              <span key={tech} className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/70 rounded-md">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedPortfolio.tags?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2">Tags</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPortfolio.tags.map((tag: string) => (
                              <span key={tag} className="text-xs px-2.5 py-1 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        <Link href={`/projects/${selectedPortfolio.id}`}>
                          <Button size="sm">View Full Project</Button>
                        </Link>
                        {selectedPortfolio.liveUrl && (
                          <a href={selectedPortfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <ExternalLink size={13} className="mr-1.5" />Live Site
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
              </>
            )}
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    </div>
  )
}
