import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/user-dashboard/PageHeader'
import ExperienceEditor from '@/components/user-dashboard/ExperienceEditor'

export default async function ExperiencePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('experience')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order')

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <PageHeader title="Experience" description="Add your work history and professional roles." />
      <ExperienceEditor userId={user.id} initial={items ?? []} />
    </div>
  )
}
