// app/admin/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Link href="/admin/portfolios">
          <div className="p-6 border rounded-lg hover:border-white/40 transition">
            <h2 className="text-xl font-semibold mb-2">Portfolios</h2>
            <p className="text-white/60">Manage portfolio items</p>
          </div>
        </Link>

        <Link href="/admin/enquiries">
          <div className="p-6 border rounded-lg hover:border-white/40 transition">
            <h2 className="text-xl font-semibold mb-2">Enquiries</h2>
            <p className="text-white/60">View client enquiries</p>
          </div>
        </Link>

        <Link href="/admin/blogs">
          <div className="p-6 border rounded-lg hover:border-white/40 transition">
            <h2 className="text-xl font-semibold mb-2">Blogs</h2>
            <p className="text-white/60">Manage blog posts</p>
          </div>
        </Link>

        <Link href="/admin/teams">
          <div className="p-6 border rounded-lg hover:border-white/40 transition">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-white/60">View all users</p>
          </div>
        </Link>

      </div>
    </div>
  )
}