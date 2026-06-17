import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/user-dashboard/PageHeader'
import SkillsEditor from '@/components/user-dashboard/SkillsEditor'
import type { Skill } from '@/types/portfolio'

export default async function SkillsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order')

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <PageHeader title="Skills" description="List your technical and professional skills." />
      <SkillsEditor initialSkills={(skills ?? []) as Skill[]} userId={user.id} />
    </div>
  )
}
