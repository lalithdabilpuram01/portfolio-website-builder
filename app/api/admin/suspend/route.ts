import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'
import { sendSuspensionEmail } from '@/lib/resend'

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { user_id, reason } = await request.json()
  if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const service = createServiceClient()

  const { error } = await service
    .from('profiles')
    .update({ status: 'suspended' })
    .eq('id', user_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await service.from('audit_log').insert({
    admin_id: admin.id,
    action: 'suspended',
    target_user_id: user_id,
    metadata: reason ? { reason } : null,
  })

  try {
    const { data: authUser } = await service.auth.admin.getUserById(user_id)
    if (authUser?.user?.email) await sendSuspensionEmail(authUser.user.email, reason)
  } catch {}

  return NextResponse.json({ ok: true })
}
