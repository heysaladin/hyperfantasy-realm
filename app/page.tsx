import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowRight, Mail, Star, Monitor, Smile, ImageIcon, Box, Printer, Gem, Globe, Smartphone, PlayCircle } from 'lucide-react'
import { EnquiryCTAButton } from '@/components/enquiry-cta-button'
import { testimonials } from '@/data/testimonials'
import { resolveContentAsText } from '@/lib/tiptap-content'
import { prisma } from '@/lib/prisma'

const HomeAboutCarousel = dynamic(() => import('@/components/home-about-carousel').then(m => ({ default: m.HomeAboutCarousel })))
const HomeFloatingCTA   = dynamic(() => import('@/components/home-floating-cta').then(m => ({ default: m.HomeFloatingCTA })))

/* ── Design tokens ────────────────────────────────────────────────────── */
const BG       = '#030017'
const CARD     = '#181346'
const ACCENT   = '#b394f4'
const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

/* ── Hardcoded project IDs ────────────────────────────────────────────── */
const WORKS_IDS = [
  '0836a3b1-b559-4aac-9a14-ade27fade055',
  '66aa2874-eb23-4ce9-b520-932afefff90e',
  '9969f4b8-0147-4f4d-bb39-2157ee0d79cb',
]
const SHOTS_IDS = [
  'e0f2e536-4b60-4fce-ae18-02de8df964ae',
  '77c71f38-f6c7-4721-8190-3805758820e7',
  'd2ae0651-0693-42c3-b2d0-5d87760d2564',
]

const SERVICES = [
  { icon: Monitor,    label: 'UI Design'       },
  { icon: Smile,      label: 'UX Design'       },
  { icon: ImageIcon,  label: 'Illustration'    },
  { icon: Box,        label: '3D Design'       },
  { icon: Printer,    label: 'Graphic Design'  },
  { icon: Gem,        label: 'Brand Identity'  },
  { icon: Globe,      label: 'Web Dev.'         },
  { icon: Smartphone, label: 'Mobile App Dev.' },
  { icon: PlayCircle, label: 'Micro Motion'    },
]

const CLIENTS = [
  { name: 'EZ Laundry', logo: '/logos/logo-ezlaundry.png' },
  { name: 'Greatsoft',  logo: '/logos/logo-greatsoft.png'  },
  { name: 'Tresnan',    logo: '/logos/logo-tresnan.png'    },
  { name: 'Akasia',     logo: '/logos/logo-akasia.png'     },
  { name: 'Tammwel',    logo: '/logos/logo-tammwel.png'    },
  { name: 'Sigmatech',  logo: '/logos/logo-sigmatech.png'  },
]

async function getProjects(ids: string[]) {
  const rows = await prisma.portfolio.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true, description: true, imageUrl: true, category: true },
  })
  // preserve caller-defined order
  return ids.map(id => rows.find(r => r.id === id)).filter(Boolean) as typeof rows
}

