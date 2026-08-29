import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Trophy } from 'lucide-react'
import { LeaderboardClient } from '@/components/leaderboard/leaderboard-client'

export const metadata = { title: 'Leaderboard' }

export default async function LeaderboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const users = await prisma.user.findMany({
    where: {
      totalXp: { gt: 0 },
      role: { not: 'ADMIN' },
    },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      role: true,
      tier: true,
      totalXp: true,
      bio: true,
      techStack: true,
      githubUrl: true,
      linkedinUrl: true,
      portfolioUrl: true,
      region: true,
      email: true,
      telegramHandle: true,
      lastLoginAt: true,
      _count: {
        select: {
          xpLedger: { where: { category: 'WEBSITE_DEPLOY' } },
        },
      },
    },
    orderBy: { totalXp: 'desc' },
    take: 50,
  })

  let currentRank = 1
  const rankedUsers = users.map((u, i) => {
    if (i > 0 && u.totalXp < users[i - 1].totalXp) {
      currentRank = i + 1
    }
    return {
      ...u,
      rank: currentRank,
      deployedTasks: u._count.xpLedger,
    }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-[var(--yellow)]" />
            Leaderboard
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Top contributors ranked by XP
          </p>
        </div>
      </div>

      <LeaderboardClient
        rankedUsers={rankedUsers}
        currentUserId={session.user.id}
      />
    </div>
  )
}
