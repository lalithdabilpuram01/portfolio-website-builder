import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { user_id } = await request.json()
  if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const service = createServiceClient()

  // Remove storage files (best-effort)
  try {
    const { data: avatarFiles } = await service.storage.from('avatars').list(user_id)
    if (avatarFiles?.length) {
      await service.storage
        .from('avatars')
        .remove(avatarFiles.map((f) => `${user_id}/${f.name}`))
    }
    const { data: resumeFiles } = await service.storage.from('resumes').list(user_id)
    if (resumeFiles?.length) {
      await service.storage
        .from('resumes')
        .remove(resumeFiles.map((f) => `${user_id}/${f.name}`))
    }
  } catch {}

  // Deleting the auth user cascades to profiles, projects, skills, user_roles
  const { error } = await service.auth.admin.deleteUser(user_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log after deletion: store the id in metadata (target_user_id FK would otherwise
  // block deletion, and the row would be orphaned).
  await service.from('audit_log').insert({
    admin_id: admin.id,
    action: 'deleted',
    target_user_id: null,
    metadata: { deleted_user_id: user_id },
  })

  return NextResponse.json({ ok: true })
}
