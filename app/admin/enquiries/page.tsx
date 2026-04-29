'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown } from 'lucide-react'
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

const STATUS_OPTIONS = ['new', 'in progress', 'done', 'closed']

const STATUS_STYLES: Record<string, string> = {
  'new':         'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'in progress': 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  'done':        'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  'closed':      'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40',
}

function StatusDropdown({ status, onChange }: { status: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded capitalize font-medium transition hover:opacity-80 ${STATUS_STYLES[status] ?? STATUS_STYLES['new']}`}
      >
        {status}
        <ChevronDown size={11} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-32 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-lg py-1">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-slate-100 dark:hover:bg-white/10 transition ${s === status ? 'font-semibold' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [filteredEnquiries, setFilteredEnquiries] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const itemsPerPage = 6

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries')
      if (!res.ok) {
        console.error('API error:', res.status)
        return
      }
      const data = await res.json()
      console.log('Enquiries fetched:', data) // Debug log
      const sorted = (Array.isArray(data) ? data : []).sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setEnquiries(sorted)
      setFilteredEnquiries(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  // Search filter
  useEffect(() => {
    const filtered = enquiries.filter((p: any) => 
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.message?.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredEnquiries(filtered)
    setCurrentPage(1)
  }, [search, enquiries])

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage)

  const updateStatus = async (id: string, status: string) => {
    setEnquiries(prev => prev.map((e: any) => e.id === id ? { ...e, status } : e))
    await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    await fetch(`/api/enquiries/${deleteId}`, { method: 'DELETE' })
    await fetchEnquiries()
    setDeleteId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap gap-4 justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Enquiries</h1>
          <p className="text-slate-600 dark:text-white/60 text-sm mt-1">
            Total: {filteredEnquiries.length} enquiries
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" size={20} />
        <Input
          placeholder="Search by name or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
        />
      </div>

      {/* Table */}
      <div className="border border-slate-300 dark:border-white/10 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-300 dark:border-white/10">
            <tr>
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Date</th>
              <th className="text-left p-4 font-semibold">Status</th>
              {/* <th className="text-right p-4 font-semibold">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((enquiry: any) => (
              <tr key={enquiry.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{enquiry.name}</div>
                    <div className="text-sm text-slate-600 dark:text-white/60 line-clamp-1">
                      {enquiry.message}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 dark:text-white/60 capitalize">{enquiry.email || '-'}</td>
                <td className="p-4 text-slate-600 dark:text-white/60">
                  {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                </td>
                <td className="p-4">
                  <StatusDropdown
                    status={enquiry.status || 'new'}
                    onChange={(s) => updateStatus(enquiry.id, s)}
                  />
                </td>
                {/* <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/admin/enquiries/${enquiry.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Pencil size={16} />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setDeleteId(enquiry.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="p-8 text-center text-slate-500 dark:text-white/40">
            No enquiries found
          </div>
        )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-10"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this enquiry
              from the database.
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