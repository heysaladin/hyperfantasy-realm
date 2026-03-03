import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About — Hyperfantasy Creative Studio",
  description: "We are a creative studio founded on the belief that great design can transform businesses. Learn more about our story, values, and team.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors pt-16">

      {/* Hero */}
      <section className="pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-6">About Us</p>
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 max-w-4xl">
            We believe in
            <br />
            <span className="text-slate-500 dark:text-white/40">creative excellence</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-white/60 max-w-2xl leading-relaxed">
            Hyperfantasy is a creative studio founded on the belief that great design
            can transform businesses. We combine strategic thinking with beautiful
            execution to create digital experiences that resonate.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 lg:px-8 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">50+</div>
              <div className="text-slate-600 dark:text-white/40">Projects Completed</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">30+</div>
              <div className="text-slate-600 dark:text-white/40">Happy Clients</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">5+</div>
              <div className="text-slate-600 dark:text-white/40">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">3</div>
              <div className="text-slate-600 dark:text-white/40">Studio Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 px-6 lg:px-8 bg-slate-50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div>
              <h2 className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-6">Our Story</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-8">
                Born from a passion for design and technology
              </h3>
            </div>
            <div className="space-y-6 text-lg text-slate-600 dark:text-white/60 leading-relaxed">
              <p>
                Founded in 2019, Hyperfantasy started as a small team of designers and developers
                with a shared vision: to create digital work that genuinely moves people. We
                believed the industry needed more studios that cared as much about the craft
                as the outcome.
              </p>
              <p>
                Over the years, we've grown into a full-service creative studio working with
                startups, scale-ups, and established brands across the globe. Every project
                we take on is approached with the same curiosity, rigour, and attention to detail.
              </p>
              <p>
                Today we are a team of specialists in design, engineering, and strategy —
                united by an obsession with making things that work beautifully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 border-t border-slate-200 dark:border-white/10 pt-8">
              <div className="text-4xl font-bold text-slate-200 dark:text-white/10">01</div>
              <h3 className="text-2xl font-semibold">Craft over speed</h3>
              <p className="text-slate-600 dark:text-white/60">
                We take the time to get things right. Quality is never negotiated,
                and every pixel and line of code is treated with intention.
              </p>
            </div>
            <div className="space-y-4 border-t border-slate-200 dark:border-white/10 pt-8">
              <div className="text-4xl font-bold text-slate-200 dark:text-white/10">02</div>
              <h3 className="text-2xl font-semibold">Honest collaboration</h3>
              <p className="text-slate-600 dark:text-white/60">
                We work closely with our clients, sharing our thinking openly and
                welcoming feedback at every stage of the process.
              </p>
            </div>
            <div className="space-y-4 border-t border-slate-200 dark:border-white/10 pt-8">
              <div className="text-4xl font-bold text-slate-200 dark:text-white/10">03</div>
              <h3 className="text-2xl font-semibold">Curiosity-driven</h3>
              <p className="text-slate-600 dark:text-white/60">
                We stay ahead by constantly exploring new ideas, tools, and disciplines —
                bringing fresh thinking to every brief.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-32 px-6 lg:px-8 bg-slate-50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet the team</h2>
            <p className="text-lg text-slate-600 dark:text-white/60 max-w-lg">
              The talented people behind every project. Get to know the designers,
              engineers, and strategists who make Hyperfantasy what it is.
            </p>
          </div>
          <Link href="/about/team">
            <Button size="lg" className="bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-white/90 group shrink-0" aria-label="Meet the Hyperfantasy team">
              View Team
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>


    </div>
  )
}
