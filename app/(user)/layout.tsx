import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/user-dashboard/Sidebar'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, status')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.status === 'pending') redirect('/pending')
  if (profile.status === 'suspended') redirect('/login?error=suspended')

  return (
    <div className="min-h-screen bg-[#050a14] flex">
      <Sidebar username={profile.username} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
