'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog as RadixDialog } from 'radix-ui'
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpDown, ArrowUpNarrowWide, ArrowUpRight, ChevronDown, ExternalLink, Image, LayoutGrid, LayoutPanelTop, Search, SlidersHorizontal, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resolveContent, resolveContentAsText } from '@/lib/tiptap-content'
import { colorGroupFromHex } from '@/lib/color-group'
import { ArticleContent } from '@/components/article-content'
import { HomeFloatingCTA } from '@/components/home-floating-cta'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type TagShortcut = { id: string; name: string }

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

const COLOR_GROUPS = [
  { value: 'Red',    label: 'Red',    hex: '#E63946' },
  { value: 'Orange', label: 'Orange', hex: '#F4A261' },
  { value: 'Yellow', label: 'Yellow', hex: '#FFD166' },
  { value: 'Green',  label: 'Green',  hex: '#2D6A4F' },
  { value: 'Blue',   label: 'Blue',   hex: '#118AB2' },
  { value: 'Purple', label: 'Purple', hex: '#9B5DE5' },
  { value: 'Pink',   label: 'Pink',   hex: '#FF69B4' },
  { value: 'Brown',  label: 'Brown',  hex: '#8B4513' },
  { value: 'Black',  label: 'Black',  hex: '#1A1A1A' },
  { value: 'White',  label: 'White',  hex: '#F5F5F5' },
  { value: 'Grey',   label: 'Grey',   hex: '#9E9E9E' },
]

// Resolve colorGroup — use DB value if present, otherwise derive from colorHex
function resolveColorGroup(p: any): string | null {
  if (p.colorGroup) return p.colorGroup
  if (!p.colorHex) return null
  return colorGroupFromHex(p.colorHex)
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
  items: any[]
  gap: number
  renderItem: (item: any, index: number) => React.ReactNode
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

  // Recompute synchronously before paint on items/cols change
  useLayoutEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length)
    compute()
  }, [items, cols]) // eslint-disable-line react-hooks/exhaustive-deps

  // Recompute when container width changes (window resize handled by useCols, but also flex/layout shifts)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(compute)
    obs.observe(el)
    return () => obs.disconnect()
  }, [compute])

  // Recompute when any item's height changes (image load, showMeta toggle, etc.)
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

function PortfolioCard({ portfolio, index, onClick, showMeta, href }: { portfolio: any; index: number; onClick: () => void; showMeta: boolean; href?: string }) {
  const { ref, visible } = useLazyVisible()
  // Stagger only for the first page (initial load); scroll-in cards animate instantly
  const delay = index < PAGE_SIZE ? index * 50 : 0

  const cardInner = (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition hover:border-slate-300 dark:hover:border-white/20">
      {portfolio.imageUrl && (
        <div className="overflow-hidden bg-slate-200 dark:bg-white/5">
          <img src={portfolio.imageUrl} alt={portfolio.title} loading="lazy" decoding="async"
            className="w-full h-auto block transition group-hover:scale-105" />
        </div>
      )}
      {portfolio.complexity === 'long' && (
        <div className="absolute bottom-3 right-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-black shadow-sm shadow-black/5">
            <ArrowUpRight size={16} className="text-slate-900 dark:text-white" aria-hidden="true" />
          </div>
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
  )

  return (
    <div ref={ref} className="group block cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.35s ease-out ${delay}ms, transform 0.35s ease-out ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {href ? (
        <Link href={href} onClick={(e) => { if (portfolio.complexity !== 'long') { e.preventDefault(); onClick(); } }} className="block">
          {cardInner}
        </Link>
      ) : (
        <div onClick={onClick}>
          {cardInner}
        </div>
      )}
    </div>
  )
}

