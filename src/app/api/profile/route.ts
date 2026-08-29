import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const allowedFields = [
      'telegramHandle', 'region', 'role',
      'bio', 'techStack', 'githubUrl', 'linkedinUrl', 'portfolioUrl',
    ]

    const updateData: Record<string, string> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (body.email) {
      const email = body.email.trim().toLowerCase()
      if (!email.includes('@') || !email.includes('.')) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
      }
      // Check if email is taken
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json({ error: 'Email address is already in use' }, { status: 400 })
      }
      updateData.email = email
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
