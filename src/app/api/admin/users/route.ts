import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createVolunteerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  telegramHandle: z.string().optional(),
  region: z.string().min(1, 'Please select a region'),
  role: z.string().min(1, 'Please select a role'),
})

export async function GET() {
  try {
    const session = await auth()
    const role = session?.user ? (session.user as Record<string, unknown>).role : null
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      where: { role: { not: 'ADMIN' } },
      select: {
        id: true,
        fullName: true,
        email: true,
        telegramHandle: true,
        region: true,
        role: true,
        tier: true,
        totalXp: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const sessionRole = session?.user ? (session.user as Record<string, unknown>).role : null
    if (sessionRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = createVolunteerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(validated.password, 12)

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        fullName: validated.fullName,
        telegramHandle: validated.telegramHandle || null,
        region: validated.region,
        role: validated.role,
        totalXp: 0,
        tier: 'BRONZE',
      },
    })

    const { passwordHash: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
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

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    const sessionRole = session?.user ? (session.user as Record<string, unknown>).role : null
    if (sessionRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { ids } = z.object({ ids: z.array(z.string()) }).parse(body)

    const sessionUserId = session?.user ? (session.user as any).id : null
    const idsToDelete = ids.filter((id) => id !== sessionUserId)

    if (idsToDelete.length === 0) {
      return NextResponse.json({ error: 'No valid user IDs to delete' }, { status: 400 })
    }

    await prisma.user.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    })

    return NextResponse.json({ message: 'Users deleted successfully' })
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
