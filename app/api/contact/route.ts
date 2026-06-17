import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendContactEmail } from '@/lib/resend'

export async function POST(request: NextRequest) {
  let body: {
    to_username?: string
    from_name?: string
    from_email?: string
    message?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { to_username, from_name, from_email, message } = body
  if (!to_username || !from_name || !from_email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const service = createServiceClient()

  const { data: profile } = await service
    .from('profiles')
    .select('id, status')
    .eq('username', to_username)
    .eq('status', 'active')
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
  }

  const { data: authUser } = await service.auth.admin.getUserById(profile.id)
  const ownerEmail = authUser?.user?.email
  if (!ownerEmail) {
    return NextResponse.json({ error: 'Owner unavailable' }, { status: 500 })
  }

  try {
    await sendContactEmail(ownerEmail, from_name, from_email, message)
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
