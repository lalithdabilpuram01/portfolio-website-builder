'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function PendingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [username, setUsername] = useState<string>('')
  const [appUrl, setAppUrl] = useState('')

  useEffect(() => {
    setAppUrl(window.location.origin)
  }, [])

  useEffect(() => {
    let active = true

    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, status')
        .eq('id', user.id)
        .single()

      if (!active) return
      if (profile) {
        setUsername(profile.username)
        if (profile.status === 'active') {
          router.push('/dashboard')
        } else if (profile.status === 'suspended') {
          await supabase.auth.signOut()
          router.push('/login?error=suspended')
        }
      }
    }

    check()
    const interval = setInterval(check, 30000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [router, supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
      />
      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mb-8 flex justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl animate-pulse-glow"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            ⏳
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Your account is under review</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Thanks for signing up! An admin is reviewing your account. You&apos;ll be notified by
          email and automatically redirected once approved.
        </p>

        {username && (
          <div
            className="rounded-2xl p-6 mb-8 border border-white/10 text-left"
            style={{ background: 'rgba(15,23,42,0.7)' }}
          >
            <div className="text-sm text-slate-500 mb-1">Your portfolio will be live at:</div>
            <div className="font-mono text-indigo-400 break-all">
              {appUrl}/{username}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-8">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Checking status automatically every 30 seconds...
        </div>

        <button
          onClick={handleSignOut}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Sign out
        </button>
        <div className="mt-2">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-400">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
