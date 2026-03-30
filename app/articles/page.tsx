'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, FileText, Search, SearchX, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ArticleContent } from '@/components/article-content'
import { resolveContent } from '@/lib/tiptap-content'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const PAGE_SIZE = 6

export default function ArticlesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [allBlogs, setAllBlogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showAllBlogs, setShowAllBlogs] = useState(false)
  const searchBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (data.showDrafts) setShowAllBlogs(true) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) setShowAllBlogs(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetch('/api/blogs')
      .then(r => r.json())
      .then(data => setAllBlogs(Array.isArray(data) ? data : []))
      .catch(() => setAllBlogs([]))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = allBlogs
    if (!showAllBlogs) {
      result = result.filter(b => b.isPublished)
    }
    if (!search.trim()) return result
    const q = search.trim().toLowerCase()
    return result.filter(b =>
      b.title?.toLowerCase().includes(q) ||
      b.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
      b.excerpt?.toLowerCase().includes(q)
    )
  }, [allBlogs, search, showAllBlogs])

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
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors pt-16">

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-16 pb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Articles</h1>
          <p className="text-xl text-slate-600 dark:text-white/60">
            Thoughts on design, development, and everything in between
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div ref={searchBarRef} className="border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-black/95 sticky z-10 backdrop-blur-sm transition-[top] duration-300"
        style={{ top: 'calc(var(--nav-offset, 0px) + 64px)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2">
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
            {user && (
              <button
                aria-label={showAllBlogs ? 'Show published only' : 'Show all articles including drafts'}
                aria-pressed={showAllBlogs}
                onClick={() => setShowAllBlogs(v => !v)}
                className={`px-2.5 py-2.5 rounded-lg border transition flex-shrink-0 ${
                  showAllBlogs
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {showAllBlogs ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Blog list */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-12 pb-16">

        {isLoading ? (
          <div className="space-y-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-8 animate-pulse">
                <div className="md:w-1/3 aspect-video rounded-lg bg-slate-200 dark:bg-white/10" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded" />
                  <div className="h-6 bg-slate-200 dark:bg-white/10 rounded" />
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-white/10 rounded" />
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded" />
                  <div className="h-4 w-5/6 bg-slate-200 dark:bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-white/10">
            {paginated.map((blog: any) => (
              <Link key={blog.id} href={`/articles/${blog.slug}`} className="block group py-10 first:pt-0">
                <article className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/5 aspect-video overflow-hidden rounded-lg bg-slate-200 dark:bg-white/5 flex-shrink-0">
                    {blog.coverImage?.startsWith('https://') ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        width={400}
                        height={225}
                        className="object-cover w-full h-full group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-white/5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <time className="text-sm text-slate-500 dark:text-white/40">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric'
                        })}
                      </time>
                      {!blog.isPublished && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                          Draft
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mt-2 mb-3 group-hover:text-slate-600 dark:group-hover:text-white/60 transition text-slate-900 dark:text-white">
                      {blog.title}
                    </h2>
                    <ArticleContent
                      html={resolveContent(blog.excerpt)}
                      className="prose prose-slate dark:prose-invert prose-sm max-w-none line-clamp-3 text-slate-600 dark:text-white/60"
                    />
                    {blog.tags?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/70 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            {search
              ? <SearchX size={36} strokeWidth={1.25} className="text-slate-300 dark:text-white/20" aria-hidden="true" />
              : <FileText size={36} strokeWidth={1.25} className="text-slate-300 dark:text-white/20" aria-hidden="true" />
            }
            <p className="text-slate-500 dark:text-white/40">
              {search ? `No articles found for "${search}"` : 'No articles published yet.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                  n === page
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                    : 'border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
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
