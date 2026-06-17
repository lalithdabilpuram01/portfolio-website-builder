import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/user-dashboard/PageHeader'
import CertificatesEditor from '@/components/user-dashboard/CertificatesEditor'

export default async function CertificatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order')

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <PageHeader title="Certificates" description="Showcase your certifications and credentials." />
      <CertificatesEditor userId={user.id} initial={items ?? []} />
    </div>
  )
}