export default async function Home() {
  const [portfolios, shots] = await Promise.all([
    getProjects(WORKS_IDS),
    getProjects(SHOTS_IDS),
  ])

  return (
    <div style={{ fontFamily: 'var(--font-sora, sans-serif)' }}
      className="min-h-screen bg-white dark:text-white transition-colors"
    >
      <style>{`
        .dark .hf-page  { background-color: ${BG}; }
        .hf-page        { background-color: #ffffff; }
        .grad-btn       { background: ${GRADIENT}; color:#fff; border:none; border-radius:48px; padding:14px 32px; font-size:16px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:opacity .2s; }
        .grad-btn:hover { opacity:.88; }
        .ghost-btn      { border:1px solid rgba(0,0,0,.3); border-radius:24px; padding:13px 24px; font-size:14px; font-weight:500; display:inline-flex; align-items:center; gap:8px; color:inherit; background:transparent; min-height:44px; }
        .dark .ghost-btn { border-color:rgba(255,255,255,.4); }
        .before-title   { color:#7c3aed; display:block; font-size:14px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; margin-bottom:16px; text-align:center; }
        .dark .before-title { color:${ACCENT}; }
        .hf-accent-text { color:#7c3aed; }
        .dark .hf-accent-text { color:${ACCENT}; }
        .dark .hf-card  { background:${CARD}; }
        .hf-card        { background:#f1f0ff; }
        .dark .hf-action { background:${CARD}; }
        .hf-action      { background:#1a1560; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-track  { animation: marquee 40s linear infinite; display:flex; gap:24px; width:max-content; }
        .marquee-track:hover { animation-play-state: paused; }
        .dark .hf-fade-l { background: linear-gradient(to right, ${BG}, transparent); }
        .dark .hf-fade-r { background: linear-gradient(to left,  ${BG}, transparent); }
        .hf-fade-l { background: linear-gradient(to right, #ffffff, transparent); }
        .hf-fade-r { background: linear-gradient(to left,  #ffffff, transparent); }
        .hf-work-card { padding: 20px 16px; display:grid; grid-template-columns:1fr; gap:16px; align-items:center; }
        @media (min-width:1024px) { .hf-work-card { padding:40px 48px; grid-template-columns:1fr 1fr; gap:32px; } }
      `}</style>

      <div className="hf-page">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="pt-40 pb-32 px-6 lg:px-8 text-center" aria-label="Hero">
          <div className="max-w-5xl mx-auto">
            <h1 style={{ fontSize: 'clamp(40px,7vw,86px)', fontWeight: 600, lineHeight: '135%' }}
              className="mb-10 dark:text-white text-slate-900">
              Leveraging design<br />&amp; tech to bring<br />
              <span style={{ background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>your fantasy life!</span>
            </h1>
            <p className="text-lg dark:text-white/60 text-slate-600 mb-10">Have any awesome fantasy?</p>
            <EnquiryCTAButton className="grad-btn">Let&apos;s talk! <ArrowRight size={18} aria-hidden="true" /></EnquiryCTAButton>
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <HomeAboutCarousel />
              <div>
                <span className="before-title" style={{ textAlign: 'left' }}>About Us</span>
                <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 500, lineHeight: '135%' }}
                  className="dark:text-white text-slate-900 mb-6">
                  We are Hyperfantasy<br />Let&apos;s work together!
                </h2>
                <p style={{ fontSize: 18, fontWeight: 300, lineHeight: '150%' }}
                  className="dark:text-white/70 text-slate-600 mb-8">
                  We are a creative team that loves to solve problems &amp; building awesome digital products.
                </p>
                <p style={{ fontSize: 20, fontWeight: 400, lineHeight: '150%' }}
                  className="dark:text-white text-slate-800">
                  Listening&nbsp;<span className="dark:text-white/40 text-slate-400">+</span>&nbsp;Design Thinking&nbsp;<span className="dark:text-white/40 text-slate-400">+</span>&nbsp;Creative Solution
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO ───────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
          <div className="max-w-7xl mx-auto text-center">
            <span className="before-title">What We Do</span>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, marginBottom: 64 }}
              className="dark:text-white text-slate-900">
              Some of the solutions we offer
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {SERVICES.map(({ icon: Icon, label }) => (
                <div key={label} style={{ width: '18%', minWidth: 80, maxWidth: 120 }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-2xl hf-card flex items-center justify-center group-hover:opacity-80 transition border border-black/10 dark:border-white/10">
                    <Icon size={24} className="dark:text-white/80 text-slate-700" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500 }} className="dark:text-white text-slate-700 text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR WORKS ────────────────────────────────────────── */}
        {portfolios.length > 0 && (
          <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="before-title">Our Works</span>
                <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600 }}
                  className="dark:text-white text-slate-900">
                  Our case study &amp; projects
                </h2>
              </div>
              <div className="flex flex-col gap-4 lg:gap-8">
                {portfolios.map((p, i) => {
                  const isEven = i % 2 === 0
                  return (
                    <Link key={p.id} href={`/projects/${p.id}`}>
                      <div className="hf-card hf-work-card rounded-3xl group cursor-pointer hover:opacity-90 transition-opacity">
                        {/* Text — always order-1 on mobile; even→col1, odd→col2 on desktop */}
                        <div className={isEven ? 'order-1 text-left lg:order-1' : 'order-1 text-left lg:order-2 lg:text-right'}>
                          {p.category && (
                            <span style={{ color: ACCENT, fontSize: 16, fontWeight: 400, display: 'block', marginBottom: 10 }}>
                              {p.category}
                            </span>
                          )}
                          <h3 style={{ fontSize: 28, fontWeight: 600, lineHeight: '40px', margin: '8px 0 8px' }}
                            className="dark:text-white text-slate-900 group-hover:opacity-70 transition">
                            {p.title}
                          </h3>
                          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: '170%' }}
                            className="dark:text-white/70 text-slate-600 line-clamp-3">
                            {resolveContentAsText(p.description)}
                          </p>
                        </div>
                        {/* Image — always order-2 on mobile; even→col2, odd→col1 on desktop */}
                        <div className={`aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 relative ${isEven ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}`}>
                          {p.imageUrl
                            ? <Image src={p.imageUrl} alt={p.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            : <div className="w-full h-full flex items-center justify-center text-6xl font-bold dark:text-white/10 text-slate-200">{String(i + 1).padStart(2, '0')}</div>
                          }
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── OUR SHOTS ────────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
          <div className="max-w-7xl mx-auto text-center">
            <span className="before-title">Our Shots</span>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, marginBottom: 64 }}
              className="dark:text-white text-slate-900">
              Some of our design explorations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {shots.map((p, i) => (
                <Link key={p.id} href={`/projects/${p.id}`}>
                  <div style={{ borderRadius: 8 }}
                    className="aspect-square overflow-hidden hf-card border border-black/10 dark:border-white/10 relative"
                  >
                    {p.imageUrl && (
                      <Image src={p.imageUrl} alt={p.title} fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link href="/projects" className="ghost-btn">View Portfolio <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        {/* ── CLIENTS ──────────────────────────────────────────── */}
        <section className="py-20 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
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

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        <section className="py-24 border-t border-black/10 dark:border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
            <span className="before-title">Testimonials</span>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600 }}
              className="dark:text-white text-slate-900">
              What they said about us
            </h2>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 hf-fade-l" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 hf-fade-r" />
            <div className="marquee-track">
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="hf-card border border-black/10 dark:border-white/10 rounded-2xl p-8 shrink-0"
                  style={{ width: 380 }}
                >
                  <div className="flex gap-0.5 mb-5" role="img" aria-label={`Rating: ${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 400, lineHeight: '160%' }}
                    className="dark:text-white/70 text-slate-700 mb-6">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                    {t.image && (
                      <Image src={t.image} alt={t.name} width={48} height={48} className="rounded-2xl object-cover shrink-0" />
                    )}
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 500 }} className="dark:text-white text-slate-900">{t.name}</p>
                      <p style={{ fontSize: 14 }} className="dark:text-white/50 text-slate-500">{t.role}, {t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section id="hf-cta" className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="hf-action rounded-3xl text-center text-white" style={{ padding: '100px 64px' }}>
              <h2 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 600, lineHeight: '150%', marginBottom: 40 }}>
                Have any awesome fantasy?
              </h2>
              <EnquiryCTAButton id="hf-cta-btn" className="grad-btn"><Mail size={18} aria-hidden="true" /> Let&apos;s talk!</EnquiryCTAButton>
            </div>
          </div>
        </section>

      </div>

      <HomeFloatingCTA ctaBtnId="hf-cta-btn" scrollThreshold={300} />
    </div>
  )
}
