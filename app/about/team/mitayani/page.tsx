import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { HomeFloatingCTA } from "@/components/home-floating-cta"
import { OpenEnquiryButton } from "@/components/open-enquiry-button"
import { TeamPortfolioGrid } from "@/components/team-portfolio-grid"

export const metadata: Metadata = {
  title: "Mitayani – Graphic Design Studio",
  description: "Mitayani handles printed design, digital graphic design, stationery, and social media content.",
}

export default async function MitayaniPage() {
  const raw = await prisma.portfolio.findMany({
    where: {
      AND: [
        { OR: [{ isVisible: true }, { isVisible: null }] },
        { category: 'Graphic Design' },
        { projectDate: { gte: new Date('2012-01-01') } },
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
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4">Graphic Design Studio</p>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Mitayani
              </h1>
              <p className="text-lg text-slate-600 dark:text-white/60 leading-relaxed max-w-md">
                A graphic design studio producing print, digital, and social visuals—work that communicates clearly and looks great across every medium.
              </p>
            </div>
            <div className="lg:pt-8">
              <div className="grid grid-cols-2 gap-4">
                {['Printed Design', 'Digital Graphic Design', 'Stationery', 'Social Media Content'].map(s => (
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
              Mitayani is our graphic design studio—handling everything from physical print collateral to digital assets and social media imagery. We bring ideas into pixels and paper with precision and aesthetic intent.
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-white/60">
              {[
                'Printed design — flyers, posters, brochures, packaging',
                'Digital graphic design for web, apps, and presentations',
                'Stationery design for corporate and personal use',
                'Special social media content images and visual campaigns',
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
            <h2 className="text-3xl font-bold mb-3">Graphic Design Portfolio</h2>
            <p className="text-slate-500 dark:text-white/40 max-w-xl">
              Printed and digital designs from 2012 to the present—spanning print, screen, and social.
            </p>
          </div>
          <TeamPortfolioGrid portfolios={portfolios} emptyMessage="No graphic design projects available." />
        </div>
      </section>

      {/* ── CTA box ── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-8 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Have any fantasy / project?</h2>
            <p className="text-slate-500 dark:text-white/40 max-w-md mx-auto mb-8">
              Let Mitayani bring your ideas into pixels and print. Tell us what you&apos;re imagining.
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
