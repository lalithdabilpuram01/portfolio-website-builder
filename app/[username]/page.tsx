import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getThemeComponent } from '@/lib/themes'
import type { Profile, Project, Skill } from '@/types/portfolio'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, job_title, bio')
    .eq('username', username)
    .eq('status', 'active')
    .single()

  if (!profile) return { title: 'Portfolio not found' }

  return {
    title: `${profile.full_name}${profile.job_title ? ` · ${profile.job_title}` : ''}`,
    description: profile.bio?.slice(0, 160) ?? `${profile.full_name}'s portfolio`,
  }
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('status', 'active')
    .single()

  if (!profile) notFound()

  const [
    { data: projects },
    { data: skills },
    { data: experience },
    { data: education },
    { data: certificates },
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('user_id', profile.id).order('display_order'),
    supabase.from('skills').select('*').eq('user_id', profile.id).order('display_order'),
    supabase.from('experience').select('*').eq('user_id', profile.id).order('display_order'),
    supabase.from('education').select('*').eq('user_id', profile.id).order('display_order'),
    supabase.from('certificates').select('*').eq('user_id', profile.id).order('display_order'),
  ])

  // Attach email only if the user chose to display it
  const enriched = profile as Profile & { email?: string }
  if (profile.show_email) {
    try {
      const service = createServiceClient()
      const { data: authUser } = await service.auth.admin.getUserById(profile.id)
      if (authUser?.user?.email) enriched.email = authUser.user.email
    } catch {}
  }

  const ThemeLayout = await getThemeComponent(profile.selected_theme || 'classic')

  return (
    <ThemeLayout
      profile={enriched}
      projects={(projects ?? []) as Project[]}
      skills={(skills ?? []) as Skill[]}
      experience={experience ?? []}
      education={education ?? []}
      certificates={certificates ?? []}
    />
  )
}
