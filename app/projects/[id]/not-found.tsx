import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-white/60 mb-8">Portfolio not found</p>
        <Link href="/projects">
          <Button>Back to Works</Button>
        </Link>
      </div>
    </div>
  )
}