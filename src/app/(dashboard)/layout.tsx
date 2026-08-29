import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayoutClient } from '@/components/layout/dashboard-layout-client'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    redirect('/login')
  }

  // Get user rank
  let rank: number | string = 'N/A'
  if (user.totalXp > 0) {
    const usersAbove = await prisma.user.count({
      where: { totalXp: { gt: user.totalXp } },
    })
    rank = usersAbove + 1
  }

  const sidebarUser = {
    fullName: user.fullName,
    email: user.email,
    tier: user.tier,
    totalXp: user.totalXp,
    avatarUrl: user.avatarUrl,
    role: user.role,
  }

  const topbarUser = {
    totalXp: user.totalXp,
    tier: user.tier,
  }

  return (
    <DashboardLayoutClient
      sidebarUser={sidebarUser}
      topbarUser={topbarUser}
      rank={rank}
    >
      {children}
    </DashboardLayoutClient>
  )
}
