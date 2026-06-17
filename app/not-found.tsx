import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center px-6 text-center">
      <div>
        <div className="text-7xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Portfolio not found</h1>
        <p className="text-slate-400 mb-8">
          This portfolio doesn&apos;t exist or isn&apos;t public yet.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
