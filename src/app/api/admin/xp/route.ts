import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateTier } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const session = await auth()
    const sessionRole = session?.user ? (session.user as Record<string, unknown>).role : null
    if (sessionRole !== 'ADMIN') {
      console.warn('[Admin Auth] Access forbidden on POST /api/admin/xp. sessionRole:', sessionRole, 'email:', session?.user?.email)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId, amount, category, reason } = await request.json()

    if (!userId || amount === undefined || !category || !reason) {
      return NextResponse.json(
        { error: 'userId, amount, category, and reason are required' },
        { status: 400 }
      )
    }

    const xpAmount = parseInt(amount)
    if (isNaN(xpAmount)) {
      return NextResponse.json({ error: 'Amount must be a number' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create ledger entry
      await tx.xpLedger.create({
        data: {
          userId,
          amount: xpAmount,
          reason,
          category,
        },
      })

      // Update user XP & Tier
      const newTotalXp = Math.max(0, user.totalXp + xpAmount)
      
      // Create notification
      await tx.notification.create({
        data: {
          userId,
          title: xpAmount >= 0 ? 'XP Awarded!' : 'XP Subtracted',
          message: xpAmount >= 0 
            ? `You have been awarded ${xpAmount} XP for "${reason}" (${category.replace('_', ' ')}).`
            : `Admin has subtracted ${Math.abs(xpAmount)} XP: "${reason}".`,
        },
      })

      return tx.user.update({
        where: { id: userId },
        data: {
          totalXp: newTotalXp,
          tier: calculateTier(newTotalXp),
        },
      })
    })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to allocate XP' }, { status: 500 })
  }
}
