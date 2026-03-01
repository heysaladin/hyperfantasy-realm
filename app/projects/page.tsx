'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ExternalLink, Github, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProjectsPage() {
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/portfolios')
      .then(res => res.json())
      .then(data => {
        const portfolioList = Array.isArray(data) ? data : []
        const visible = portfolioList.filter((p: any) => p.isVisible)
        setPortfolios(visible)
      })
      .catch(error => {
        console.error('Error fetching portfolios:', error)
        setPortfolios([])
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleClick = (portfolio: any) => {
    if (portfolio.complexity === 'short') {
      setSelectedPortfolio(portfolio)
    } else {
      window.location.href = `/projects/${portfolio.id}`
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Work</h1>
          <p className="text-xl text-slate-600 dark:text-white/60">
            Selected projects showcasing our expertise
          </p>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton Loading Animation
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="group block cursor-pointer"
              >
                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                  {/* Image Skeleton */}
                  <div className="aspect-[16/10] overflow-hidden bg-slate-300 dark:bg-white/10 animate-pulse" />
                  
                  {/* Content Skeleton */}
                  <div className="p-6 space-y-4">
                    {/* Category/Complexity Skeleton */}
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-slate-300 dark:bg-white/10 rounded animate-pulse" />
                      <div className="h-5 w-16 bg-slate-300 dark:bg-white/10 rounded animate-pulse" />
                    </div>
                    
                    {/* Title Skeleton */}
                    <div className="space-y-2">
                      <div className="h-6 bg-slate-300 dark:bg-white/10 rounded animate-pulse" />
                      <div className="h-6 w-3/4 bg-slate-300 dark:bg-white/10 rounded animate-pulse" />
                    </div>
                    
                    {/* Description Skeleton */}
                    <div className="space-y-2 pt-2">
                      <div className="h-4 bg-slate-300 dark:bg-white/10 rounded animate-pulse" />
                      <div className="h-4 w-5/6 bg-slate-300 dark:bg-white/10 rounded animate-pulse" />
                    </div>
                    
                    {/* Tags Skeleton */}
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-12 bg-slate-300 dark:bg-white/10 rounded animate-pulse" />
                      <div className="h-6 w-12 bg-slate-300 dark:bg-white/10 rounded animate-pulse" />
                      <div className="h-6 w-12 bg-slate-300 dark:bg-white/10 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            portfolios.map((portfolio: any) => (
              <div
                key={portfolio.id}
                onClick={() => handleClick(portfolio)}
                className="group block cursor-pointer"
              >
                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition hover:border-slate-300 dark:hover:border-white/20">
                  {portfolio.imageUrl && (
                    <div className="aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-white/5">
                      <img
                        src={portfolio.imageUrl}
                        alt={portfolio.title}
                        className="object-cover w-full h-full transition group-hover:scale-105"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {portfolio.category && (
                        <span className="text-xs text-slate-500 dark:text-white/40 uppercase tracking-wider">
                          {portfolio.category}
                        </span>
                      )}
                      {portfolio.complexity && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          portfolio.complexity === 'short'
                            ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                            : 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400'
                        }`}>
                          {portfolio.complexity}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold group-hover:text-slate-600 dark:group-hover:text-white/60 transition">
                      {portfolio.title}
                    </h3>
                    
                    <p className="mt-2 text-sm text-slate-600 dark:text-white/60 line-clamp-2">
                      {portfolio.description}
                    </p>
                    
                    {portfolio.tags && portfolio.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {portfolio.tags.slice(0, 3).map((tag: string) => (
                          <span 
                            key={tag}
                            className="text-xs px-2 py-1 bg-slate-200 dark:bg-white/10 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for short projects */}
      <Dialog open={!!selectedPortfolio} onOpenChange={() => setSelectedPortfolio(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-slate-200 dark:border-white/20">
          {selectedPortfolio && (
            <div>
              {/* Add DialogTitle - can be visually hidden if not needed */}
              <DialogTitle className="sr-only">
                {selectedPortfolio.title}
              </DialogTitle>

              {/* Image */}
              {selectedPortfolio.imageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-white/5 mb-6">
                  <img
                    src={selectedPortfolio.imageUrl}
                    alt={selectedPortfolio.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Category */}
              {selectedPortfolio.category && (
                <span className="text-sm text-slate-500 dark:text-white/40 uppercase tracking-wider">
                  {selectedPortfolio.category}
                </span>
              )}

              {/* Title */}
              <h2 className="text-3xl font-bold mt-2 mb-4 text-slate-900 dark:text-white">
                {selectedPortfolio.title}
              </h2>

              {/* Links */}
              <div className="flex gap-3 mb-6">
                {selectedPortfolio.liveUrl && (
                  <a href={selectedPortfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink size={16} className="mr-2" />
                      Live Site
                    </Button>
                  </a>
                )}
                {selectedPortfolio.copyright && (
                  <a href={selectedPortfolio.copyright} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Github size={16} className="mr-2" />
                      Code
                    </Button>
                  </a>
                )}
                <Link href={`/projects/${selectedPortfolio.id}`}>
                  <Button variant="default" size="sm">
                    See Details
                  </Button>
                </Link>
              </div>

              {/* Description */}
              <p className="text-slate-700 dark:text-white/70 leading-relaxed mb-6">
                {selectedPortfolio.description}
              </p>

              {/* Tech Stack */}
              {selectedPortfolio.stack && selectedPortfolio.stack.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-3">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPortfolio.stack.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedPortfolio.tags && selectedPortfolio.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPortfolio.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}