'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Search, SearchX, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ArticleContent } from '@/components/article-content'
import { resolveContent } from '@/lib/tiptap-content'
import { createClient } from '@/lib/supabase/client'

const PAGE_SIZE = 6

export default function ArticlesPage() {
  const [allBlogs, setAllBlogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showDrafts, setShowDrafts] = useState(false)
  const searchBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(!!user)
    })
  }, [])

  useEffect(() => {
    fetch('/api/blogs')
      .then(r => r.json())
      .then(data => setAllBlogs(Array.isArray(data) ? data : []))
      .catch(() => setAllBlogs([]))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = isAdmin && showDrafts ? allBlogs : allBlogs.filter(b => b.isPublished)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
        b.excerpt?.toLowerCase().includes(q)
      )
    }
    const pinned = result.filter(b => (b.index ?? 0) >= 1).sort((a, b) => (b.index ?? 0) - (a.index ?? 0))
    const normal = result.filter(b => (b.index ?? 0) === 0)
    const buried = result.filter(b => (b.index ?? 0) <= -1).sort((a, b) => (b.index ?? 0) - (a.index ?? 0))
    return [...pinned, ...normal, ...buried]
  }, [allBlogs, search, isAdmin, showDrafts])

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1) }, [search])

  // Hide navbar when search bar touches it, reveal on scroll up
  useEffect(() => {
    const NAV_H = 64
    let lastY = window.scrollY
    let hidden = false
    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastY
      if (searchBarRef.current) {
        const barTop = searchBarRef.current.getBoundingClientRect().top
        if (goingDown && barTop <= NAV_H && !hidden) {
          document.documentElement.style.setProperty('--nav-offset', `-${NAV_H}px`)
          hidden = true
        } else if (!goingDown && hidden) {
          document.documentElement.style.setProperty('--nav-offset', '0px')
          hidden = false
        }
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.documentElement.style.setProperty('--nav-offset', '0px')
    }
  }, [])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors pt-16">

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-[728px] mx-auto px-6 pt-14 pb-10">
          <h1 style={{
            fontFamily: 'var(--font-geist-sans), "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.016em',
            color: 'inherit',
            marginBottom: '12px',
          }}>Articles</h1>
          <p style={{
            fontFamily: 'var(--font-geist-sans)',
            fontSize: '16px',
            lineHeight: 1.5,
            color: '#6b6b6b',
          }} className="dark:!text-white/40">
            Thoughts on design, development, and everything in between
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div ref={searchBarRef} className="border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-black/95 sticky z-10 backdrop-blur-sm transition-[top] duration-300"
        style={{ top: 'calc(var(--nav-offset, 0px) + 64px)' }}>
        <div className="max-w-[728px] mx-auto px-6 py-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" aria-hidden="true" />
            <label htmlFor="articles-search" className="sr-only">Search articles</label>
            <input
              id="articles-search"
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-slate-400 dark:focus:border-white/30 transition placeholder:text-slate-400 dark:placeholder:text-white/30"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60 transition"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
          {isAdmin && (
            <label className="flex-shrink-0 flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-medium text-slate-500 dark:text-white/40" style={{ fontFamily: 'var(--font-geist-sans)' }}>Drafts</span>
              <span
                onClick={() => setShowDrafts(v => !v)}
                role="switch"
                aria-checked={showDrafts}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${showDrafts ? 'bg-amber-400' : 'bg-slate-300 dark:bg-white/20'}`}
              >
                <span
                  className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: showDrafts ? 'translateX(16px)' : 'translateX(0px)' }}
                />
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Article list */}
      <div className="max-w-[728px] mx-auto px-6 pt-0 pb-20">

        {isLoading ? (
          <div className="divide-y divide-slate-200 dark:divide-white/10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-6 py-8 animate-pulse">
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded" />
                  <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-4/5" />
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-2/3" />
                </div>
                <div className="w-28 h-20 rounded bg-slate-200 dark:bg-white/10 flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-white/10">
            {paginated.map((blog: any) => (
              <Link key={blog.id} href={`/articles/${blog.slug}`} className="block group py-8 first:pt-10">
                <article>
                  {/* Date — top */}
                  <time style={{
                    fontFamily: 'var(--font-geist-sans)',
                    fontSize: '12px',
                    letterSpacing: '0',
                    color: '#6b6b6b',
                    display: 'block',
                    marginBottom: '8px',
                  }} className="dark:!text-white/35">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </time>

                  {/* Title + excerpt + image — inline */}
                  <div className="flex items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <h2 style={{
                        fontFamily: 'var(--font-geist-sans), "Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: '20px',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        letterSpacing: '-0.008em',
                        marginBottom: '6px',
                      }} className="text-[#292929] dark:text-white/90 group-hover:text-[#6b6b6b] dark:group-hover:text-white/55 transition line-clamp-2">
                        {blog.title}
                        {!blog.isPublished && (
                          <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-400/90 text-amber-900 align-middle">
                            Draft
                          </span>
                        )}
                      </h2>
                      {blog.excerpt && (
                        <p style={{
                          fontFamily: 'var(--font-geist-sans)',
                          fontSize: '14px',
                          lineHeight: 1.55,
                          letterSpacing: '0',
                          color: '#6b6b6b',
                        }} className="dark:!text-white/40 line-clamp-2">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>

                    {blog.coverImage && (
                      <div className="w-[112px] h-[80px] flex-shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-white/5">
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          width={112}
                          height={80}
                          className="object-cover w-full h-full group-hover:opacity-80 transition"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tags — bottom */}
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {blog.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} style={{
                          fontFamily: 'var(--font-geist-sans)',
                          fontSize: '12px',
                          letterSpacing: '0',
                          padding: '2px 10px',
                          borderRadius: '100px',
                          border: '1px solid rgba(0,0,0,0.1)',
                          color: '#6b6b6b',
                        }} className="dark:!border-white/10 dark:!text-white/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            {search
              ? <SearchX size={36} strokeWidth={1.25} className="text-slate-300 dark:text-white/20" aria-hidden="true" />
              : <FileText size={36} strokeWidth={1.25} className="text-slate-300 dark:text-white/20" aria-hidden="true" />
            }
            <p style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '15px', color: '#6b6b6b' }} className="dark:!text-white/40">
              {search ? `No articles found for "${search}"` : 'No articles published yet.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '14px' }}
                className={`w-9 h-9 rounded-full font-medium transition ${
                  n === page
                    ? 'bg-[#292929] dark:bg-white text-white dark:text-black'
                    : 'border border-slate-200 dark:border-white/10 text-[#6b6b6b] dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Next page"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
