// app/admin/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminColorMap from '@/components/admin-color-map'
import AdminDraftArticles from '@/components/admin-draft-articles'
import AdminTagsPanel from '@/components/admin-tags-panel'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    portfoliosTotal,
    portfoliosDraft,
    enquiriesTotal,
    blogsTotal,
    blogsDraft,
    teamsTotal,
  ] = await Promise.all([
    prisma.portfolio.count(),
    prisma.portfolio.count({ where: { isVisible: false } }),
    prisma.enquiry.count(),
    prisma.blog.count(),
    prisma.blog.count({ where: { isPublished: false } }),
    prisma.team.count(),
  ])

  const stats = [
    {
      href: '/admin/portfolios',
      label: 'Portfolios',
      primary: portfoliosTotal,
      secondary: { label: 'hidden', value: portfoliosDraft },
    },
    {
      href: '/admin/enquiries',
      label: 'Enquiries',
      primary: enquiriesTotal,
      secondary: null,
    },
    {
      href: '/admin/blogs',
      label: 'Blogs',
      primary: blogsTotal,
      secondary: { label: 'draft', value: blogsDraft },
    },
    {
      href: '/admin/teams',
      label: 'Teams',
      primary: teamsTotal,
      secondary: null,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stat + nav cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ href, label, primary, secondary }) => (
          <Link key={href} href={href}>
            <div className="p-6 border border-slate-300 dark:border-white/10 rounded-lg hover:border-slate-400 dark:hover:border-white/40 transition h-full">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3">
                {label}
              </p>
              <p className="text-4xl font-bold tabular-nums">{primary}</p>
              {secondary ? (
                <p className="mt-2 text-sm text-slate-500 dark:text-white/40">
                  <span className="font-medium text-slate-700 dark:text-white/60">{secondary.value}</span>{' '}
                  {secondary.label}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500 dark:text-white/40">total</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Draft Articles + Tag Shortcuts panels */}
      <div className="mt-12 space-y-4">
        <AdminDraftArticles />
        <AdminTagsPanel />
      </div>

      {/* Color Map Section */}
      <div className="mt-12 border-t border-slate-200 dark:border-white/10 pt-10">
        <AdminColorMap />
      </div>
    </div>
  )
}