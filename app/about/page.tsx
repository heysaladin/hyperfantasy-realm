import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { testimonials } from "@/data/testimonials"

const CLIENTS = [
  { name: 'EZ Laundry', logo: '/logos/logo-ezlaundry.png' },
  { name: 'Greatsoft',  logo: '/logos/logo-greatsoft.png'  },
  { name: 'Tresnan',    logo: '/logos/logo-tresnan.png'    },
  { name: 'Akasia',     logo: '/logos/logo-akasia.png'     },
  { name: 'Tammwel',    logo: '/logos/logo-tammwel.png'    },
  { name: 'Sigmatech',  logo: '/logos/logo-sigmatech.png'  },
]

export const metadata: Metadata = {
  title: "About — Hyperfantasy Creative Studio",
  description: "We are a creative studio founded on the belief that great design can transform businesses. Learn more about our story, values, and team.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors pt-16">
      <style>{`
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .about-marquee-track { animation: marquee 40s linear infinite; display:flex; gap:24px; width:max-content; }
        .about-marquee-track:hover { animation-play-state: paused; }
        .about-fade-l { background: linear-gradient(to right, #ffffff, transparent); }
        .about-fade-r { background: linear-gradient(to left,  #ffffff, transparent); }
        .dark .about-fade-l { background: linear-gradient(to right, #0a0a0a, transparent); }
        .dark .about-fade-r { background: linear-gradient(to left,  #0a0a0a, transparent); }
        .about-card { background: #f1f0ff; }
        .dark .about-card { background: #181346; }
      `}</style>

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
              <div className="text-5xl md:text-6xl font-bold mb-2">5</div>
              <div className="text-slate-600 dark:text-white/40">Interchangeable Teams</div>
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
                Founded in 2021, Hyperfantasy started as a small team of designers and developers
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

      {/* Clients / Logos */}
      <section className="py-20 px-6 lg:px-8 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {CLIENTS.map(({ name, logo }) => (
              <div key={name} className="flex items-center justify-center" style={{ height: 56 }}>
                <Image src={logo} alt={name} width={160} height={56}
                  className="object-contain dark:invert dark:opacity-60 opacity-60 hover:opacity-100 dark:hover:opacity-90 transition-opacity"
                  style={{ maxWidth: 160, height: 'auto' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            What they said about us
          </h2>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 about-fade-l" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 about-fade-r" />
          <div className="about-marquee-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="about-card border border-black/10 dark:border-white/10 rounded-2xl p-8 shrink-0"
                style={{ width: 380 }}
              >
                <div className="flex gap-0.5 mb-5" role="img" aria-label={`Rating: ${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-white/70 mb-6" style={{ fontSize: 16, fontWeight: 400, lineHeight: '160%' }}>
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                  {t.image && (
                    <Image src={t.image} alt={t.name} width={48} height={48} className="rounded-2xl object-cover shrink-0" />
                  )}
                  <div>
                    <p className="text-slate-900 dark:text-white" style={{ fontSize: 16, fontWeight: 500 }}>{t.name}</p>
                    <p className="text-slate-500 dark:text-white/50" style={{ fontSize: 14 }}>{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
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
