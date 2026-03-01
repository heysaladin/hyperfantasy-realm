import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

async function getPortfolio(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/portfolios`, {
    cache: 'no-store'
  })
  if (!res.ok) return null
  const portfolios = await res.json()
  return portfolios.find((p: any) => p.id === id && p.isVisible)
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
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          <Link href="/projects" className="inline-flex items-center text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition mb-8">
            <ArrowLeft size={20} className="mr-2" />
            Back to Works
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        
        {/* Title & Category */}
        <div className="mb-12">
          {portfolio.category && (
            <span className="text-sm text-slate-500 dark:text-white/40 uppercase tracking-wider">
              {portfolio.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            {portfolio.title}
          </h1>
          
          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {portfolio.liveUrl && (
              <a href={portfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink size={16} className="mr-2" />
                  View Live Site
                </Button>
              </a>
            )}
            {portfolio.copyright && (
              <a href={portfolio.copyright} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Github size={16} className="mr-2" />
                  View Code
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {portfolio.imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-white/5 mb-12">
            <Image
              src={portfolio.imageUrl}
              alt={portfolio.title}
              width={1200}
              height={675}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Description */}
        <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
          <p className="text-lg text-slate-700 dark:text-white/80 leading-relaxed">
            {portfolio.description}
          </p>
          
          {/* Long Description */}
          {portfolio.longDescription && (
            <div className="mt-8 text-slate-600 dark:text-white/70 leading-relaxed whitespace-pre-line">
              {portfolio.longDescription}
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-t border-slate-200 dark:border-white/10">
          
          {/* Tech Stack */}
          {portfolio.stack && portfolio.stack.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-4">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.stack.map((tech: string) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {portfolio.tags && portfolio.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.tags.map((tag: string) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project Date */}
          {portfolio.projectDate && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-4">
                Completed
              </h3>
              <p className="text-slate-700 dark:text-white/80">
                {new Date(portfolio.projectDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Complexity */}
          {portfolio.complexity && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
                Project Scale
              </h3>
              <p className="text-white/80 capitalize">
                {portfolio.complexity} Project
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}