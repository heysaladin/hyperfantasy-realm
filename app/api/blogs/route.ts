import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return Response.json(blogs)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

// CREATE blog
export async function POST(request: NextRequest) {
  try {
    console.log('POST started')
    
    const supabase = await createClient()
    console.log('Supabase client created')
    
    const { data: { user } } = await supabase.auth.getUser()
    console.log('User:', user?.email || 'Not logged in')
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Body received:', body)
    
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content || null,
        coverImage: body.coverImage || null,
        tags: body.tags || [],
        isPublished: body.isPublished || false,
        authorId: body.authorId || null  // ← Add this line
      }
    })
    
    console.log('Blog created:', blog.id)
    console.log('Author ID:', blog.authorId)
    
    return Response.json(blog, { status: 201 })
    
  } catch (error: any) {
    console.error('=== POST ERROR ===')
    console.error('Error:', error.message)
    console.error('==================')
    
    return Response.json({ 
      error: 'Server error',
      details: error.message
    }, { status: 500 })
  }
}