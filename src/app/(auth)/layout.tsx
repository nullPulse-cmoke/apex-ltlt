import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Zap } from 'lucide-react'

export const metadata = {
  title: 'Authentication',
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    })
    if (user) {
      redirect('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--violet)]/20 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--cyan)]/15 rounded-full blur-[128px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--violet-dark)]/10 rounded-full blur-[200px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="APEX GROUP Logo" className="h-12 w-auto object-contain select-none" />
            <h1 className="text-3xl font-bold gradient-text">APEX GROUP</h1>
          </div>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8 animate-slide-up shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}
