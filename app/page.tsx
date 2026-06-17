import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import type { SiteSettings } from '@/types/portfolio'

const features = [
  {
    icon: '🎨',
    title: 'Beautiful Themes',
    desc: 'Choose from multiple professionally designed themes — Classic, Minimal, and Bold. Switch anytime.',
  },
  {
    icon: '⚡',
    title: 'Dynamic & Interactive',
    desc: 'Smooth animations, hover effects, and interactive elements make your portfolio stand out.',
  },
  {
    icon: '🔒',
    title: 'Privacy Controls',
    desc: 'Control exactly what visitors see. Toggle visibility on each field individually.',
  },
]

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const service = createServiceClient()
  const { data: settings } = await service.from('site_settings').select('*').eq('id', 1).single()
  const s = (settings ?? {}) as Partial<SiteSettings>
  return (
    <div className="min-h-screen bg-[#050a14] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)', animationDelay: '4s' }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
            P
          </div>
          <span className="text-lg font-semibold tracking-tight">PortfolioBuilder</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-24 pb-20 max-w-5xl mx-auto">
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-8 border"
          style={{
            background: 'rgba(99,102,241,0.1)',
            borderColor: 'rgba(99,102,241,0.3)',
            color: '#a5b4fc',
          }}
        >
          ✨ Beautiful portfolios in minutes
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
          Your portfolio,{' '}
          <span className="gradient-text">your way</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Build a stunning professional portfolio with dynamic themes, interactive animations,
          and full control over your data. Share it at{' '}
          <span className="text-indigo-400 font-mono">sitename.com/username</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 30px rgba(99,102,241,0.4)',
            }}
          >
            <span className="relative z-10">Create your portfolio</span>
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl font-semibold border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-300"
          >
            Browse portfolios →
          </Link>
        </div>
      </section>

      {/* Preview mockup */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            borderColor: 'rgba(99,102,241,0.2)',
            background: 'rgba(15,23,42,0.8)',
            boxShadow: '0 0 80px rgba(99,102,241,0.15)',
          }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <div className="mx-auto text-xs text-slate-500 font-mono">yoursite.com/username</div>
          </div>
          <div className="p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold animate-pulse-glow">
                  LD
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Lalith Dabilpuram</div>
                  <div className="text-indigo-400 text-sm">AI Full Stack Engineer · San Francisco</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Building scalable systems and beautiful UIs. Passionate about developer tools and open source.
              </p>
              <div className="flex gap-2 flex-wrap">
                {['GitHub', 'LinkedIn', 'Resume'].map((label) => (
                  <span
                    key={label}
                    className="px-3 py-1 text-xs rounded-full border border-indigo-500/30 text-indigo-400"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-300 mb-3">Featured Projects</div>
              {['AI Portfolio Builder', 'E-Commerce Platform', 'Real-time Chat App'].map((p, i) => (
                <div
                  key={p}
                  className="flex items-center gap-3 p-3 rounded-lg mb-2 border border-white/5 hover:border-indigo-500/30 transition-colors"
                  style={{ background: 'rgba(99,102,241,0.05)' }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: ['#6366f1', '#8b5cf6', '#ec4899'][i] }}
                  />
                  <span className="text-sm text-slate-300">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Everything you need to shine
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group"
              style={{ background: 'rgba(15,23,42,0.6)' }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24 text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-white">Ready to build yours?</h2>
        <p className="text-slate-400 mb-8">Free forever. No credit card required.</p>
        <Link
          href="/signup"
          className="inline-block px-10 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 40px rgba(99,102,241,0.4)',
          }}
        >
          Get started for free
        </Link>
      </section>

      {/* Creator section — always shown at the bottom */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <div
          className="rounded-3xl p-8 md:p-12 border flex flex-col md:flex-row items-center gap-8"
          style={{ borderColor: 'rgba(99,102,241,0.2)', background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)' }}
        >
          {s.creator_picture_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.creator_picture_url}
              alt={s.creator_name ?? 'Creator'}
              className="w-28 h-28 rounded-full object-cover border-4 shrink-0"
              style={{ borderColor: 'rgba(99,102,241,0.4)' }}
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shrink-0">
              {s.creator_name?.[0] ?? '?'}
            </div>
          )}
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Created by</p>
            <h3 className="text-2xl font-bold text-white">{s.creator_name ?? 'The Creator'}</h3>
            {s.creator_tagline && <p className="text-indigo-300 mt-1">{s.creator_tagline}</p>}
            {s.creator_bio && <p className="text-slate-400 mt-3 leading-relaxed text-sm">{s.creator_bio}</p>}
          </div>
        </div>
      </section>

      <footer className="relative z-10 text-center text-slate-600 text-sm pb-8">
        © {new Date().getFullYear()} PortfolioBuilder. Built with Next.js + Supabase.
      </footer>
    </div>
  )
}
