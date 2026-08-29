import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const sendNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    const sessionRole = session?.user ? (session.user as Record<string, unknown>).role : null
    if (sessionRole !== 'ADMIN') {
      console.warn('[Admin Auth] Access forbidden on POST /api/admin/notifications. sessionRole:', sessionRole, 'email:', session?.user?.email)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = sendNotificationSchema.parse(body)

    if (validated.userId === 'ALL') {
      const volunteers = await prisma.user.findMany({
        where: { role: { not: 'ADMIN' } },
        select: { id: true },
      })

      await prisma.notification.createMany({
        data: volunteers.map((u) => ({
          userId: u.id,
          title: validated.title,
          message: validated.message,
          read: false,
        })),
      })

      return NextResponse.json({ success: true, count: volunteers.length }, { status: 201 })
    }

    const notification = await prisma.notification.create({
      data: {
        userId: validated.userId,
        title: validated.title,
        message: validated.message,
        read: false,
      },
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
