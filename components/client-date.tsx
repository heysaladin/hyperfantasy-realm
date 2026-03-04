'use client'

export function ClientDate({ date }: { date: string }) {
  return (
    <time className="text-sm text-slate-500 dark:text-white/40">
      {new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })}
    </time>
  )
}