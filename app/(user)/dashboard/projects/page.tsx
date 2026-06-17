import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/user-dashboard/PageHeader'
import ProjectsEditor from '@/components/user-dashboard/ProjectsEditor'
import type { Project } from '@/types/portfolio'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order')

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <PageHeader
        title="Projects"
        description="Showcase your work. Drag to reorder."
      />
      <ProjectsEditor initialProjects={(projects ?? []) as Project[]} userId={user.id} />
    </div>
  )
}
