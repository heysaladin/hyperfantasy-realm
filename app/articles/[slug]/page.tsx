import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Source_Serif_4 } from 'next/font/google'
import { ClientDate } from '@/components/client-date'
import { resolveContent } from '@/lib/tiptap-content'
import { ArticleContent } from '@/components/article-content'

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

async function getBlog(slug: string) {
  return await prisma.blog.findFirst({
    where: { slug }
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: 'Article Not Found — Hyperfantasy',
      description: 'This article could not be found.',
    }
  }

  const raw = blog.content ? stripHtml(resolveContent(blog.content)) : ''
  let description = ''
  if (raw.length > 40) {
    if (raw.length <= 155) {
      description = raw
    } else {
      const cut = raw.slice(0, 152)
      const lastSpace = cut.lastIndexOf(' ')
      description = (lastSpace > 100 ? cut.slice(0, lastSpace) : cut) + '…'
    }
  } else {
    const tagSuffix = (blog.tags as string[])?.length
      ? ` · ${(blog.tags as string[]).slice(0, 3).join(', ')}`
      : ''
    description = `Read "${blog.title}"${tagSuffix} on Hyperfantasy.`
  }

  const title = `${blog.title} — Hyperfantasy`

  return {
    title,
    description,
    keywords: blog.tags as string[] | undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      ...(blog.createdAt && { publishedTime: blog.createdAt.toISOString() }),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
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
    <div className={`${sourceSerif4.variable} min-h-screen bg-white dark:bg-black transition-colors pt-16`}>

      {/* Back nav */}
      <div className="max-w-[728px] mx-auto px-6 pt-10 pb-0">
        <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-[#6b6b6b] dark:text-white/40 hover:text-[#292929] dark:hover:text-white/70 transition font-[var(--font-geist-sans)]">
          <ArrowLeft size={15} aria-hidden="true" />
          Articles
        </Link>
      </div>

      <article className="max-w-[728px] mx-auto px-6 pt-8 pb-24">

        {/* Meta line */}
        <div className="mb-6 flex items-center gap-2 text-[13px] text-[#6b6b6b] dark:text-white/40" style={{ fontFamily: 'var(--font-geist-sans)', letterSpacing: '0' }}>
          {blog.createdAt && <ClientDate date={blog.createdAt.toISOString()} />}
        </div>

        {/* Title — sans-serif like Medium */}
        <h1 style={{
          fontFamily: 'var(--font-geist-sans), "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 700,
          lineHeight: 1.16,
          letterSpacing: '-0.011em',
          color: 'var(--article-title)',
          marginBottom: '16px',
          marginTop: 0,
        }}>
          {blog.title}
        </h1>

        {/* Subtitle/excerpt — sans-serif, muted */}
        {blog.excerpt && (
          <p style={{
            fontFamily: 'var(--font-geist-sans), "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '20px',
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: '-0.004em',
            color: 'var(--article-subtitle)',
            marginBottom: '32px',
            marginTop: 0,
          }}>
            {blog.excerpt}
          </p>
        )}

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--article-divider)', marginBottom: '40px' }} />

        {/* Medium-style prose */}
        <style>{`
          :root {
            --article-title: #292929;
            --article-subtitle: #6b6b6b;
            --article-body: #292929;
            --article-divider: #e6e6e6;
            --article-border: #292929;
            --article-muted: #6b6b6b;
          }
          .dark {
            --article-title: rgba(255,255,255,0.9);
            --article-subtitle: rgba(255,255,255,0.45);
            --article-body: rgba(255,255,255,0.84);
            --article-divider: rgba(255,255,255,0.1);
            --article-border: rgba(255,255,255,0.55);
            --article-muted: rgba(255,255,255,0.4);
          }

          .medium-prose {
            font-family: 'Source Serif Pro', var(--font-source-serif), Georgia, Cambria, "Times New Roman", Times, serif;
            font-size: 20px;
            line-height: 1.58;
            letter-spacing: -0.003em;
            font-weight: 400;
            color: var(--article-body);
          }
          .medium-prose > * + * {
            margin-top: 0;
          }
          .medium-prose p {
            margin-top: 0;
            margin-bottom: 2em;
          }
          .medium-prose p:last-child {
            margin-bottom: 0;
          }

          /* Headings — switch to sans-serif */
          .medium-prose h1,
          .medium-prose h2,
          .medium-prose h3,
          .medium-prose h4,
          .medium-prose h5,
          .medium-prose h6 {
            font-family: var(--font-geist-sans), "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-weight: 700;
            color: var(--article-title);
            margin-bottom: 0.25em;
          }
          .medium-prose h1 {
            font-size: 34px;
            line-height: 1.18;
            letter-spacing: -0.022em;
            margin-top: 2.14em;
          }
          .medium-prose h2 {
            font-size: 26px;
            line-height: 1.22;
            letter-spacing: -0.012em;
            margin-top: 2.14em;
          }
          .medium-prose h3 {
            font-size: 22px;
            line-height: 1.25;
            letter-spacing: -0.007em;
            margin-top: 1.72em;
          }
          .medium-prose h4 {
            font-size: 18px;
            line-height: 1.3;
            letter-spacing: -0.004em;
            margin-top: 1.72em;
          }

          /* Lists */
          .medium-prose ul,
          .medium-prose ol {
            padding-left: 30px;
            margin-bottom: 2em;
          }
          .medium-prose li {
            margin-bottom: 0.5em;
            line-height: 1.58;
          }
          .medium-prose ul { list-style-type: disc; }
          .medium-prose ol { list-style-type: decimal; }

          /* Blockquote */
          .medium-prose blockquote {
            border-left: 3px solid var(--article-border);
            padding: 0 0 0 23px;
            margin: 2em 0;
            font-style: italic;
            color: var(--article-body);
          }
          .medium-prose blockquote p {
            margin-bottom: 0;
          }

          /* Links */
          .medium-prose a {
            color: inherit;
            text-decoration: underline;
            text-decoration-color: rgba(41,41,41,0.4);
            text-underline-offset: 3px;
            transition: text-decoration-color 0.15s;
          }
          .dark .medium-prose a {
            text-decoration-color: rgba(255,255,255,0.3);
          }
          .medium-prose a:hover {
            text-decoration-color: inherit;
          }

          /* Images */
          .medium-prose img,
          .medium-prose figure img {
            display: block;
            max-width: 100%;
            height: auto;
            margin: 2.5em auto;
            border-radius: 2px;
          }
          .medium-prose figure {
            margin: 2.5em 0;
          }
          .medium-prose figcaption {
            font-family: var(--font-geist-sans), sans-serif;
            font-size: 13px;
            line-height: 1.4;
            letter-spacing: 0;
            color: var(--article-muted);
            text-align: center;
            margin-top: 10px;
          }

          /* HR — Medium uses three dots */
          .medium-prose hr {
            border: none;
            text-align: center;
            margin: 3.5em 0;
          }
          .medium-prose hr::before {
            content: '···';
            letter-spacing: 0.6em;
            color: var(--article-muted);
            font-size: 1.2em;
          }

          /* Inline code */
          .medium-prose code {
            font-family: var(--font-geist-mono, 'Courier New', monospace);
            font-size: 0.82em;
            background: rgba(0,0,0,0.055);
            padding: 2px 5px;
            border-radius: 3px;
            letter-spacing: 0;
          }
          .dark .medium-prose code {
            background: rgba(255,255,255,0.1);
          }

          /* Code blocks */
          .medium-prose pre {
            background: #1a1a1a;
            color: #e6e6e6;
            border-radius: 4px;
            padding: 24px;
            overflow-x: auto;
            font-size: 15px;
            line-height: 1.65;
            margin: 2em 0;
            letter-spacing: 0;
          }
          .medium-prose pre code {
            background: none;
            padding: 0;
            font-size: inherit;
            border-radius: 0;
          }

          /* Strong / em */
          .medium-prose strong {
            font-family: 'Source Serif Pro', var(--font-source-serif), Georgia, Cambria, "Times New Roman", Times, serif;
            font-weight: 700;
          }
          .medium-prose em { font-style: italic; }

          /* Tables */
          .medium-prose table {
            border-collapse: collapse;
            width: 100%;
            margin: 2em 0;
            font-family: var(--font-geist-sans), sans-serif;
            font-size: 15px;
            line-height: 1.5;
            letter-spacing: 0;
          }
          .medium-prose th,
          .medium-prose td {
            border: 1px solid var(--article-divider);
            padding: 10px 14px;
            vertical-align: top;
            text-align: left;
          }
          .medium-prose th {
            font-weight: 600;
            background: rgba(0,0,0,0.03);
            color: var(--article-title);
          }
          .dark .medium-prose th {
            background: rgba(255,255,255,0.04);
          }
          .medium-prose td {
            color: var(--article-body);
          }
          .medium-prose tr:nth-child(even) td {
            background: rgba(0,0,0,0.015);
          }
          .dark .medium-prose tr:nth-child(even) td {
            background: rgba(255,255,255,0.02);
          }
        `}</style>

        <ArticleContent
          html={resolveContent(blog.content)}
          className="medium-prose"
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--article-divider)' }}>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-geist-sans)',
                    fontSize: '13px',
                    letterSpacing: '0',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    border: '1px solid var(--article-divider)',
                    color: 'var(--article-muted)',
                  }}
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
