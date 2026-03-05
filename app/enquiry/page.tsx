'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const EMPTY = { name: '', email: '', company: '', budget: '', message: '' }
const EMPTY_ERRORS = { name: '', email: '', message: '' }

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function validate(formData: typeof EMPTY) {
  const errs = { ...EMPTY_ERRORS }
  if (!formData.name.trim())              errs.name    = 'Name is required.'
  if (!formData.email.trim())             errs.email   = 'Email is required.'
  else if (!validateEmail(formData.email)) errs.email  = 'Enter a valid email address.'
  if (!formData.message.trim())           errs.message = 'Message is required.'
  return errs
}

export default function NewEnquiryPage() {
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState(EMPTY_ERRORS)
  const [touched, setTouched]   = useState(EMPTY_ERRORS)

  const set = (field: keyof typeof EMPTY, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error as user types
    if (field in fieldErrors) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const blur = (field: keyof typeof EMPTY_ERRORS) => {
    setTouched(prev => ({ ...prev, [field]: 'true' }))
    const errs = validate({ ...formData })
    setFieldErrors(prev => ({ ...prev, [field]: errs[field] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    const errs = validate(formData)
    // Mark all required fields as touched
    setTouched({ name: 'true', email: 'true', message: 'true' })
    setFieldErrors(errs)

    if (Object.values(errs).some(Boolean)) return

    setLoading(true)
    try {
      const res = await fetch('/api/enquiries', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    formData.name.trim(),
          email:   formData.email.trim(),
          company: formData.company.trim() || null,
          budget:  formData.budget.trim()  || null,
          message: formData.message.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry')
      setSuccess(true)
      setFormData(EMPTY)
      setFieldErrors(EMPTY_ERRORS)
      setTouched(EMPTY_ERRORS)
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors pt-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-slate-500 dark:text-white/50 mb-12">
          Tell us about your project and we&apos;ll get back to you soon.
        </p>

        {success ? (
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-8 py-12 text-center"
          >
            <style>{`
              @keyframes hf-check-pop {
                0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
                60%  { transform: scale(1.2) rotate(4deg);  opacity: 1; }
                100% { transform: scale(1) rotate(0deg);    opacity: 1; }
              }
              @keyframes hf-check-draw {
                from { stroke-dashoffset: 60; }
                to   { stroke-dashoffset: 0; }
              }
              .hf-check-icon { animation: hf-check-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
              .hf-check-icon circle { animation: hf-check-draw 0.4s 0.3s ease both; stroke-dasharray: 60; }
            `}</style>
            <div className="flex justify-center mb-5">
              <CheckCircle
                size={64}
                aria-hidden="true"
                className="hf-check-icon text-green-500 dark:text-green-400"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-2xl font-semibold mb-2 text-green-700 dark:text-green-400">Message sent!</p>
            <p className="text-slate-600 dark:text-white/60 mb-6">We&apos;ll get back to you soon.</p>
            <Button variant="outline" onClick={() => setSuccess(false)}>Send another</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate aria-label="Enquiry form" className="space-y-6">
            <p className="text-sm text-slate-400 dark:text-white/30">
              Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.
            </p>

            {submitError && (
              <div role="alert" aria-live="assertive"
                className="rounded-lg px-4 py-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                {submitError}
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">
                Name <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
              </Label>
              <Input
                id="name"
                aria-required="true"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                autoComplete="name"
                value={formData.name}
                onChange={e => set('name', e.target.value)}
                onBlur={() => blur('name')}
                className={`bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 ${fieldErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Your name"
              />
              {fieldErrors.name && (
                <p id="name-error" role="alert" className="text-xs text-red-600 dark:text-red-400">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">
                Email <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
              </Label>
              <Input
                id="email"
                type="email"
                aria-required="true"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                autoComplete="email"
                value={formData.email}
                onChange={e => set('email', e.target.value)}
                onBlur={() => blur('email')}
                className={`bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 ${fieldErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="your@email.com"
              />
              {fieldErrors.email && (
                <p id="email-error" role="alert" className="text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            {/* Company */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                autoComplete="organization"
                value={formData.company}
                onChange={e => set('company', e.target.value)}
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
                onChange={e => set('budget', e.target.value)}
                className="bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
                placeholder="e.g. $5,000 – $10,000"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">
                Message <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
              </Label>
              <Textarea
                id="message"
                aria-required="true"
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                rows={6}
                value={formData.message}
                onChange={e => set('message', e.target.value)}
                onBlur={() => blur('message')}
                className={`bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 ${fieldErrors.message ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Tell us about your project..."
              />
              {fieldErrors.message && (
                <p id="message-error" role="alert" className="text-xs text-red-600 dark:text-red-400">{fieldErrors.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} aria-disabled={loading} aria-busy={loading}>
                {loading ? <span aria-live="polite">Submitting…</span> : 'Submit Enquiry'}
              </Button>
              <Link href="/">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
