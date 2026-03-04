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
            <ArrowLeft size={20} className="mr-2" aria-hidden="true" />
            Back to Articles
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        {blog.createdAt && <ClientDate date={blog.createdAt.toISOString()} />}

        <h1 style={{ fontFamily: 'var(--font-source-serif), Georgia, "Times New Roman", serif' }}
          className="text-4xl md:text-5xl font-bold mt-4 mb-8 leading-tight tracking-tight">
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

        {/* Medium-style prose wrapper */}
        <style>{`
          .medium-prose {
            font-family: var(--font-source-serif), Georgia, "Times New Roman", serif;
            font-size: 21px;
            line-height: 1.58;
            letter-spacing: -0.003em;
            color: #242424;
          }
          .dark .medium-prose {
            color: rgba(255,255,255,0.84);
          }
          .medium-prose p {
            margin-top: 0;
            margin-bottom: 2em;
          }
          .medium-prose h1,
          .medium-prose h2,
          .medium-prose h3,
          .medium-prose h4 {
            font-family: var(--font-source-serif), Georgia, "Times New Roman", serif;
            font-weight: 700;
            letter-spacing: -0.02em;
            line-height: 1.25;
            margin-top: 1.72em;
            margin-bottom: 0.5em;
          }
          .medium-prose h2 { font-size: 1.52em; }
          .medium-prose h3 { font-size: 1.2em; }
          .medium-prose blockquote {
            border-left: 3px solid #242424;
            padding-left: 23px;
            margin-left: 0;
            font-style: italic;
            color: inherit;
          }
          .dark .medium-prose blockquote {
            border-left-color: rgba(255,255,255,0.5);
          }
          .medium-prose a {
            color: inherit;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .medium-prose img {
            border-radius: 4px;
            margin: 2em auto;
            max-width: 100%;
          }
          .medium-prose hr {
            border: none;
            text-align: center;
            margin: 3em 0;
          }
          .medium-prose hr::before {
            content: '···';
            letter-spacing: 0.6em;
            color: #9b9b9b;
            font-size: 1.2em;
          }
          .medium-prose code {
            font-family: var(--font-geist-mono, 'Courier New', monospace);
            font-size: 0.85em;
            background: rgba(0,0,0,0.05);
            padding: 2px 5px;
            border-radius: 3px;
          }
          .dark .medium-prose code {
            background: rgba(255,255,255,0.08);
          }
          .medium-prose pre {
            background: #1a1a2e;
            color: #e0e0e0;
            border-radius: 6px;
            padding: 1.4em;
            overflow-x: auto;
            font-size: 0.82em;
            line-height: 1.6;
          }
          .medium-prose pre code {
            background: none;
            padding: 0;
            font-size: inherit;
          }
        `}</style>

        <ArticleContent
          html={resolveContent(blog.content)}
          className="medium-prose max-w-none"
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