function SkeletonCard({ showMeta }: { showMeta: boolean }) {
  return (
    <div className="break-inside-avoid mb-8 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
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

  const thumb = (idx: 0 | 1, pct: number) => {
    const isLeftThumb = idx === 0
    const currentValue = isLeftThumb ? value[1] : value[0]
    const handleKeyDown = (e: React.KeyboardEvent) => {
      const inc = (e.key === 'ArrowUp' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowDown' || e.key === 'ArrowLeft') ? -1 : 0
      if (!inc) return
      e.preventDefault()
      if (isLeftThumb) {
        onChange([value[0], Math.max(Math.min(value[1] + inc, max), value[0])])
      } else {
        onChange([Math.max(Math.min(value[0] + inc, value[1]), min), value[1]])
      }
    }
    return (
      <div
        role="slider"
        aria-label={isLeftThumb ? 'Newest year' : 'Oldest year'}
        aria-valuemin={isLeftThumb ? value[0] : min}
        aria-valuemax={isLeftThumb ? max : value[1]}
        aria-valuenow={currentValue}
        tabIndex={0}
        className="absolute w-4 h-4 rounded-full bg-white border-2 border-slate-700 dark:border-white/70 -translate-x-1/2 shadow cursor-grab active:cursor-grabbing touch-none focus:outline-none focus:ring-2 focus:ring-slate-700 dark:focus:ring-white focus:ring-offset-1"
        style={{ left: `${pct}%`, zIndex: idx === 1 ? 4 : 3 }}
        onKeyDown={handleKeyDown}
        onPointerDown={e => {
          e.preventDefault()
          dragging.current = idx
          ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        }}
        onPointerMove={onPointerMove}
        onPointerUp={() => { dragging.current = null }}
      />
    )
  }

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
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Tag shortcuts
  const [tagShortcuts, setTagShortcuts] = useState<TagShortcut[]>([])
  useEffect(() => {
    fetch('/api/tags')
      .then(r => r.json())
      .then(data => setTagShortcuts(Array.isArray(data) ? data : []))
      .catch(() => setTagShortcuts([]))
  }, [])

  // All portfolios fetched once
  const [allPortfolios, setAllPortfolios] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('order')
  const [category, setCategory] = useState('')
  const [complexity, setComplexity] = useState('')
  const [showMeta, setShowMeta] = useState(true)
  const [yearRange, setYearRange] = useState<[number, number] | null>(null)
  const [colorGroup, setColorGroup] = useState('')
  const [showFeatured, setShowFeatured] = useState(false)
  const [showVisibleOnly, setShowVisibleOnly] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  // How many filtered results to display (infinite scroll)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const sentinelInView = useRef(false)
  const filterPanelRef = useRef<HTMLDivElement>(null)
  const sortPanelRef = useRef<HTMLDivElement>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)

  // Fetch all visible portfolios once on mount
  useEffect(() => {
    fetch('/api/portfolios?limit=500&offset=0')
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
    if (colorGroup) result = result.filter(p => resolveColorGroup(p) === colorGroup)

    if (user) {
      result = result.filter(p => showVisibleOnly ? p.isVisible !== false : p.isVisible === false)
    } else {
      result = result.filter(p => p.isVisible !== false)
    }

    if (showFeatured) result = result.filter(p => p.isFeatured)

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
          const orderDiff = (b.orderIndex ?? 0) - (a.orderIndex ?? 0)
          if (orderDiff !== 0) return orderDiff
          const dateDiff = new Date(b.projectDate ?? 0).getTime() - new Date(a.projectDate ?? 0).getTime()
          if (dateDiff !== 0) return dateDiff
          return (b.isVisible ? 1 : 0) - (a.isVisible ? 1 : 0)
        })
    }

    return result
  }, [allPortfolios, search, sort, category, complexity, colorGroup, yearRange, dataYears, showFeatured, showVisibleOnly, user])

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [search, sort, category, complexity, colorGroup, yearRange, showFeatured, showVisibleOnly])

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

  // Hide navbar when filter bar touches it, reveal on scroll up
  useEffect(() => {
    const NAV_H = 64
    let lastY = window.scrollY
    let hidden = false

    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastY

      if (filterBarRef.current) {
        const barTop = filterBarRef.current.getBoundingClientRect().top
        // Filter bar is touching the navbar when its top <= NAV_H
        if (goingDown && barTop <= NAV_H && !hidden) {
          document.documentElement.style.setProperty('--nav-offset', `-${NAV_H}px`)
          hidden = true
        } else if (!goingDown && hidden) {
          document.documentElement.style.setProperty('--nav-offset', '0px')
          hidden = false
        }
      }

      lastY = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.documentElement.style.setProperty('--nav-offset', '0px')
    }
  }, [])

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
    setColorGroup('')
    setShowFeatured(false)
    setShowVisibleOnly(true)
    if (dataYears) setYearRange([dataYears.min, dataYears.max])
  }

  const activeSortCount = sort !== 'order' ? 1 : 0
  const activeFilterCount = [
    category !== '',
    complexity !== '',
    colorGroup !== '',
    showFeatured,
    user && !showVisibleOnly,
    dataYears && yearRange && (yearRange[0] > dataYears.min || yearRange[1] < dataYears.max),
  ].filter(Boolean).length

  const handleClick = (portfolio: any) => {
    if (portfolio.complexity === 'long') {
      router.push(`/projects/${portfolio.id}`)
    } else {
      setSelectedPortfolio(portfolio)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors pt-16">

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Hyperfantasy&apos;s Projects</h1>
          <p className="text-xl text-slate-600 dark:text-white/60">Selected projects showcasing our expertise</p>
        </div>
      </div>

      {/* Search + Sort & Filter */}
      <div ref={filterBarRef} className="border-b border-slate-200 dark:border-white/10 sticky z-10 bg-white/95 dark:bg-black/95 backdrop-blur-sm transition-[top] duration-300"
        style={{ top: 'calc(var(--nav-offset, 0px) + 64px)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">

            {/* Left: Search + meta toggle */}
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" aria-hidden="true" />
                <label htmlFor="project-search" className="sr-only">Search projects</label>
                <input
                  id="project-search"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search projects…"
                  className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-slate-400 dark:focus:border-white/30 transition placeholder:text-slate-400 dark:placeholder:text-white/30"
                />
                {search && (
                  <button onClick={() => setSearch('')} aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60 transition">
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
              <button
                aria-label={showMeta ? 'Switch to image-only view' : 'Switch to detailed view'}
                aria-pressed={!showMeta}
                onClick={() => setShowMeta(v => !v)}
                className={`px-2.5 py-2.5 rounded-lg border transition flex-shrink-0 ${
                  !showMeta
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {showMeta ? <Image size={15} aria-hidden="true" /> : <LayoutPanelTop size={15} aria-hidden="true" />}
              </button>
            </div>

            {/* Right: Sort dropdown */}
            <div className="relative flex-shrink-0" ref={sortPanelRef}>
              <button
                aria-expanded={isSortOpen}
                aria-controls="sort-panel"
                aria-haspopup="listbox"
                onClick={() => { setIsSortOpen(v => !v); setIsFilterOpen(false) }}
                className={`flex items-center gap-2 px-3 py-3 text-sm rounded-lg border transition ${
                  isSortOpen || activeSortCount > 0
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <ArrowUpDown size={14} aria-hidden="true" />
                <span className="hidden md:inline">Sort</span>
                {activeSortCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {activeSortCount}
                  </span>
                )}
                <ChevronDown size={13} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {isSortOpen && (
                <div id="sort-panel" role="listbox" aria-label="Sort options" className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-20">
                  <div className="p-3 space-y-1">
                    {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        role="option"
                        aria-selected={sort === value}
                        onClick={() => { setSort(value); setIsSortOpen(false) }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                          sort === value
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                            : 'text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <Icon size={13} aria-hidden="true" />
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
                aria-expanded={isFilterOpen}
                aria-controls="filter-panel"
                aria-haspopup="dialog"
                onClick={() => { setIsFilterOpen(v => !v); setIsSortOpen(false) }}
                className={`flex items-center gap-2 px-3 py-3 text-sm rounded-lg border transition ${
                  isFilterOpen || activeFilterCount > 0
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <SlidersHorizontal size={14} aria-hidden="true" />
                <span className="hidden md:inline">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown size={13} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {isFilterOpen && (
                <div id="filter-panel" role="dialog" aria-label="Filter projects" className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-20">

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

                  {/* Color group section */}
                  <div className="p-4 border-b border-slate-100 dark:border-white/10">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3">Color</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        onClick={() => setColorGroup('')}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          colorGroup === ''
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'
                        }`}
                      >
                        All
                      </button>
                      {COLOR_GROUPS.map(({ value, label, hex }) => (
                        <button
                          key={value}
                          onClick={() => setColorGroup(colorGroup === value ? '' : value)}
                          aria-label={label}
                          aria-pressed={colorGroup === value}
                          title={label}
                          className={`w-5 h-5 rounded-full transition-transform ${
                            colorGroup === value
                              ? 'ring-2 ring-offset-2 ring-slate-700 dark:ring-white ring-offset-white dark:ring-offset-zinc-900 scale-110'
                              : 'hover:scale-110'
                          } ${value === 'White' ? 'border border-slate-200 dark:border-white/20' : ''}`}
                          style={{ backgroundColor: hex }}
                        />
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

                  {/* Featured section — all users */}
                  <div className="p-4 border-b border-slate-100 dark:border-white/10">
                    <button
                      role="switch"
                      aria-checked={showFeatured}
                      onClick={() => setShowFeatured(v => !v)}
                      className="flex items-center justify-between w-full group"
                    >
                      <span className={`text-xs font-medium transition-colors ${showFeatured ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/40'}`}>Show featured projects</span>
                      <span className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none ${
                        showFeatured ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-white/10'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-900 shadow transition-transform duration-200 ${
                          showFeatured ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </span>
                    </button>
                  </div>

                  {/* Visibility section — logged-in only */}
                  {user && <div className="p-4 border-b border-slate-100 dark:border-white/10">
                    <button
                      role="switch"
                      aria-checked={showVisibleOnly}
                      onClick={() => setShowVisibleOnly(v => !v)}
                      className="flex items-center justify-between w-full group"
                    >
                      <span className={`text-xs font-medium transition-colors ${showVisibleOnly ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/40'}`}>Show visible projects</span>
                      <span className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none ${
                        showVisibleOnly ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-white/10'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-900 shadow transition-transform duration-200 ${
                          showVisibleOnly ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </span>
                    </button>
                  </div>}

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

      {/* Tag shortcuts bar — desktop only */}
      {tagShortcuts.length > 0 && (
        <div className="hidden lg:block border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2">
            <div className="flex flex-wrap gap-1.5">
              {tagShortcuts.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSearch(search === tag.name ? '' : tag.name)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition ${
                    search === tag.name
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-16">
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} showMeta={showMeta} />)}
          </div>
        ) : (
          <MasonryGrid
            items={displayed}
            gap={MASONRY_GAP}
            renderItem={(portfolio, index) => (
              <PortfolioCard portfolio={portfolio} index={index} onClick={() => handleClick(portfolio)} showMeta={showMeta} href={`/projects/${portfolio.id}`} />
            )}
          />
        )}

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
            className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:pt-10 sm:px-4 sm:pb-4 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            onClick={() => setSelectedPortfolio(null)}
          >
            {selectedPortfolio && (
              <>
                <RadixDialog.Title className="sr-only">{selectedPortfolio.title}</RadixDialog.Title>

                  {/* ── Info panel ── */}
                  <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 flex flex-col rounded-none sm:rounded-2xl overflow-hidden shadow-2xl h-full sm:h-auto sm:max-h-[88vh]"
                    onClick={e => e.stopPropagation()}
                  >

                    {/* Panel header */}
                    <div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-5 pb-4 border-b border-slate-100 dark:border-white/10 flex-shrink-0">
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
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-3 pb-7 space-y-6 min-h-0">

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

                      <div className="flex items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-3">
                          <Link href={`/projects/${selectedPortfolio.id}`}>
                            <Button variant="outline" size="sm" className="cursor-pointer px-3">View Full Project</Button>
                          </Link>
                          {selectedPortfolio.liveUrl && (
                            <a href={selectedPortfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <ExternalLink size={13} className="mr-1.5" />Live Site
                              </Button>
                            </a>
                          )}
                        </div>
                        {selectedPortfolio.projectDate && (
                          <span className="text-xs text-slate-400 dark:text-white/30 tabular-nums shrink-0">
                            {new Date(selectedPortfolio.projectDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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

      <HomeFloatingCTA ctaBtnId="" alwaysVisible />
    </div>
  )
}
