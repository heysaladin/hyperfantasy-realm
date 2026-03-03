'use client';

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Instagram, Linkedin, Twitter, Star } from "lucide-react"

import { testimonials } from "@/data/testimonials"
import { resolveContentAsText } from "@/lib/tiptap-content"

const GRADIENTS = [
  'from-purple-900/20 to-blue-900/20',
  'from-orange-900/20 to-red-900/20',
  'from-green-900/20 to-teal-900/20',
  'from-pink-900/20 to-purple-900/20',
]

export default function Home() {
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/portfolios')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        const visible = list.filter((p: any) => p.isVisible)
        const featured = visible.filter((p: any) => p.isFeatured)
        setPortfolios((featured.length ? featured : visible).slice(0, 4))
      })
      .catch(() => setPortfolios([]))

    fetch('/api/teams')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setTeams(list.filter((t: any) => t.isVisible))
      })
      .catch(() => setTeams([]))
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8">
              We craft digital
              <br />
              <span className="text-slate-500 dark:text-white/40">experiences</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-white/60 mb-12 max-w-2xl">
              A creative studio specializing in design, development, and digital strategy. 
              We help brands stand out in the digital landscape.
            </p>
            <Button size="lg" className="bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-white/90 group" aria-label="View our portfolio and recent projects">
              View Our Work
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section id="work" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-12">Selected Work</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolios.map((portfolio, index) => (
              <article key={portfolio.id} className="group cursor-pointer" onClick={() => window.location.href = `/projects/${portfolio.id}`}>
                <div className={`aspect-[4/3] bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} rounded-lg mb-6 overflow-hidden border border-slate-200 dark:border-white/5`}>
                  {portfolio.imageUrl ? (
                    <img
                      src={portfolio.imageUrl}
                      alt={portfolio.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/10 text-6xl font-bold group-hover:scale-105 transition-transform duration-500" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-2 group-hover:text-slate-700 dark:group-hover:text-white/60 transition text-slate-900 dark:text-white">
                  {portfolio.title}
                </h3>
                <p className="text-slate-600 dark:text-white/40 line-clamp-2">
                  {resolveContentAsText(portfolio.description)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 lg:px-8 bg-slate-50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900 dark:text-white">
                We believe in
                <br />
                <span className="text-slate-500 dark:text-white/40">creative excellence</span>
              </h2>

              {teams.length > 0 ? (
                <div className="space-y-6">
                  {teams.slice(0, 2).map((member) => (
                    <div key={member.id} className="flex items-start gap-4">
                      {member.avatarUrl && (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 mt-1"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{member.name}</p>
                        <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed line-clamp-3">
                          {resolveContentAsText(member.bio)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-slate-600 dark:text-white/60 leading-relaxed">
                  Hyperfantasy is a creative studio founded on the belief that great design
                  can transform businesses. We combine strategic thinking with beautiful
                  execution to create digital experiences that resonate.
                </p>
              )}
            </div>
            <div className="space-y-8">
              <div>
                <div className="text-6xl font-bold mb-2 text-slate-900 dark:text-white">50+</div>
                <div className="text-slate-600 dark:text-white/40">Projects Completed</div>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2 text-slate-900 dark:text-white">30+</div>
                <div className="text-slate-600 dark:text-white/40">Happy Clients</div>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2 text-slate-900 dark:text-white">5+</div>
                <div className="text-slate-600 dark:text-white/40">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-16">What We Do</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="text-4xl" aria-label="Palette icon representing design">🎨</div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Brand Design</h3>
              <p className="text-slate-600 dark:text-white/60">
                Creating distinctive visual identities that capture the essence of your brand 
                and resonate with your audience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl" aria-label="Laptop icon representing web development">💻</div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Web Development</h3>
              <p className="text-slate-600 dark:text-white/60">
                Building fast, beautiful, and responsive websites using modern technologies 
                and best practices.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl" aria-label="Mobile phone icon representing digital strategy">📱</div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Digital Strategy</h3>
              <p className="text-slate-600 dark:text-white/60">
                Crafting comprehensive digital strategies that drive growth and deliver 
                measurable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-slate-50 dark:bg-white/5 overflow-hidden">
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-4">Testimonials</h2>
          <h3 className="text-5xl md:text-6xl font-bold mb-16 text-slate-900 dark:text-white">
            What our clients say
          </h3>
        </div>

        {/* Marquee track */}
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-slate-50 dark:from-[#0d0d0d] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-slate-50 dark:from-[#0d0d0d] to-transparent" />

          <div
            style={{ animation: 'marquee 35s linear infinite', display: 'flex', gap: '24px', width: 'max-content' }}
            onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
            onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
          >
            {[...testimonials, ...testimonials].map((testimonial, i) => (
              <div
                key={i}
                className="w-80 shrink-0 bg-white dark:bg-white/10 rounded-lg p-6 border border-slate-200 dark:border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  {testimonial.image && (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-white/60">{testimonial.role}</p>
                    <p className="text-xs text-slate-500 dark:text-white/40">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  ))}
                </div>

                <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed line-clamp-4">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 bg-slate-900 dark:bg-white text-white dark:text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let's create something
            <br />
            amazing together
          </h2>
          <p className="text-xl text-white/60 dark:text-black/60 mb-12">
            Have a project in mind? We'd love to hear about it.
          </p>
          <Button size="lg" className="bg-white dark:bg-black text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90 group" aria-label="Get in touch with us via email">
            <Mail className="mr-2" size={20} aria-hidden="true" />
            Get in Touch
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} aria-hidden="true" />
          </Button>
        </div>
      </section>


    </div>
  );
}
