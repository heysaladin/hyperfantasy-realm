import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { HomeFloatingCTA } from "@/components/home-floating-cta"
import { OpenEnquiryButton } from "@/components/open-enquiry-button"
import { TeamPortfolioGrid } from "@/components/team-portfolio-grid"

export const metadata: Metadata = {
  title: "Dravenclaw – Illustration Studio",
  description: "Dravenclaw creates hand-crafted and digital illustrations—characters, concepts, and worlds brought to life.",
}

export default async function DravenclawPage() {
  const raw = await prisma.portfolio.findMany({
    where: {
      AND: [
        { OR: [{ isVisible: true }, { isVisible: null }] },
        { category: 'Illustration' },
        { projectDate: { gte: new Date('2011-01-01') } },
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
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">Illustration Studio</p>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Dravenclaw
              </h1>
              <p className="text-lg text-slate-600 dark:text-white/60 leading-relaxed max-w-md">
                An illustration studio creating hand-crafted and digital art—characters, concepts, and worlds brought to life with ink and imagination.
              </p>
            </div>
            <div className="lg:pt-8">
              <div className="grid grid-cols-2 gap-4">
                {['Character Illustration', 'Concept Art', 'Digital Illustration', 'Editorial Art'].map(s => (
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
              Dravenclaw is our illustration studio—a space where ideas become visual narratives. Whether it&apos;s a character, a scene, or a full illustrated world, we craft each piece with detail, expression, and creative depth.
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-white/60">
              {[
                'Character design and illustration for games, books, and brands',
                'Concept art and world-building visuals',
                'Digital illustration for editorial and commercial use',
                'Custom illustration projects of any scope',
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
            <h2 className="text-3xl font-bold mb-3">Illustration Portfolio</h2>
            <p className="text-slate-500 dark:text-white/40 max-w-xl">
              Illustrations created from 2011 to the present—each piece a window into a world of its own.
            </p>
          </div>
          <TeamPortfolioGrid portfolios={portfolios} emptyMessage="No illustration projects available." />
        </div>
      </section>

      {/* ── CTA box ── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-8 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Have any fantasy / project?</h2>
            <p className="text-slate-500 dark:text-white/40 max-w-md mx-auto mb-8">
              Have a creative vision that needs illustration? Let&apos;s bring it to life together.
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
