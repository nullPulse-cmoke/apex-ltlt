import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        tier: true,
        totalXp: true,
        _count: {
          select: {
            xpLedger: { where: { category: 'WEBSITE_DEPLOY' } },
          },
        },
      },
      orderBy: { totalXp: 'desc' },
      skip,
      take: limit,
    })

    const total = await prisma.user.count()

    return NextResponse.json({
      users: users.map((u, i) => ({
        ...u,
        rank: skip + i + 1,
        deployedTasks: u._count.xpLedger,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
