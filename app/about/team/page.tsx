import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { team } from "@/data/team"
import { TeamImageFlicker } from "@/components/team-image-flicker"

export const metadata: Metadata = {
  title: "Team — Hyperfantasy Creative Studio",
  description: "Meet the designers, engineers, and strategists behind Hyperfantasy Creative Studio.",
}

export default async function TeamPage() {

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors pt-16">

      {/* Header */}
      <section className="pt-16 pb-20 px-6 lg:px-8 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition mb-10"
            aria-label="Back to About"
          >
            <ArrowLeft size={16} aria-hidden="true" />

            About
          </Link>
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-6">The Team</p>
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8">
            The people
            <br />
            <span className="text-slate-500 dark:text-white/40">behind the work</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-white/60 max-w-2xl leading-relaxed">
            A small, focused team of designers, engineers, and strategists united by
            a shared obsession with craft and quality.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, index) => {
              const opacity = index === team.length - 1 ? 'opacity-25' : index === team.length - 2 ? 'opacity-50' : ''
              return (
              <article key={member.id} className={`group ${opacity}`}>
                <div className={`relative aspect-square bg-gradient-to-br ${member.gradient} rounded-lg mb-6 overflow-hidden border border-slate-200 dark:border-white/5`}>
                  {member.image ? (
                    index >= 1 && index <= 5
                      ? <TeamImageFlicker src={member.image} alt={member.name} />
                      : member.image?.startsWith('data:')
                        ? <img src={member.image} alt={member.name} className={`${index > 5 ? 'grayscale' : ''} w-full h-full object-cover group-hover:scale-105 transition-transform duration-500`} />
                        : <Image src={member.image!} alt={member.name} fill sizes="(max-width: 768px) 100vw, 33vw" className={`${index > 5 ? 'grayscale' : ''} object-cover group-hover:scale-105 transition-transform duration-500`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-300 dark:text-white/10 select-none">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-1">{member.name}</h2>
                <p className="text-sm text-slate-500 dark:text-white/40 mb-3">
                  {member.interchangeable ? 'Project-based Team' : member.role}
                </p>
                {member.bio && <p className="text-slate-600 dark:text-white/60 leading-relaxed text-sm">{member.bio}</p>}
              </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-32 px-6 lg:px-8 bg-slate-900 dark:bg-white text-white dark:text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let's work
            <br />
            together
          </h2>
          <p className="text-xl text-white/60 dark:text-black/60 mb-12">
            Have a project in mind? We'd love to hear about it.
          </p>
          <Link href="/enquiry">
            <Button
              size="lg"
              className="bg-white dark:bg-black text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90"
              aria-label="Get in touch about joining the team"
            >
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>


    </div>
  )
}
