'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const GRADIENT = 'linear-gradient(256.86deg,#0cf1d7 -37.8%,#114ef7 58.71%,#a91bff 102.4%,#fc7541 123.84%)'

export function HomeFloatingCTA({ ctaBtnId }: { ctaBtnId: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const ctaBtn = document.getElementById(ctaBtnId)
    if (!ctaBtn) return

    const check = () => {
      const rect      = ctaBtn.getBoundingClientRect()
      const ctaInView = rect.top < window.innerHeight && rect.bottom > 0
      const scrolled  = window.scrollY > 300

      if (scrolled && !ctaInView) {
        setVisible(true)
        ctaBtn.style.visibility = 'hidden'
      } else {
        setVisible(false)
        ctaBtn.style.visibility = 'visible'
      }
    }

    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => {
      window.removeEventListener('scroll', check)
      ctaBtn.style.visibility = 'visible'
    }
  }, [ctaBtnId])

  return (
    <div style={{
      position:   'fixed',
      bottom:      32,
      right:       32,
      zIndex:      50,
      transform:   visible ? 'translateY(0)' : 'translateY(120px)',
      transition:  'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <Link href="/enquiry">
        <button style={{
          background:  GRADIENT,
          color:       '#fff',
          border:      'none',
          borderRadius: 48,
          padding:     '13px 24px',
          fontSize:     15,
          fontWeight:   600,
          cursor:      'pointer',
          display:     'inline-flex',
          alignItems:  'center',
          gap:          8,
          boxShadow:   '0 8px 32px rgba(0,0,0,0.3)',
          fontFamily:  'var(--font-sora, sans-serif)',
          whiteSpace:  'nowrap',
        }}>
          Let&apos;s talk! <ArrowRight size={16} />
        </button>
      </Link>
    </div>
  )
}
