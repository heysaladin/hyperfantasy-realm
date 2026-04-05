'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import dynamic from 'next/dynamic'
const TiptapEditor = dynamic(() => import('@/components/tiptap-editor').then(m => ({ default: m.TiptapEditor })), { ssr: false, loading: () => <div className="h-64 rounded-md border border-slate-200 dark:border-white/30 bg-white/5 animate-pulse" /> })
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, X, Wand2 } from 'lucide-react'
import Link from 'next/link'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NewBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [] as string[],
    isPublished: false,
  })

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
        tags: formData.tags,
        isPublished: formData.isPublished,
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
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
      <Link 
        href="/admin/blogs"
        className="inline-flex items-center text-white/60 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Blogs
      </Link>

      <h1 className="text-3xl font-bold mb-8">Add New Blog</h1>

      <form onSubmit={handleSubmit} className="admin-form space-y-6">
        
        {/* Title */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="bg-slate-50 dark:bg-white/5"
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Slug *</Label>
          <div className="flex gap-2">
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="bg-slate-50 dark:bg-white/5"
              placeholder="url-friendly-title"
            />
            <button
              type="button"
              onClick={() => setFormData(f => ({ ...f, slug: slugify(f.title) }))}
              title="Generate slug from title"
              className="shrink-0 px-3 rounded-md border border-input bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <Wand2 size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Excerpt */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            className="bg-slate-50 dark:bg-white/5"
            placeholder="Brief summary (100-200 characters)"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <Label>Content</Label>
          <div className="medium-editor">
            <TiptapEditor
              value={formData.content}
              onChange={(json) => setFormData({ ...formData, content: json })}
              placeholder="Full blog content…"
            />
          </div>
        </div>

        {/* Cover Image URL */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            type="url"
            value={formData.coverImage}
            onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
            className="bg-slate-50 dark:bg-white/5"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="tag-input">Tags</Label>
          <div
            className="flex flex-wrap gap-1.5 items-center min-h-10 px-3 py-2 rounded-md border border-input bg-slate-50 dark:bg-white/5 cursor-text"
            onClick={() => document.getElementById('tag-input')?.focus()}
          >
            {formData.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-200 dark:bg-white/15 text-slate-700 dark:text-white/80">
                {tag}
                <button
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}
                  className="hover:text-red-500 transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            <input
              id="tag-input"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  const val = tagInput.trim().replace(/,$/, '')
                  if (val && !formData.tags.includes(val)) {
                    setFormData(f => ({ ...f, tags: [...f.tags, val] }))
                  }
                  setTagInput('')
                } else if (e.key === 'Backspace' && !tagInput && formData.tags.length) {
                  setFormData(f => ({ ...f, tags: f.tags.slice(0, -1) }))
                }
              }}
              placeholder={formData.tags.length ? '' : 'Add tag…'}
              className="flex-1 min-w-24 bg-transparent outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => setFormData({...formData, isPublished: checked === true})}
              className="border-slate-300 dark:border-white/30 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white data-[state=checked]:text-white dark:data-[state=checked]:text-black"
            />
            <Label htmlFor="isPublished" className="cursor-pointer font-normal text-slate-700 dark:text-white/80">Published</Label>
          </div>
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