import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/user-dashboard/PageHeader'
import ResumeUpload from '@/components/user-dashboard/ResumeUpload'
import type { Profile } from '@/types/portfolio'

export default async function ResumePage() {
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
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <PageHeader title="Resume" description="Upload a PDF resume for visitors to download." />
      <ResumeUpload profile={profile as Profile} />
    </div>
  )
}
