import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'
import { sendApprovalEmail } from '@/lib/resend'

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { user_id } = await request.json()
  if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const service = createServiceClient()

  const { error } = await service
    .from('profiles')
    .update({ status: 'active', approved_at: new Date().toISOString(), approved_by: admin.id })
    .eq('id', user_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await service.from('audit_log').insert({
    admin_id: admin.id,
    action: 'approved',
    target_user_id: user_id,
  })

  // Send approval email (best-effort)
  try {
    const { data: profile } = await service
      .from('profiles')
      .select('username')
      .eq('id', user_id)
      .single()
    const { data: authUser } = await service.auth.admin.getUserById(user_id)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
    if (authUser?.user?.email && profile) {
      await sendApprovalEmail(authUser.user.email, profile.username, appUrl)
    }
  } catch {}

  return NextResponse.json({ ok: true })
}
