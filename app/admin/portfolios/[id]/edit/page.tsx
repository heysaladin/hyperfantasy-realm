'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import dynamic from 'next/dynamic'
const TiptapEditor = dynamic(() => import('@/components/tiptap-editor').then(m => ({ default: m.TiptapEditor })), { ssr: false, loading: () => <div className="h-64 rounded-md border border-slate-200 dark:border-white/30 bg-white/5 animate-pulse" /> })
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Wand2, X } from 'lucide-react'
import Link from 'next/link'
import { colorGroupFromHex } from '@/lib/color-group'

const COLOR_GROUP_OPTIONS = ['Red','Orange','Yellow','Green','Blue','Purple','Pink','Brown','Black','White','Grey']

export default function EditPortfolioPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [extractingColor, setExtractingColor] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [stackInput, setStackInput] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    liveUrl: '',
    copyright: '',
    tags: [] as string[],
    stack: [] as string[],
    category: '',
    complexity: 'short',
    projectDate: '',
    isVisible: false,
    isFeatured: false,
    orderIndex: 0,
    colorHex: '',
    colorGroup: '',
  })

  const extractColor = async () => {
    if (!formData.imageUrl) return
    setExtractingColor(true)
    try {
      const res = await fetch(`/api/vibrant?url=${encodeURIComponent(formData.imageUrl)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to extract color')
      setFormData(f => ({ ...f, colorHex: data.hex as string, colorGroup: data.colorGroup as string }))
    } catch (err: any) {
      alert(`Could not extract color: ${err?.message}`)
    } finally {
      setExtractingColor(false)
    }
  }

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      fetchPortfolio(p.id)
    })
  }, [])

  const fetchPortfolio = async (portfolioId: string) => {
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}`)
      if (!res.ok) throw new Error('Portfolio not found')
      const portfolio = await res.json()
      setFormData({
        title: portfolio.title || '',
        description: portfolio.description || '',
        imageUrl: portfolio.imageUrl || '',
        liveUrl: portfolio.liveUrl || '',
        copyright: portfolio.copyright || '',
        tags: Array.isArray(portfolio.tags) ? portfolio.tags : [],
        stack: Array.isArray(portfolio.stack) ? portfolio.stack : [],
        category: portfolio.category || '',
        complexity: portfolio.complexity || 'long',
        projectDate: portfolio.projectDate
          ? new Date(portfolio.projectDate).toISOString().split('T')[0]
          : '',
        isVisible: portfolio.isVisible || false,
        isFeatured: portfolio.isFeatured || false,
        orderIndex: portfolio.orderIndex || 0,
        colorHex: portfolio.colorHex || '',
        colorGroup: portfolio.colorGroup || '',
      })
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
        copyright: formData.copyright || null,
        tags: formData.tags,
        stack: formData.stack,
        complexity: formData.complexity || null,
        category: formData.category || null,
        projectDate: formData.projectDate || null,
        isVisible: formData.isVisible,
        isFeatured: formData.isFeatured,
        orderIndex: parseInt(formData.orderIndex.toString()) || 0,
        colorHex: formData.colorHex || null,
        colorGroup: formData.colorGroup || null,
        creatorId: process.env.NEXT_PUBLIC_SUPER_CREATOR
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
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
      <Link 
        href="/admin/portfolios"
        className="inline-flex items-center text-white/60 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Portfolios
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Portfolio</h1>

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

        {/* Description */}
        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <TiptapEditor
            key={id}
            value={formData.description}
            onChange={(html) => setFormData({ ...formData, description: html })}
            placeholder="Description of the project…"
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="bg-slate-50 dark:bg-white/5"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={extractColor}
              disabled={extractingColor || !formData.imageUrl}
              title="Extract dominant color from image"
              className="shrink-0 gap-1.5"
            >
              <Wand2 size={14} aria-hidden="true" />
              {extractingColor ? 'Extracting…' : 'Extract Color'}
            </Button>
          </div>
        </div>

        {/* Color Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="colorHex">Color Hex</Label>
            <div className="flex items-center gap-2">
              {formData.colorHex && (
                <span className="w-7 h-7 rounded-md border border-slate-200 dark:border-white/10 shrink-0" style={{ backgroundColor: formData.colorHex }} />
              )}
              <Input
                id="colorHex"
                value={formData.colorHex}
                onChange={e => {
                  const hex = e.target.value
                  const isValid = /^#[0-9A-Fa-f]{6}$/.test(hex)
                  setFormData(f => ({
                    ...f,
                    colorHex: hex,
                    colorGroup: isValid ? colorGroupFromHex(hex) : f.colorGroup,
                  }))
                }}
                className="bg-slate-50 dark:bg-white/5"
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="colorGroup">Color Group</Label>
            <Select
              value={formData.colorGroup}
              onValueChange={val => setFormData(f => ({ ...f, colorGroup: val }))}
            >
              <SelectTrigger id="colorGroup" className="bg-slate-50 dark:bg-white/5">
                <SelectValue placeholder="Select color group" />
              </SelectTrigger>
              <SelectContent>
                {COLOR_GROUP_OPTIONS.map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input
              id="liveUrl"
              type="url"
              value={formData.liveUrl}
              onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
              className="bg-slate-50 dark:bg-white/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="copyright">Copyright</Label>
            <Input
              id="copyright"
              value={formData.copyright}
              onChange={(e) => setFormData({...formData, copyright: e.target.value})}
              className="bg-slate-50 dark:bg-white/5"
              placeholder="© 2025 Studio Name"
            />
          </div>
        </div>

        {/* Tags & Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tag-input">Tags</Label>
            <div
              className="flex flex-wrap gap-1.5 items-center min-h-10 px-3 py-2 rounded-md border border-input bg-slate-50 dark:bg-white/5 cursor-text"
              onClick={() => document.getElementById('tag-input')?.focus()}
            >
              {(Array.isArray(formData.tags) ? formData.tags : []).map(tag => (
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
                    const tags = Array.isArray(formData.tags) ? formData.tags : []
                    if (val && !tags.includes(val)) {
                      setFormData(f => ({ ...f, tags: [...(Array.isArray(f.tags) ? f.tags : []), val] }))
                    }
                    setTagInput('')
                  } else if (e.key === 'Backspace' && !tagInput && Array.isArray(formData.tags) && formData.tags.length) {
                    setFormData(f => ({ ...f, tags: (Array.isArray(f.tags) ? f.tags : []).slice(0, -1) }))
                  }
                }}
                placeholder={Array.isArray(formData.tags) && formData.tags.length ? '' : 'Add tag…'}
                className="flex-1 min-w-24 bg-transparent outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-white/30"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="stack-input">Tech Stack</Label>
            <div
              className="flex flex-wrap gap-1.5 items-center min-h-10 px-3 py-2 rounded-md border border-input bg-slate-50 dark:bg-white/5 cursor-text"
              onClick={() => document.getElementById('stack-input')?.focus()}
            >
              {formData.stack.map(item => (
                <span key={item} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-200 dark:bg-white/15 text-slate-700 dark:text-white/80">
                  {item}
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, stack: f.stack.filter(s => s !== item) }))}
                    className="hover:text-red-500 transition-colors"
                    aria-label={`Remove ${item}`}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                id="stack-input"
                value={stackInput}
                onChange={e => setStackInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    const val = stackInput.trim().replace(/,$/, '')
                    if (val && !formData.stack.includes(val)) {
                      setFormData(f => ({ ...f, stack: [...f.stack, val] }))
                    }
                    setStackInput('')
                  } else if (e.key === 'Backspace' && !stackInput && formData.stack.length) {
                    setFormData(f => ({ ...f, stack: f.stack.slice(0, -1) }))
                  }
                }}
                placeholder={formData.stack.length ? '' : 'Add technology…'}
                className="flex-1 min-w-24 bg-transparent outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-white/30"
              />
            </div>
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
              <SelectTrigger id="category" className="bg-slate-50 dark:bg-white/5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UI-UX">UI/UX</SelectItem>
                <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                <SelectItem value="Branding">Branding</SelectItem>
                <SelectItem value="Illustration">Illustration</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="complexity">Complexity</Label>
            <Select
              value={formData.complexity}
              onValueChange={(val) => setFormData({...formData, complexity: val})}
            >
              <SelectTrigger id="complexity" className="bg-slate-50 dark:bg-white/5">
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
              className="bg-slate-50 dark:bg-white/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="orderIndex">Order Index</Label>
            <Input
              id="orderIndex"
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({...formData, orderIndex: parseInt(e.target.value) || 0})}
              className="bg-slate-50 dark:bg-white/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              className="border-slate-300 dark:border-white/30 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white data-[state=checked]:text-white dark:data-[state=checked]:text-black"
            />
            <Label htmlFor="isVisible" className="cursor-pointer font-normal text-slate-700 dark:text-white/80">Visible</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked === true})}
              className="border-slate-300 dark:border-white/30 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white data-[state=checked]:text-white dark:data-[state=checked]:text-black"
            />
            <Label htmlFor="isFeatured" className="cursor-pointer font-normal text-slate-700 dark:text-white/80">Featured</Label>
          </div>
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