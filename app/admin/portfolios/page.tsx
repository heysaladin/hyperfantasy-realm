'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Pencil, Trash2, Search, ArrowUpDown, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { resolveContentAsText } from '@/lib/tiptap-content'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

type SortOption = 'order-desc' | 'order-asc' | 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'visible-desc' | 'visible-asc'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'order-desc', label: 'Order ↓' },
  { value: 'order-asc', label: 'Order ↑' },
  { value: 'date-desc', label: 'Date ↓' },
  { value: 'date-asc', label: 'Date ↑' },
  { value: 'title-asc', label: 'Title A→Z' },
  { value: 'title-desc', label: 'Title Z→A' },
  { value: 'visible-desc', label: 'Visible First' },
  { value: 'visible-asc', label: 'Hidden First' },
]

function sortPortfolios(list: any[], sort: SortOption): any[] {
  return [...list].sort((a, b) => {
    switch (sort) {
      case 'order-desc':   return (b.orderIndex ?? 0) - (a.orderIndex ?? 0)
      case 'order-asc':    return (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
      case 'date-desc':    return new Date(b.projectDate ?? 0).getTime() - new Date(a.projectDate ?? 0).getTime()
      case 'date-asc':     return new Date(a.projectDate ?? 0).getTime() - new Date(b.projectDate ?? 0).getTime()
      case 'title-asc':    return (a.title ?? '').localeCompare(b.title ?? '')
      case 'title-desc':   return (b.title ?? '').localeCompare(a.title ?? '')
      case 'visible-desc': return (b.isVisible ? 1 : 0) - (a.isVisible ? 1 : 0)
      case 'visible-asc':  return (a.isVisible ? 1 : 0) - (b.isVisible ? 1 : 0)
      default: return 0
    }
  })
}


function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 10) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>()
  for (let i = 1; i <= 3; i++) pages.add(i)
  for (let i = total - 2; i <= total; i++) pages.add(i)
  if (current > 3 && current < total - 2) {
    pages.add(current - 1)
    pages.add(current)
    pages.add(current + 1)
  }
  const sorted = Array.from(pages).sort((a, b) => a - b)
  const result: (number | '...')[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
}

export default function AdminPortfoliosPage() {
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [jumpInput, setJumpInput] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('order-desc')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    const res = await fetch('/api/portfolios')
    const data = await res.json()
    setPortfolios(Array.isArray(data) ? data : [])
  }

  const categories = Array.from(new Set(portfolios.map((p: any) => p.category).filter(Boolean))).sort()

  const filtered = sortPortfolios(portfolios, sortBy).filter((p: any) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.title?.toLowerCase().includes(q) ||
      resolveContentAsText(p.description).toLowerCase().includes(q)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * itemsPerPage
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleSort = (value: string) => {
    setSortBy(value as SortOption)
    setCurrentPage(1)
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value)
    setCurrentPage(1)
  }

  const handleItemsPerPage = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const n = parseInt(jumpInput)
    if (!isNaN(n)) goToPage(n)
    setJumpInput('')
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/portfolios/${deleteId}`, { method: 'DELETE' })
    setDeleteId(null)
    await fetchPortfolios()
    const newTotal = Math.max(1, Math.ceil((filtered.length - 1) / itemsPerPage))
    if (currentPage > newTotal) setCurrentPage(newTotal)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Portfolios</h1>
          <p className="text-slate-600 dark:text-white/60 text-sm mt-1">
            {search || categoryFilter !== 'all'
              ? `${filtered.length} of ${portfolios.length} portfolios`
              : `Total: ${portfolios.length} portfolios`}
          </p>
        </div>
        <Link href="/admin/portfolios/new">
          <Button>
            <Plus className="mr-2" size={16} />
            Add New
          </Button>
        </Link>
      </div>

      {/* Search + sort + per-page */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" size={16} />
          <Input
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
          <SelectTrigger className="w-40 bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat: string) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-40 bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10">
            <ArrowUpDown size={14} className="mr-1 text-slate-400 dark:text-white/40" aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPage}>
          <SelectTrigger className="w-32 bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map(n => (
              <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {paginatedData.length === 0 ? (
        <div className="py-16 text-center text-slate-500 dark:text-white/40 mb-6">
          {search || categoryFilter !== 'all' ? 'No portfolios match your filters' : 'No portfolios found'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {paginatedData.map((portfolio: any) => (
            <div
              key={portfolio.id}
              className="group border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden hover:border-slate-300 dark:hover:border-white/20 transition-colors"
            >
              {/* Image */}
              <div className="relative aspect-video bg-slate-100 dark:bg-white/5">
                {portfolio.imageUrl ? (
                  <Image
                    src={portfolio.imageUrl}
                    alt={portfolio.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-white/10">
                    <ImageIcon size={28} aria-hidden="true" />
                  </div>
                )}
                {/* Status badges overlay */}
                <div className="absolute top-1.5 left-1.5 flex gap-1">
                  {!portfolio.isVisible && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-500/80 text-white font-medium">Hidden</span>
                  )}
                  {portfolio.isFeatured && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-yellow-500/80 text-white font-medium">Featured</span>
                  )}
                </div>
              </div>

              {/* Info + actions */}
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{portfolio.title}</p>
                  <p className="text-xs text-slate-400 dark:text-white/40 truncate">{portfolio.category || '—'}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Link href={`/admin/portfolios/${portfolio.id}/edit`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil size={14} aria-hidden="true" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-red-500 dark:hover:text-red-400" onClick={() => setDeleteId(portfolio.id)}>
                    <Trash2 size={14} aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Page info */}
          <p className="text-sm text-slate-500 dark:text-white/40 shrink-0">
            Page {safePage} of {totalPages} &mdash; {filtered.length} items
          </p>

          {/* Page buttons */}
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>
              Previous
            </Button>

            {getPageNumbers(safePage, totalPages).map((page, i) =>
              page === '...' ? (
                <span key={`e-${i}`} className="px-1 text-slate-400 dark:text-white/40 select-none">…</span>
              ) : (
                <Button
                  key={page}
                  variant={safePage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="min-w-9"
                >
                  {page}
                </Button>
              )
            )}

            <Button variant="outline" size="sm" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>
              Next
            </Button>
          </div>

          {/* Jump to page */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-slate-500 dark:text-white/40">Go to</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={jumpInput}
              onChange={e => setJumpInput(e.target.value)}
              onKeyDown={handleJump}
              placeholder={String(safePage)}
              className="w-16 text-center bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const n = parseInt(jumpInput)
                if (!isNaN(n)) goToPage(n)
                setJumpInput('')
              }}
            >
              Go
            </Button>
          </div>

        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this portfolio from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
