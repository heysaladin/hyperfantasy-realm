'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    isPublished: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if env var is available
      const authorId = process.env.NEXT_PUBLIC_SUPER_CREATOR
      console.log('Author ID from env:', authorId)
      
      if (!authorId) {
        throw new Error('NEXT_PUBLIC_SUPER_CREATOR environment variable is not set')
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content || null,
        coverImage: formData.coverImage || null,
        tags: formData.tags 
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) 
          : [],
        isPublished: formData.isPublished,
        authorId: authorId
      }

      console.log('Sending payload:', payload)

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('Response status:', res.status)

      const data = await res.json()
      console.log('Response data:', data)
      
      if (!res.ok) {
        throw new Error(data.error || data.message || `Server error: ${res.status}`)
      }

      console.log('Success:', data)
      alert('Blog created successfully!')
      router.push('/admin/blogs')
      router.refresh()
    } catch (error: any) {
      console.error('Submit error:', error)
      alert(`Error: ${error.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <Link 
        href="/admin/blogs"
        className="inline-flex items-center text-white/60 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Blogs
      </Link>

      <h1 className="text-3xl font-bold mb-8">Add New Blog</h1>

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

        {/* Slug */}
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            required
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="url-friendly-title"
          />
        </div>

        {/* Excerpt */}
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="Brief summary (100-200 characters)"
          />
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="Full blog content"
          />
        </div>

        {/* Cover Image URL */}
        <div>
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            type="url"
            value={formData.coverImage}
            onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="tag1, tag2, tag3"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
              className="w-4 h-4"
            />
            <span>Published</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Blog'}
          </Button>
          <Link href="/admin/blogs">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}