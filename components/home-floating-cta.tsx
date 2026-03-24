'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Send, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'
const EMPTY = { name: '', email: '', company: '', budget: '', message: '' }
const EMPTY_ERRORS = { name: '', email: '', message: '' }

const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])'

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function validate(formData: typeof EMPTY) {
  const errs = { ...EMPTY_ERRORS }
  if (!formData.name.trim())               errs.name    = 'Name is required.'
  if (!formData.email.trim())              errs.email   = 'Email is required.'
  else if (!validateEmail(formData.email)) errs.email   = 'Enter a valid email address.'
  if (!formData.message.trim())            errs.message = 'Message is required.'
  return errs
}

export function HomeFloatingCTA({ ctaBtnId, alwaysVisible, scrollThreshold = 0 }: { ctaBtnId: string; alwaysVisible?: boolean; scrollThreshold?: number }) {
  const [visible, setVisible]   = useState(!!alwaysVisible)
  const [open, setOpen]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState(EMPTY_ERRORS)

  const [mounted, setMounted]   = useState(false)
  const [rendered, setRendered] = useState(false)

  const triggerRef  = useRef<HTMLButtonElement>(null)
  const dialogRef   = useRef<HTMLDivElement>(null)
  const headingId   = 'enquiry-modal-title'

  useEffect(() => { setMounted(true) }, [])

  // Keep button in DOM during exit animation
  useEffect(() => {
    if (visible) {
      setRendered(true)
    } else {
      const t = setTimeout(() => setRendered(false), 400)
      return () => clearTimeout(t)
    }
  }, [visible])

  // Listen for external triggers (e.g. hero / bottom CTA buttons)
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-enquiry-modal', handler)
    return () => window.removeEventListener('open-enquiry-modal', handler)
  }, [])

  // Scroll visibility (skipped when alwaysVisible)
  useEffect(() => {
    if (!mounted) return
    if (alwaysVisible) return
    const ctaBtn = document.getElementById(ctaBtnId)
    if (!ctaBtn) return
    let ctaOutOfView = false
    let scrolledEnough = scrollThreshold === 0

    const update = () => {
      const show = ctaOutOfView && scrolledEnough
      setVisible(show)
      ctaBtn.style.visibility = show ? 'hidden' : 'visible'
    }

    const observer = new IntersectionObserver(([entry]) => {
      ctaOutOfView = !entry.isIntersecting
      update()
    }, { threshold: 0.1 })

    const onScroll = () => {
      scrolledEnough = window.scrollY > scrollThreshold
      update()
    }

    observer.observe(ctaBtn)
    if (scrollThreshold > 0) {
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      ctaBtn.style.visibility = 'visible'
    }
  }, [ctaBtnId, alwaysVisible, mounted, scrollThreshold])

  // Lock scroll + focus first input + Escape key when modal opens
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'

    // Focus first focusable element
    const frame = requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      first?.focus()
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = () => {
    setOpen(false)
    setSuccess(false)
    setSubmitError('')
    setFieldErrors(EMPTY_ERRORS)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const setField = (field: keyof typeof EMPTY, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field in fieldErrors) setFieldErrors(prev => ({ ...prev, [field]: '' }))
  }

  const blurField = (field: keyof typeof EMPTY_ERRORS) => {
    const errs = validate({ ...formData })
    setFieldErrors(prev => ({ ...prev, [field]: errs[field] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    const errs = validate(formData)
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
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit')
      }
      setSuccess(true)
      setFormData(EMPTY)
      setFieldErrors(EMPTY_ERRORS)
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating trigger button — portalled to body, only rendered when visible */}
      {mounted && rendered && createPortal(
        <div style={{
          position:  'fixed',
          bottom:     32,
          right:      32,
          zIndex:     50,
          animation: visible
            ? 'hfSlideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : 'hfSlideDown 0.4s ease forwards',
        }}>
          <style>{`
            @keyframes hfSlideUp   { from { transform: translateY(80px); opacity: 0 } to { transform: none; opacity: 1 } }
            @keyframes hfSlideDown { from { transform: none; opacity: 1 } to { transform: translateY(80px); opacity: 0 } }
          `}</style>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open enquiry form — Let's talk!"
            aria-haspopup="dialog"
            style={{
              background:     GRADIENT,
              color:          '#fff',
              borderRadius:   '50%',
              width:           56,
              height:          56,
              display:        'inline-flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      '0 8px 32px rgba(0,0,0,0.3)',
              border:         'none',
              cursor:         'pointer',
            }}
          >
            <Send size={22} aria-hidden="true" />
          </button>
        </div>,
        document.body
      )}

      {/* Modal backdrop */}
      {open && (
        <div
          onClick={close}
          style={{
            position:       'fixed',
            inset:           0,
            zIndex:          100,
            background:     'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '16px',
          }}
        >
          {/* Dialog */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            onClick={e => e.stopPropagation()}
            style={{
              borderRadius: 20,
              width:        '100%',
              maxWidth:      520,
              maxHeight:    '90vh',
              overflowY:    'auto',
              padding:      '32px',
              position:     'relative',
              boxShadow:    '0 24px 64px rgba(0,0,0,0.4)',
            }}
            className="bg-white dark:bg-[#0d0b1e] text-slate-900 dark:text-white"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close enquiry form"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {/* Success state */}
            {success ? (
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="text-center py-8"
              >
                <div aria-hidden="true" style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: GRADIENT, display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                }}>
                  <Check size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <h2 id={headingId} className="text-2xl font-semibold mb-2">Message sent!</h2>
                <p className="text-slate-500 dark:text-white/50 mb-6">
                  We&apos;ll get back to you soon.
                </p>
                <Button onClick={close}>Close</Button>
              </div>
            ) : (
              <>
                <h2 id={headingId} className="text-2xl font-semibold mb-1">Get in Touch</h2>
                <p className="text-slate-500 dark:text-white/50 text-sm mb-1">
                  Tell us about your fantasy project.
                </p>
                <p className="text-slate-400 dark:text-white/30 text-xs mb-6" aria-hidden="true">
                  Fields marked <span aria-hidden="true">*</span> are required.
                </p>

                {submitError && (
                  <div role="alert" aria-live="assertive"
                    className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="modal-name">
                        Name <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                      </Label>
                      <Input
                        id="modal-name"
                        aria-required="true"
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'modal-name-error' : undefined}
                        autoComplete="name"
                        value={formData.name}
                        onChange={e => setField('name', e.target.value)}
                        onBlur={() => blurField('name')}
                        className={`bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 ${fieldErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="Your name"
                      />
                      {fieldErrors.name && (
                        <p id="modal-name-error" role="alert" className="text-xs text-red-600 dark:text-red-400">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="modal-email">
                        Email <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                      </Label>
                      <Input
                        id="modal-email"
                        type="email"
                        aria-required="true"
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? 'modal-email-error' : undefined}
                        autoComplete="email"
                        value={formData.email}
                        onChange={e => setField('email', e.target.value)}
                        onBlur={() => blurField('email')}
                        className={`bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 ${fieldErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="your@email.com"
                      />
                      {fieldErrors.email && (
                        <p id="modal-email-error" role="alert" className="text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="modal-company">Company</Label>
                      <Input
                        id="modal-company"
                        autoComplete="organization"
                        value={formData.company}
                        onChange={e => setField('company', e.target.value)}
                        className="bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
                        placeholder="Company name"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="modal-budget">Budget</Label>
                      <Input
                        id="modal-budget"
                        value={formData.budget}
                        onChange={e => setField('budget', e.target.value)}
                        className="bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10"
                        placeholder="e.g. $5k – $10k"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="modal-message">
                      Message <span aria-hidden="true">*</span><span className="sr-only">(required)</span>
                    </Label>
                    <Textarea
                      id="modal-message"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? 'modal-message-error' : undefined}
                      rows={5}
                      value={formData.message}
                      onChange={e => setField('message', e.target.value)}
                      onBlur={() => blurField('message')}
                      className={`bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 ${fieldErrors.message ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="Tell us about your project..."
                    />
                    {fieldErrors.message && (
                      <p id="modal-message-error" role="alert" className="text-xs text-red-600 dark:text-red-400">{fieldErrors.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      aria-disabled={loading}
                      aria-busy={loading}
                      style={{ background: GRADIENT, opacity: loading ? 0.7 : 1 }}
                      className="flex-1 text-white font-semibold rounded-full py-2.5 text-sm transition-opacity disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                    >
                      {loading ? <span aria-live="polite">Sending…</span> : 'Send Enquiry'}
                    </button>
                    <Button type="button" variant="outline" onClick={close}>Cancel</Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
