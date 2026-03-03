'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewEnquiryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        budget: formData.budget || null,
        message: formData.message,
      }

      console.log('Sending payload:', payload)

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry')
      }

      console.log('Success:', data)
      alert('Enquiry submitted successfully!')
      setFormData({
        name: '',
        email: '',
        company: '',
        budget: '',
        message: '',
      })
      router.refresh()
    } catch (error: any) {
      console.error('Submit error:', error)
      alert(`Error: ${error.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors pt-16">
<div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">Get in Touch</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
            placeholder="your@email.com"
          />
        </div>

        {/* Company */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
            placeholder="Your company name"
          />
        </div>

        {/* Budget */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
            className="bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
            placeholder="e.g. $5000 - $10000"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
            placeholder="Tell us about your project..."
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Enquiry'}
          </Button>
          <Link href="/">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
      </div>
    </div>
  )
}