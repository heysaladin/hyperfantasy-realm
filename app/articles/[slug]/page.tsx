import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { ClientDate } from '@/components/client-date'
import { resolveCoverImage } from '@/lib/cover-image'
import { resolveContent } from '@/lib/tiptap-content'
import { ArticleContent } from '@/components/article-content'

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
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors pt-16">
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
          <Link href="/articles" className="inline-flex items-center text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition mb-8">
            <ArrowLeft size={20} className="mr-2" />
            Back to Articles
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        {/* Use ClientDate component */}
        {blog.createdAt && <ClientDate date={blog.createdAt.toISOString()} />}

        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-8">
          {blog.title}
        </h1>

        <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-white/5 mb-12">
          <Image
            src={resolveCoverImage(blog.coverImage, blog.id)}
            alt={blog.title}
            width={1200}
            height={675}
            className="object-cover w-full h-full"
          />
        </div>

        <ArticleContent
          html={resolveContent(blog.content)}
          className="prose prose-slate dark:prose-invert prose-lg max-w-none"
        />

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string) => (
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
      </article>
    </div>
  )
}