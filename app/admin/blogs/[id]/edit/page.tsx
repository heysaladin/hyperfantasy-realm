'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditBlogPage({
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
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    isPublished: false,
  })

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      fetchBlog(p.id)
    })
  }, [])

  const fetchBlog = async (blogId: string) => {
    try {
      const res = await fetch('/api/blogs')
      const blogs = await res.json()
      const blog = blogs.find((p: any) => p.id === blogId)
      
      if (blog) {
        setFormData({
          title: blog.title || '',
          slug: blog.slug || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          coverImage: blog.coverImage || '',
          tags: blog.tags?.join(', ') || '',
          isPublished: blog.isPublished || false,
        })
      }
      setFetching(false)
    } catch (error) {
      console.error('Error fetching blog:', error)
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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
        authorId: process.env.NEXT_PUBLIC_SUPER_CREATOR
      }

      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update blog')
      }

      router.push('/admin/blogs')
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
        href="/admin/blogs"
        className="inline-flex items-center text-white/60 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Blogs
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Blog</h1>

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
            {loading ? 'Saving...' : 'Save Changes'}
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