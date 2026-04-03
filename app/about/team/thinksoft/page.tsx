import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { HomeFloatingCTA } from "@/components/home-floating-cta"
import { OpenEnquiryButton } from "@/components/open-enquiry-button"
import { TeamPortfolioGrid } from "@/components/team-portfolio-grid"

export const metadata: Metadata = {
  title: "Thinksoft – Development Studio",
  description: "Thinksoft builds web applications and mobile apps—engineering solutions that are fast, reliable, and built to scale.",
}

export default async function ThinksoftPage() {
  const raw = await prisma.portfolio.findMany({
    where: {
      AND: [
        { OR: [{ isVisible: true }, { isVisible: null }] },
        {
          OR: [
            { category: 'Development' },
            { tags: { hasSome: ['Landing Page', 'Dashboard', 'Mobile App', 'Mobile', 'mobile'] } },
          ],
        },
      ],
    },
    orderBy: [{ orderIndex: 'desc' }, { projectDate: 'desc' }],
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      category: true,
      tags: true,
      stack: true,
      liveUrl: true,
      projectDate: true,
      complexity: true,
    },
  })

  const portfolios = raw.map(p => ({
    ...p,
    projectDate: p.projectDate ? p.projectDate.toISOString() : null,
  }))

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors pt-16">

      {/* ── Back nav ── */}
      <div className="border-b border-slate-200 dark:border-white/5 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6">
          <Link
            href="/about/team"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Team
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="py-20 px-6 lg:px-8 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">Development Studio</p>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Thinksoft
              </h1>
              <p className="text-lg text-slate-600 dark:text-white/60 leading-relaxed max-w-md">
                A development studio building web applications and mobile apps—engineering solutions that are fast, reliable, and built to scale.
              </p>
            </div>
            <div className="lg:pt-8">
              <div className="grid grid-cols-2 gap-4">
                {['Web Development', 'Mobile App', 'Front-end Engineering', 'Back-end Systems'].map(s => (
                  <div key={s} className="p-4 border border-slate-200 dark:border-white/10 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-white/70">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-16 px-6 lg:px-8 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">What We Do</h2>
            <p className="text-slate-600 dark:text-white/60 leading-relaxed mb-6">
              Thinksoft is our development studio—turning ideas into working products. We build web applications and mobile apps with clean code, solid architecture, and a focus on performance and user experience.
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-white/60">
              {[
                'Full-stack web application development',
                'Mobile app development for iOS and Android',
                'Front-end engineering with modern frameworks',
                'Back-end systems, APIs, and database architecture',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/30 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section className="py-16 px-6 lg:px-8 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-3">Development Portfolio</h2>
            <p className="text-slate-500 dark:text-white/40 max-w-xl">
              Every web and mobile project built by Thinksoft—from the earliest prototypes to the latest releases.
            </p>
          </div>
          <TeamPortfolioGrid portfolios={portfolios} emptyMessage="No development projects available." />
        </div>
      </section>

      {/* ── CTA box ── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-8 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Have any fantasy / project?</h2>
            <p className="text-slate-500 dark:text-white/40 max-w-md mx-auto mb-8">
              Ready to build something? Thinksoft turns ideas into working products.
            </p>
            <OpenEnquiryButton className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white cursor-pointer">
              Start a Project <ArrowUpRight size={16} aria-hidden="true" />
            </OpenEnquiryButton>
          </div>
        </div>
      </section>

      <HomeFloatingCTA ctaBtnId="" alwaysVisible />
    </div>
  )
}
