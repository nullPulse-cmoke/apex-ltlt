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

export function timeAgo(date: string | Date | null): string {
  if (!date) return 'Never'
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export type RoleInfo = {
  label: string
  className: string
  icon: string
}

export function getRoleInfo(role: string): RoleInfo {
  const roles: Record<string, RoleInfo> = {
    ADMIN: { label: 'Administrator', className: 'bg-red-500/10 text-red-400 border border-red-500/20', icon: '👑' },
    FRONTEND: { label: 'Frontend Developer', className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', icon: '💻' },
    BACKEND: { label: 'Backend Developer', className: 'bg-green-500/10 text-green-400 border border-green-500/20', icon: '⚙️' },
    FULLSTACK: { label: 'Full-Stack Developer', className: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', icon: '🚀' },
    DESIGNER: { label: 'UI/UX Designer', className: 'bg-pink-500/10 text-pink-400 border border-pink-500/20', icon: '🎨' },
    MOBILE: { label: 'Mobile Developer', className: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20', icon: '📱' },
    DEVOPS: { label: 'DevOps Engineer', className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20', icon: '🛡️' },
    PM: { label: 'Project Manager', className: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20', icon: '📊' },
    QA: { label: 'QA Engineer', className: 'bg-teal-500/10 text-teal-400 border border-teal-500/20', icon: '🔍' },
    AI_ML: { label: 'AI/ML Engineer', className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20', icon: '🧠' },
    DATA_ANALYST: { label: 'Data Analyst', className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: '📈' },
    CYBERSECURITY: { label: 'Cybersecurity Specialist', className: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', icon: '🕵️' },
    MARKETING: { label: 'Marketing Specialist', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: '📢' },
  }
  return roles[role.toUpperCase()] || { label: role, className: 'bg-gray-500/10 text-gray-400 border border-gray-500/20', icon: '👤' }
}
