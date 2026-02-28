'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditPortfolioPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    tags: '',
    stack: '',
    category: '',
    complexity: 'short',
    projectDate: '',
    isVisible: false,
    isFeatured: false,
    orderIndex: 0
  })

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      fetchPortfolio(p.id)
    })
  }, [])

  const fetchPortfolio = async (portfolioId: string) => {
    try {
      const res = await fetch('/api/portfolios')
      const portfolios = await res.json()
      const portfolio = portfolios.find((p: any) => p.id === portfolioId)
      
      if (portfolio) {
        setFormData({
          title: portfolio.title || '',
          description: portfolio.description || '',
          imageUrl: portfolio.imageUrl || '',
          liveUrl: portfolio.liveUrl || '',
          githubUrl: portfolio.githubUrl || '',
          tags: portfolio.tags?.join(', ') || '',
          stack: portfolio.stack?.join(', ') || '',
          category: portfolio.category || '',
          complexity: portfolio.complexity || 'short',
          projectDate: portfolio.projectDate 
            ? new Date(portfolio.projectDate).toISOString().split('T')[0] 
            : '',
          isVisible: portfolio.isVisible || false,
          isFeatured: portfolio.isFeatured || false,
          orderIndex: portfolio.orderIndex || 0
        })
      }
      setFetching(false)
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        imageUrl: formData.imageUrl || null,
        liveUrl: formData.liveUrl || null,
        githubUrl: formData.githubUrl || null,
        tags: formData.tags 
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) 
          : [],
        stack: formData.stack 
          ? formData.stack.split(',').map(s => s.trim()).filter(Boolean) 
          : [],
        complexity: formData.complexity || null,
        category: formData.category || null,
        projectDate: formData.projectDate || null,
        isVisible: formData.isVisible,
        isFeatured: formData.isFeatured,
        orderIndex: parseInt(formData.orderIndex.toString()) || 0
      }

      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.details || error.error)
      }

      router.push('/admin/portfolios')
      router.refresh()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl">
      <Link 
        href="/admin/portfolios"
        className="inline-flex items-center text-white/60 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Portfolios
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Portfolio</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="bg-white/5 border-white/10"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="bg-white/5 border-white/10"
          />
        </div>

        {/* Image URL */}
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            className="bg-white/5 border-white/10"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input
              id="liveUrl"
              type="url"
              value={formData.liveUrl}
              onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
        </div>

        {/* Tags & Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="bg-white/5 border-white/10"
              placeholder="Web, Mobile (comma separated)"
            />
          </div>
          <div>
            <Label htmlFor="stack">Tech Stack</Label>
            <Input
              id="stack"
              value={formData.stack}
              onChange={(e) => setFormData({...formData, stack: e.target.value})}
              className="bg-white/5 border-white/10"
              placeholder="Next.js, React (comma separated)"
            />
          </div>
        </div>

        {/* Category & Complexity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/10 rounded-md"
            >
              <option value="">Select category</option>
              <option value="illustration">Illustration</option>
              <option value="ui-ux">UI/UX</option>
              <option value="development">Development</option>
            </select>
          </div>
          <div>
            <Label htmlFor="complexity">Complexity</Label>
            <select
              id="complexity"
              value={formData.complexity}
              onChange={(e) => setFormData({...formData, complexity: e.target.value})}
              className="w-full p-2 bg-white/5 border border-white/10 rounded-md"
            >
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        {/* Project Date & Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="projectDate">Project Date</Label>
            <Input
              id="projectDate"
              type="date"
              value={formData.projectDate}
              onChange={(e) => setFormData({...formData, projectDate: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <Label htmlFor="orderIndex">Order Index</Label>
            <Input
              id="orderIndex"
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({...formData, orderIndex: parseInt(e.target.value) || 0})}
              className="bg-white/5 border-white/10"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isVisible}
              onChange={(e) => setFormData({...formData, isVisible: e.target.checked})}
              className="w-4 h-4"
            />
            <span>Visible</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
              className="w-4 h-4"
            />
            <span>Featured</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Link href="/admin/portfolios">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}