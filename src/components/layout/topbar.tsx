'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Zap, Hash, Bell, Check, Menu } from 'lucide-react'
import { formatXp, getTierInfo, timeAgo } from '@/lib/utils'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/programs': 'Programs',
  '/applications': 'My Applications',
  '/leaderboard': 'Leaderboard',
  '/profile': 'Profile',
}

interface TopbarProps {
  user: {
    totalXp: number
    tier: string
  }
  rank?: number | string
  onMenuToggle?: () => void
}

interface NotificationItem {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string | Date
}

export function Topbar({ user, rank, onMenuToggle }: TopbarProps) {
  const pathname = usePathname()
  const tierInfo = getTierInfo(user.tier)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const title = Object.entries(pageTitles).find(([path]) =>
    pathname.startsWith(path)
  )?.[1] || 'APEX'

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (e) {
      console.error('Failed to load notifications', e)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll notifications every 30 seconds for live updates
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH' })
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      }
    } catch (e) {
      console.error('Failed to mark read', e)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 h-16 glass-strong border-b border-[var(--border-subtle)] flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors lg:hidden"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* XP Badge */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[var(--violet)]/10 border border-[var(--violet)]/20">
          <Zap className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[var(--violet-light)]" />
          <span className="text-xs sm:text-sm font-semibold text-[var(--violet-light)] font-mono">
            {formatXp(user.totalXp)}<span className="hidden xs:inline"> XP</span>
          </span>
        </div>

        {/* Rank Badge */}
        {rank !== undefined && (
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[var(--cyan)]/10 border border-[var(--cyan)]/20">
            <Hash className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[var(--cyan)]" />
            <span className="text-xs sm:text-sm font-semibold text-[var(--cyan)] font-mono">
              {typeof rank === 'number' ? `#${rank}` : rank}
            </span>
          </div>
        )}

        {/* Tier Badge */}
        <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold ${tierInfo.className}`}>
          {tierInfo.label}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 rounded-full border border-[var(--border-default)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-strong border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-up">
              <div className="flex items-center justify-between p-3.5 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[var(--violet-light)] hover:underline flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-[var(--border-subtle)]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-left transition-colors ${
                        !n.read ? 'bg-[var(--violet)]/5' : 'hover:bg-[var(--bg-surface)]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${!n.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap pt-0.5">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1 break-words">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

