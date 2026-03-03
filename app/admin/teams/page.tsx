'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function TeamsPage() {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(setTeams)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return
    
    await fetch(`/api/teams/${id}`, { method: 'DELETE' })
    setTeams(teams.filter((t: any) => t.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Link href="/admin/teams/new">
          <Button>
            <Plus className="mr-2" size={16} />
            Add Member
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {teams.map((member: any) => (
          <div key={member.id} className="p-4 border border-slate-300 dark:border-white/10 rounded-lg flex justify-between items-center hover:bg-slate-50 dark:hover:bg-white/5 transition">
            <div className="flex items-center gap-4">
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
            <div className="flex gap-2">
              <Link href={`/admin/teams/${member.id}`}>
                <Button variant="outline" size="sm">
                  <Pencil size={16} />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDelete(member.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}