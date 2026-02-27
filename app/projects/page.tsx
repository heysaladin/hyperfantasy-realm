import Link from 'next/link'
import Image from 'next/image'

async function getPortfolios() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/portfolios`, {
    cache: 'no-store'
  })
  if (!res.ok) return []
  const portfolios = await res.json()
  return portfolios.filter((p: any) => p.isVisible)
}

export default async function WorksPage() {
  const portfolios = await getPortfolios()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Work</h1>
          <p className="text-xl text-white/60">
            Selected projects showcasing our expertise in design and development
          </p>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((portfolio: any) => (
            <Link 
              key={portfolio.id} 
              href={`/projects/${portfolio.id}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-white/20">
                {/* Image */}
                {portfolio.imageUrl && (
                  <div className="aspect-[16/10] overflow-hidden bg-white/5">
                    <Image
                      src={portfolio.imageUrl}
                      alt={portfolio.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full transition group-hover:scale-105"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  {portfolio.category && (
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {portfolio.category}
                    </span>
                  )}
                  
                  {/* Title */}
                  <h3 className="mt-2 text-xl font-semibold group-hover:text-white/60 transition">
                    {portfolio.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="mt-2 text-sm text-white/60 line-clamp-2">
                    {portfolio.description}
                  </p>
                  
                  {/* Tags */}
                  {portfolio.tags && portfolio.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {portfolio.tags.slice(0, 3).map((tag: string) => (
                        <span 
                          key={tag}
                          className="text-xs px-2 py-1 bg-white/10 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {portfolios.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/40">No portfolios available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}