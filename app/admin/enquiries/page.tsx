'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Link from 'next/link'
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
      setEnquiries(Array.isArray(data) ? data : [])
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

  const handleDelete = async () => {
    if (!deleteId) return
    
    await fetch(`/api/enquiries/${deleteId}`, { method: 'DELETE' })
    await fetchEnquiries()
    setDeleteId(null)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Enquiries</h1>
          <p className="text-white/60 text-sm mt-1">
            Total: {filteredEnquiries.length} enquiries
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <Input
          placeholder="Search by name or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/5 border-white/10"
        />
      </div>

      {/* Table */}
      <div className="border border-white/10 rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
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
              <tr key={enquiry.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{enquiry.name}</div>
                    <div className="text-sm text-white/60 line-clamp-1">
                      {enquiry.message}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-white/60 capitalize">{enquiry.email || '-'}</td>
                <td className="p-4 text-white/60 capitalize">{enquiry.date || '-'}</td>
                <td className="p-4 text-white/60 capitalize">{enquiry.status || '-'}</td>
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
          <div className="p-8 text-center text-white/40">
            No enquiries found
          </div>
        )}
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