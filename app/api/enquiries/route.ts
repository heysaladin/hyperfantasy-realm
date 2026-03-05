import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return Response.json(enquiries)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
  }
}

// Public POST (no auth needed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const enquiry = await prisma.enquiry.create({
      data: body
    })

    // Send email notification (non-blocking)
    new Resend(process.env.RESEND_API_KEY).emails.send({
      from: 'Hyperfantasy <onboarding@resend.dev>',
      to: 'hello.hyperfantasy@gmail.com',
      subject: `New Enquiry from ${enquiry.name}`,
      html: `
        <h2>New Enquiry</h2>
        <p><strong>Name:</strong> ${enquiry.name}</p>
        <p><strong>Email:</strong> ${enquiry.email}</p>
        ${enquiry.company ? `<p><strong>Company:</strong> ${enquiry.company}</p>` : ''}
        ${enquiry.budget ? `<p><strong>Budget:</strong> ${enquiry.budget}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${enquiry.message.replace(/\n/g, '<br>')}</p>
      `,
    }).catch(console.error)

    return Response.json(enquiry)
  } catch (error) {
    return Response.json({ error: 'Failed to create enquiry' }, { status: 500 })
  }
}