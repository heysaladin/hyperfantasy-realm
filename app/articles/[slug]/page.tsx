import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { ClientDate } from '@/components/client-date'  // ← Import

async function getBlog(slug: string) {
  return await prisma.blog.findFirst({
    where: { slug, isPublished: true }
  })
}

export default async function ArticleDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
          <Link href="/articles" className="inline-flex items-center text-white/60 hover:text-white transition mb-8">
            <ArrowLeft size={20} className="mr-2" />
            Back to Articles
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        {/* Use ClientDate component */}
        <ClientDate date={blog.createdAt.toISOString()} />

        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-8">
          {blog.title}
        </h1>

        {blog.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-white/5 mb-12">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              width={1200}
              height={675}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="whitespace-pre-line leading-relaxed">
            {blog.content}
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-white/10 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}