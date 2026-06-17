import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/user-dashboard/PageHeader'
import ThemePicker from '@/components/user-dashboard/ThemePicker'
import type { Theme } from '@/types/portfolio'

export default async function ThemePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: themes }] = await Promise.all([
    supabase.from('profiles').select('username, selected_theme').eq('id', user.id).single(),
    supabase.from('themes').select('*').eq('is_active', true).order('name'),
  ])

  if (!profile) redirect('/login')

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <PageHeader
        title="Theme"
        description="Choose how your portfolio looks. Changes apply instantly."
      />
      <ThemePicker
        themes={(themes ?? []) as Theme[]}
        currentTheme={profile.selected_theme || 'classic'}
        username={profile.username}
      />
    </div>
  )
}
