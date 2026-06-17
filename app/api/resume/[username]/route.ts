import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, resume_url, show_resume, status')
    .eq('username', username)
    .eq('status', 'active')
    .single()

  if (!profile || !profile.resume_url || !profile.show_resume) {
    return NextResponse.json({ error: 'Resume unavailable' }, { status: 404 })
  }

  // Generate a short-lived signed URL via the service client (private bucket)
  const service = createServiceClient()
  const { data, error } = await service.storage
    .from('resumes')
    .createSignedUrl(profile.resume_url, 60 * 5)

  if (error || !data) {
    return NextResponse.json({ error: 'Could not generate link' }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
