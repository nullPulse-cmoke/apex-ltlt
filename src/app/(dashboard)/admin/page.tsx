import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminPanelClient } from '@/components/admin/admin-panel-client'

export const metadata = { title: 'Admin Control Center' }

export default async function AdminPage() {
  const session = await auth()
  const role = session?.user ? (session.user as Record<string, unknown>).role : null

  if (role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Fetch all volunteers (exclude administrators)
  const volunteers = await prisma.user.findMany({
    where: { role: { not: 'ADMIN' } },
    select: {
      id: true,
      fullName: true,
      email: true,
      passwordPlain: true,
      telegramHandle: true,
      region: true,
      role: true,
      tier: true,
      totalXp: true,
      bio: true,
      lastLoginAt: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: { fullName: 'asc' },
  })

  // Fetch all applications
  const applications = await prisma.application.findMany({
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
      program: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { appliedAt: 'desc' },
  })



  // Fetch all programs
  const programs = await prisma.program.findMany({
    include: {
      _count: {
        select: {
          applications: { where: { status: 'ACCEPTED' } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })



  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Control Center</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Manage volunteer accounts, client programs, project applications, XP allocation, and reward claims.
        </p>
      </div>

      <AdminPanelClient
        initialVolunteers={volunteers}
        initialApplications={applications}
        initialPrograms={programs}
      />
    </div>
  )
}
