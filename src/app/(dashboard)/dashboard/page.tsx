import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Zap, Hash, FolderKanban, CheckCircle, ArrowRight, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatXp, getTierInfo, getStatusInfo, getTierProgress, timeAgo } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      applications: {
        include: { program: true },
        orderBy: { appliedAt: 'desc' },
        take: 3,
      },
      _count: {
        select: {
          applications: { where: { status: 'ACCEPTED' } },
        },
      },
    },
  })

  if (!user) redirect('/login')

  let rank = 'N/A'
  if (user.totalXp > 0) {
    const usersAbove = await prisma.user.count({
      where: { totalXp: { gt: user.totalXp } },
    })
    rank = `#${usersAbove + 1}`
  }

  const deployedTasks = await prisma.xpLedger.count({
    where: { userId: user.id, category: 'WEBSITE_DEPLOY' },
  })

  const tierInfo = getTierInfo(user.tier)
  const tierProgress = getTierProgress(user.totalXp)

  const stats = [
    {
      label: 'Total XP',
      value: formatXp(user.totalXp),
      icon: Zap,
      color: 'var(--violet-light)',
      bg: 'var(--violet)',
    },
    {
      label: 'Global Rank',
      value: rank,
      icon: Hash,
      color: 'var(--cyan)',
      bg: 'var(--cyan)',
    },
    {
      label: 'Active Projects',
      value: user._count.applications.toString(),
      icon: FolderKanban,
      color: 'var(--orange)',
      bg: 'var(--orange)',
    },
    {
      label: 'Deployed Tasks',
      value: deployedTasks.toString(),
      icon: CheckCircle,
      color: 'var(--green)',
      bg: 'var(--green)',
    },
  ]

  const quickActions = [
    { label: 'Browse Programs', href: '/programs', icon: FolderKanban, desc: 'Find client projects to join' },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, desc: 'See where you rank' },
  ]

  const isTemporaryEmail = user.email.endsWith('@apex.uz') && !['admin@apex.uz', 'founder@apex.uz'].includes(user.email)

  return (
    <div className="max-w-6xl mx-auto space-y-6 stagger-children">
      {isTemporaryEmail && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-slide-up">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-amber-300">⚠️ Action Required: Setup Your Profile</span>
            <span>Your account is using a temporary email. Please update your personal email and Telegram username in your profile.</span>
          </div>
          <Link
            href="/profile"
            className="shrink-0 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold transition-colors text-center"
          >
            Setup Profile
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 gradient-border">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--violet)]/10 to-[var(--cyan)]/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Welcome back, <span className="gradient-text">{user.fullName.split(' ')[0]}</span>
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tierInfo.className}`}>
                {tierInfo.label}
              </span>
              {tierInfo.nextTier && (
                <span className="text-sm text-[var(--text-muted)]">
                  {tierInfo.nextThreshold! - user.totalXp} XP to {tierInfo.nextTier}
                </span>
              )}
            </div>
            {tierInfo.nextTier && (
              <div className="mt-3 w-64">
                <Progress value={tierProgress.current} max={tierProgress.max === tierProgress.current ? tierProgress.current : tierProgress.max - tierProgress.current + tierProgress.current} size="sm" />
              </div>
            )}
          </div>
          <div className="hidden md:block text-6xl animate-float">
            {user.tier === 'GOLD_LEAD' ? '🥇' : user.tier === 'SILVER' ? '🥈' : '🥉'}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in srgb, ${stat.bg} 15%, transparent)` }}
              >
                <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                <p className="text-2xl font-bold font-mono animate-count-up" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Applications</h3>
              <Link
                href="/applications"
                className="text-sm text-[var(--violet-light)] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <CardContent>
              {user.applications.length === 0 ? (
                <div className="text-center py-8">
                  <FolderKanban className="h-10 w-10 mx-auto text-[var(--text-muted)] mb-2" />
                  <p className="text-[var(--text-muted)]">No applications yet</p>
                  <Link
                    href="/programs"
                    className="text-sm text-[var(--violet-light)] hover:underline mt-1 inline-block"
                  >
                    Browse programs →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.applications.map((app) => {
                    const statusInfo = getStatusInfo(app.status)
                    return (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                      >
                        <div>
                          <p className="font-medium text-sm">{app.program.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">{timeAgo(app.appliedAt)}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="block">
              <Card className="group cursor-pointer hover:border-[var(--border-hover)]">
                <CardContent className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[var(--violet)]/10 flex items-center justify-center group-hover:bg-[var(--violet)]/20 transition-colors">
                    <action.icon className="h-5 w-5 text-[var(--violet-light)]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{action.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--violet-light)] group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
