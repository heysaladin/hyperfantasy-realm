'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Pencil, Trash2, Search, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
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

type SortOption = 'order-desc' | 'order-asc' | 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'order-desc', label: 'Order ↓' },
  { value: 'order-asc', label: 'Order ↑' },
  { value: 'date-desc', label: 'Date ↓' },
  { value: 'date-asc', label: 'Date ↑' },
  { value: 'title-asc', label: 'Title A→Z' },
  { value: 'title-desc', label: 'Title Z→A' },
]

function sortPortfolios(list: any[], sort: SortOption): any[] {
  return [...list].sort((a, b) => {
    switch (sort) {
      case 'order-desc': return (b.orderIndex ?? 0) - (a.orderIndex ?? 0)
      case 'order-asc':  return (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
      case 'date-desc':  return new Date(b.projectDate ?? 0).getTime() - new Date(a.projectDate ?? 0).getTime()
      case 'date-asc':   return new Date(a.projectDate ?? 0).getTime() - new Date(b.projectDate ?? 0).getTime()
      case 'title-asc':  return (a.title ?? '').localeCompare(b.title ?? '')
      case 'title-desc': return (b.title ?? '').localeCompare(a.title ?? '')
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

      {/* Table */}
      <div className="border border-slate-300 dark:border-white/10 rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-300 dark:border-white/10">
            <tr>
              <th className="text-left p-4 font-semibold">Title</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Complexity</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-right p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((portfolio: any) => (
              <tr key={portfolio.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{portfolio.title}</div>
                    <div className="text-sm text-slate-600 dark:text-white/60 line-clamp-1">
                      {resolveContentAsText(portfolio.description)}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 dark:text-white/60">{portfolio.category || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded capitalize ${
                    portfolio.complexity === 'short'
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                      : 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400'
                  }`}>
                    {portfolio.complexity || '-'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    portfolio.isVisible
                      ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                  }`}>
                    {portfolio.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/admin/portfolios/${portfolio.id}/edit`}>
                      <Button variant="outline" size="sm"><Pencil size={16} /></Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(portfolio.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="p-8 text-center text-slate-500 dark:text-white/40">
            {search || categoryFilter !== 'all' ? 'No portfolios match your filters' : 'No portfolios found'}
          </div>
        )}
      </div>

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
