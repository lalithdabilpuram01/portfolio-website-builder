import { createClient } from '@/lib/supabase/server'

/**
 * Verifies the current request is from an authenticated admin or super_admin.
 * Returns the admin's user id, or null if not authorized.
 */
export async function requireAdmin(): Promise<{ id: string; role: string } | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role === 'admin' || roleData?.role === 'super_admin') {
    return { id: user.id, role: roleData.role }
  }
  return null
}
