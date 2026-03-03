'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TiptapEditor } from '@/components/tiptap-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPortfolioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    liveUrl: '',
    copyright: '',
    tags: '',
    stack: '',
    category: '',
    complexity: 'long',
    projectDate: '',
    isVisible: false,
    isFeatured: false,
    orderIndex: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
        const payload = {
        title: formData.title,
        description: formData.description || null,
        imageUrl: formData.imageUrl || null,
        liveUrl: formData.liveUrl || null,
        copyright: formData.copyright || null,
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
        orderIndex: parseInt(formData.orderIndex.toString()) || 0,
        teamId: null,
        creatorId: process.env.NEXT_PUBLIC_SUPER_CREATOR
        }

        console.log('Sending payload:', payload)

        const res = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
        })

        // Check response before parsing JSON
        console.log('Response status:', res.status)
        console.log('Response headers:', res.headers)
        
        const text = await res.text()  // ← Get as text first
        console.log('Response text:', text)
        
        if (!text) {
        throw new Error('Empty response from server')
        }

        const data = JSON.parse(text)  // ← Then parse
        
        if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to create')
        }

        console.log('Success:', data)
        router.push('/admin/portfolios')
        router.refresh()
        
    } catch (error: any) {
        console.error('Submit error:', error)
        alert(`Error: ${error.message}`)
        setLoading(false)
    }
    }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
      <Link 
        href="/admin/portfolios"
        className="inline-flex items-center text-white/60 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Portfolios
      </Link>

      <h1 className="text-3xl font-bold mb-8">Add New Portfolio</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <TiptapEditor
            value={formData.description}
            onChange={(html) => setFormData({ ...formData, description: html })}
            placeholder="Brief description of the project…"
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* Links Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input
              id="liveUrl"
              type="url"
              value={formData.liveUrl}
              onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
              className="bg-white/5 border-white/10"
              placeholder="https://example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="copyright">Copyright</Label>
            <Input
              id="copyright"
              value={formData.copyright}
              onChange={(e) => setFormData({...formData, copyright: e.target.value})}
              className="bg-white/5 border-white/10"
              placeholder="© 2025 Studio Name"
            />
          </div>
        </div>

        {/* Tags & Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="bg-white/5 border-white/10"
              placeholder="Web, Mobile, E-commerce (comma separated)"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="stack">Tech Stack</Label>
            <Input
              id="stack"
              value={formData.stack}
              onChange={(e) => setFormData({...formData, stack: e.target.value})}
              className="bg-white/5 border-white/10"
              placeholder="Next.js, React, Tailwind (comma separated)"
            />
          </div>
        </div>

        {/* Category & Complexity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(val) => setFormData({...formData, category: val})}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ui-ux">UI/UX</SelectItem>
                <SelectItem value="graphic-design">Graphic Design</SelectItem>
                <SelectItem value="branding">Branding</SelectItem>
                <SelectItem value="illustration">Illustration</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="complexity">Complexity</Label>
            <Select
              value={formData.complexity}
              onValueChange={(val) => setFormData({...formData, complexity: val})}
            >
              <SelectTrigger id="complexity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Project Date & Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="projectDate">Project Date</Label>
            <Input
              id="projectDate"
              type="date"
              value={formData.projectDate}
              onChange={(e) => setFormData({...formData, projectDate: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="orderIndex">Order Index</Label>
            <Input
              id="orderIndex"
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({...formData, orderIndex: parseInt(e.target.value) || 0})}
              className="bg-white/5 border-white/10"
              placeholder="0"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isVisible"
              checked={formData.isVisible}
              onCheckedChange={(checked) => setFormData({...formData, isVisible: checked === true})}
            />
            <Label htmlFor="isVisible" className="cursor-pointer font-normal">Visible</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked === true})}
            />
            <Label htmlFor="isFeatured" className="cursor-pointer font-normal">Featured</Label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Portfolio'}
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