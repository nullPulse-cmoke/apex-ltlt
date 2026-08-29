import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    const sessionRole = session?.user ? (session.user as Record<string, unknown>).role : null
    if (sessionRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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

    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    const sessionRole = session?.user ? (session.user as Record<string, unknown>).role : null
    if (sessionRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, status, feedback, telegramGroupLink } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 })
    }

    if (!['ACCEPTED', 'DECLINED', 'IN_REVIEW', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const application = await prisma.application.update({
      where: { id },
      data: {
        status,
        feedback: status === 'DECLINED' ? feedback || null : null,
        telegramGroupLink: status === 'ACCEPTED' ? telegramGroupLink || null : null,
        reviewedAt: new Date(),
      },
      include: {
        program: {
          select: { title: true },
        },
      },
    })

    // Create notification for the volunteer
    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: status === 'ACCEPTED' ? 'Application Accepted!' : 'Application Declined',
        message: status === 'ACCEPTED'
          ? `Your application for "${application.program.title}" has been accepted! Please join the onboarding group: ${telegramGroupLink || 'No link'}.`
          : `Your application for "${application.program.title}" was declined. Feedback: ${feedback || 'None'}.`,
      },
    })

    return NextResponse.json(application)
  } catch {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}
