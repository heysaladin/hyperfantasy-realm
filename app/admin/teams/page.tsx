'use client'

import { useEffect, useState } from 'react'

export default function TeamsPage() {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => setTeams(Array.isArray(data) ? data : (data.items ?? [])))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
      </div>

      <div className="space-y-4">
        {teams.map((member: any) => (
          <div key={member.id} className="p-4 border border-slate-300 dark:border-white/10 rounded-lg flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition">
            {member.avatarUrl && (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-slate-600 dark:text-white/60">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
