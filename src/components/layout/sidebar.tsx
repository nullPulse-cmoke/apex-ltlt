'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Trophy,
  UserCircle,
  LogOut,
  ChevronLeft,
  Zap,
  ShieldAlert,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/avatar'
import { cn, getTierInfo } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Programs', href: '/programs', icon: FolderKanban },
  { label: 'Applications', href: '/applications', icon: FileText },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { label: 'Profile', href: '/profile', icon: UserCircle },
]

interface SidebarProps {
  user: {
    fullName: string
    email: string
    tier: string
    totalXp: number
    avatarUrl?: string | null
    role: string
  }
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}

export function Sidebar({ user, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const tierInfo = getTierInfo(user.tier)

  const items: Array<{
    label: string
    href: string
    icon: React.ComponentType<any>
    soon?: boolean
  }> = [...navItems]
  if (user.role === 'ADMIN') {
    items.push({ label: 'Admin Panel', href: '/admin', icon: ShieldAlert })
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen flex flex-col glass-strong transition-all duration-300 border-r border-[var(--border-subtle)]',
          // Desktop sizing
          collapsed ? 'lg:w-[72px]' : 'lg:w-64',
          // Mobile responsive drawer classes
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
          // Desktop width falls back based on collapsed status
          !collapsed ? 'lg:w-64' : 'lg:w-[72px]'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--border-subtle)]">
          {!collapsed && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2"
              onClick={() => setIsOpen?.(false)}
            >
              <img src="/logo.png" alt="APEX Logo" className="h-7 w-auto object-contain" />
              <span className="font-bold text-lg gradient-text">APEX</span>
            </Link>
          )}
          {collapsed && (
            <img src="/logo.png" alt="APEX Logo" className="mx-auto h-7 w-auto object-contain" />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors hidden lg:block"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            if (item.soon) {
              return (
                <div
                  key={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed select-none border border-transparent',
                    collapsed && 'justify-center px-2'
                  )}
                  title="Coming Soon"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 shrink-0 text-[var(--text-muted)]" />
                    {!collapsed && <span className="text-[var(--text-muted)]">{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-default)]">
                      Soon
                    </span>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen?.(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[var(--violet)]/15 text-[var(--violet-light)] border border-[var(--violet)]/25'
                    : 'border border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-[var(--violet-light)]')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-[var(--border-subtle)] p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.fullName}</p>
                <div className="flex items-center gap-1.5">
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', tierInfo.className)}>
                    {tierInfo.label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-1.5 rounded-md hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--red)] transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex justify-center p-2 rounded-md hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--red)] transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Spacer to push content */}
      <div className={cn('shrink-0 transition-all duration-300 hidden lg:block', collapsed ? 'w-[72px]' : 'w-64')} />
    </>
  )
}
