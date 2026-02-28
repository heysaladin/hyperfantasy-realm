'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
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
    <div className="p-8 max-w-4xl">
      <Link 
        href="/"
        className="inline-flex items-center text-white/60 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-8">Add New Enquiry</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Name */}
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="your@email.com"
          />
        </div>

        {/* Company */}
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="Your company name"
          />
        </div>

        {/* Budget */}
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
            className="bg-white/5 border-white/10"
            placeholder="e.g. $5000 - $10000"
          />
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="bg-white/5 border-white/10"
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
  )
}