'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.04] rounded-full blur-[160px] pointer-events-none" />
      
      {/* Subtle grid mesh overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center animate-fade-in">
        
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] tracking-wider mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
          <span>404 ERROR</span>
        </div>

        {/* Hero 404 text */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-tighter gradient-text leading-none mb-3">
          404
        </h1>

        {/* Title & Description */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
          Page not found
        </h2>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mb-8">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Minimal Action Controls */}
        <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-[var(--bg-surface)] border border-[var(--border-default)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl btn-gradient text-xs font-semibold shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Minimal Footer Signature */}
        <div className="mt-16 text-[11px] font-mono text-[var(--text-muted)] tracking-widest uppercase opacity-60">
          APEX GROUP
        </div>
      </div>
    </main>
  )
}
