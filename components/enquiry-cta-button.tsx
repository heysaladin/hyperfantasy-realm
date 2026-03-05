'use client'

import type { ReactNode } from 'react'

interface Props {
  id?: string
  className?: string
  style?: React.CSSProperties
  children: ReactNode
}

export function EnquiryCTAButton({ id, className, style, children }: Props) {
  return (
    <button
      id={id}
      type="button"
      className={className}
      style={style}
      onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry-modal'))}
    >
      {children}
    </button>
  )
}
