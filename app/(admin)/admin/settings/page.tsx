import { createServiceClient } from '@/lib/supabase/server'
import SettingsPanel from '@/components/admin-dashboard/SettingsPanel'
import LandingPageSettings from '@/components/admin-dashboard/LandingPageSettings'
import type { Theme, SiteSettings } from '@/types/portfolio'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const service = createServiceClient()
  const [{ data: themes }, { data: siteSettings }] = await Promise.all([
    service.from('themes').select('*').order('name'),
    service.from('site_settings').select('*').eq('id', 1).single(),
  ])

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage themes, landing page, and platform data.</p>
      </div>
      <div className="space-y-6">
        <LandingPageSettings initial={(siteSettings ?? null) as SiteSettings | null} />
        <SettingsPanel initialThemes={(themes ?? []) as Theme[]} />
      </div>
    </div>
  )
}
