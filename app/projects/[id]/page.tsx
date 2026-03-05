import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { ClientDate } from '@/components/client-date'
import { resolveContent } from '@/lib/tiptap-content'
import { ArticleContent } from '@/components/article-content'
import { HomeFloatingCTA } from '@/components/home-floating-cta'

async function getPortfolio(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/portfolios`, {
    cache: 'no-store'
  })
  if (!res.ok) return null
  const portfolios = await res.json()
  return portfolios.find((p: any) => p.id === id)
}

export default async function PortfolioDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const portfolio = await getPortfolio(id)

  if (!portfolio) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors pt-16">
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-6">
          <Link href="/projects" className="inline-flex items-center text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition">
            <ArrowLeft size={20} className="mr-2" aria-hidden="true" />
            Back to Projects
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 lg:px-8 pt-10 pb-12">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/40">
          {portfolio.category && (
            <span className="uppercase tracking-wider">{portfolio.category}</span>
          )}
          {portfolio.category && portfolio.projectDate && (
            <span>·</span>
          )}
          {portfolio.projectDate && (
            <ClientDate date={new Date(portfolio.projectDate).toISOString()} />
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-8">
          {portfolio.title}
        </h1>

        {portfolio.liveUrl && (
          <a
            href={portfolio.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition mb-8"
          >
            <ExternalLink size={14} aria-hidden="true" />
            View Live Site
          </a>
        )}

        <ArticleContent
          html={resolveContent(portfolio.description)}
          className="prose prose-slate dark:prose-invert prose-lg max-w-none"
        />

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-8">

          {portfolio.projectDate && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2">Completed</p>
              <p className="text-sm text-slate-700 dark:text-white/70">
                {new Date(portfolio.projectDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}

          {portfolio.complexity && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2">Scale</p>
              <p className="text-sm text-slate-700 dark:text-white/70 capitalize">{portfolio.complexity}</p>
            </div>
          )}

          {portfolio.stack && portfolio.stack.length > 0 && (
            <div className="col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2">Stack</p>
              <div className="flex flex-wrap gap-2">
                {portfolio.stack.map((tech: string) => (
                  <span key={tech} className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {portfolio.tags && portfolio.tags.length > 0 && (
            <div className="col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {portfolio.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </article>

      <HomeFloatingCTA ctaBtnId="" alwaysVisible />
    </div>
  )
}
