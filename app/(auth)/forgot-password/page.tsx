import Link from 'next/link'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">P</div>
          <span className="text-xl font-semibold text-white">PortfolioBuilder</span>
        </Link>
        <div className="rounded-2xl p-8 border border-white/10" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)' }}>
          <h1 className="text-2xl font-bold text-white mb-1">Forgot password?</h1>
          <p className="text-slate-400 text-sm mb-6">Enter your email and we&apos;ll send a reset link.</p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
