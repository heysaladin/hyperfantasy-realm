import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Mail } from 'lucide-react'
import { ClientDate } from '@/components/client-date'
import { resolveContent } from '@/lib/tiptap-content'
import { ArticleContent } from '@/components/article-content'
import dynamic from 'next/dynamic'
import { EnquiryCTAButton } from '@/components/enquiry-cta-button'

const HomeFloatingCTA = dynamic(() => import('@/components/home-floating-cta').then(m => ({ default: m.HomeFloatingCTA })))

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

        {portfolio.imageUrl && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10">
            <Image
              src={portfolio.imageUrl}
              alt={portfolio.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
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

          {portfolio.stack && portfolio.stack.length > 0 && portfolio.category?.toLowerCase() === 'development' && (
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

        </div>

        {(portfolio.liveUrl || portfolio.copyright) && (
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
            {portfolio.copyright && (
              <p className="text-xs text-slate-400 dark:text-white/30">{portfolio.copyright}</p>
            )}
            {portfolio.liveUrl ? (
              <a
                href={portfolio.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition"
              >
                <ExternalLink size={14} aria-hidden="true" />
                View Live Site
              </a>
            ) : <span />}
          </div>
        )}

        <div className="mt-16 rounded-3xl text-center text-white py-20 px-8"
          style={{ background: 'linear-gradient(135deg,#0f0c2e 0%,#1a1560 100%)' }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 leading-snug">
            Have any awesome fantasy?
          </h2>
          <EnquiryCTAButton
            id="project-cta-btn"
            style={{ background: 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)', color: '#fff', borderRadius: 48, padding: '14px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none' }}
          >
            <Mail size={18} aria-hidden="true" /> Let&apos;s talk!
          </EnquiryCTAButton>
        </div>
      </article>

      <HomeFloatingCTA ctaBtnId="project-cta-btn" />
    </div>
  )
}
