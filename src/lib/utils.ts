import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatXp(xp: number): string {
  return xp.toLocaleString('en-US')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export type TierInfo = {
  label: string
  color: string
  className: string
  nextTier: string | null
  nextThreshold: number | null
}

export function getTierInfo(tier: string): TierInfo {
  const tiers: Record<string, TierInfo> = {
    BRONZE: {
      label: 'Bronze',
      color: '#cd7f32',
      className: 'tier-bronze',
      nextTier: 'Silver',
      nextThreshold: 200,
    },
    SILVER: {
      label: 'Silver',
      color: '#c0c0d2',
      className: 'tier-silver',
      nextTier: 'Gold Lead',
      nextThreshold: 500,
    },
    GOLD_LEAD: {
      label: 'Gold Lead',
      color: '#ffd700',
      className: 'tier-gold',
      nextTier: null,
      nextThreshold: null,
    },
  }
  return tiers[tier] || tiers.BRONZE
}

export function getStatusInfo(status: string): { label: string; className: string } {
  const statuses: Record<string, { label: string; className: string }> = {
    PENDING: { label: 'Pending', className: 'status-pending' },
    IN_REVIEW: { label: 'In Review', className: 'status-in-review' },
    ACCEPTED: { label: 'Accepted', className: 'status-accepted' },
    DECLINED: { label: 'Declined', className: 'status-declined' },
    RECRUITING: { label: 'Recruiting', className: 'status-recruiting' },
    IN_PROGRESS: { label: 'In Progress', className: 'status-in-progress' },
    COMPLETED: { label: 'Completed', className: 'status-completed' },
  }
  return statuses[status] || { label: status, className: 'status-pending' }
}

export function calculateTier(xp: number): string {
  if (xp >= 500) return 'GOLD_LEAD'
  if (xp >= 200) return 'SILVER'
  return 'BRONZE'
}

export function getTierProgress(xp: number): { current: number; max: number; percentage: number } {
  if (xp >= 500) return { current: xp - 500, max: 500, percentage: 100 }
  if (xp >= 200) return { current: xp - 200, max: 300, percentage: ((xp - 200) / 300) * 100 }
  return { current: xp, max: 200, percentage: (xp / 200) * 100 }
}

export function parseTechStack(techStack: string): string[] {
  try {
    return JSON.parse(techStack)
  } catch {
    return []
  }
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}
