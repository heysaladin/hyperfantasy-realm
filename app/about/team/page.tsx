import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { resolveContentAsText } from "@/lib/tiptap-content"

export const metadata: Metadata = {
  title: "Team — Hyperfantasy Creative Studio",
  description: "Meet the designers, engineers, and strategists behind Hyperfantasy Creative Studio.",
}

const GRADIENTS = [
  'from-purple-900/20 to-blue-900/20',
  'from-orange-900/20 to-red-900/20',
  'from-green-900/20 to-teal-900/20',
  'from-pink-900/20 to-purple-900/20',
  'from-yellow-900/20 to-orange-900/20',
  'from-blue-900/20 to-cyan-900/20',
]

async function getTeam() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/teams`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.filter((t: any) => t.isVisible) : []
  } catch {
    return []
  }
}

export default async function TeamPage() {
  const team = await getTeam()

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
          {team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {team.map((member: any, index: number) => (
                <article key={member.id} className="group">
                  {/* Avatar */}
                  <div className={`aspect-square bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} rounded-lg mb-6 overflow-hidden border border-slate-200 dark:border-white/5`}>
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-300 dark:text-white/10 select-none" aria-hidden="true">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold mb-5">{member.name}</h2>

                  {member.bio && (
                    <p className="text-slate-600 dark:text-white/60 leading-relaxed text-sm">
                      {resolveContentAsText(member.bio)}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-white/40">No team members found.</p>
          )}
        </div>
      </section>

      {/* Join Us */}
      <section className="py-32 px-6 lg:px-8 bg-slate-900 dark:bg-white text-white dark:text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Want to join
            <br />
            the team?
          </h2>
          <p className="text-xl text-white/60 dark:text-black/60 mb-12">
            We're always looking for talented people who care about their craft.
          </p>
          <Button
            size="lg"
            className="bg-white dark:bg-black text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90"
            aria-label="Get in touch about joining the team"
          >
            Get in Touch
          </Button>
        </div>
      </section>


    </div>
  )
}
