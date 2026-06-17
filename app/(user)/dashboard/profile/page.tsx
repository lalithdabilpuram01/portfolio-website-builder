import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/user-dashboard/PageHeader'
import ProfileEditor from '@/components/user-dashboard/ProfileEditor'
import type { Profile } from '@/types/portfolio'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <PageHeader
        title="Profile"
        description="Manage your personal information, photo, and social links."
      />
      <ProfileEditor profile={profile as Profile} />
    </div>
  )
}
