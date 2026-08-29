import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      include: { program: true },
      orderBy: { appliedAt: 'desc' },
    })

    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { programId, coverLetter } = await request.json()

    if (!programId) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 })
    }

    // Check for existing application
    const existing = await prisma.application.findUnique({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'You have already applied to this program' }, { status: 409 })
    }

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        programId,
        coverLetter: coverLetter || null,
      },
      include: { program: true },
    })

    return NextResponse.json(application, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
