import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const updateVolunteerSchema = z.object({
  fullName: z.string().min(3).optional(),
  email: z.string().email().optional(),
  telegramHandle: z.string().nullable().optional(),
  region: z.string().optional(),
  role: z.string().optional(),
  bio: z.string().nullable().optional(),
  password: z.string().min(6).optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    const sessionRole = session?.user ? (session.user as Record<string, unknown>).role : null
    if (sessionRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = updateVolunteerSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updateData: Record<string, any> = {
      fullName: validated.fullName,
      email: validated.email,
      telegramHandle: validated.telegramHandle,
      region: validated.region,
      role: validated.role,
      bio: validated.bio,
    }

    // Filter undefined keys
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key]
    })

    if (validated.password) {
      updateData.passwordHash = await bcrypt.hash(validated.password, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    // Notify user that their account was updated by an admin
    await prisma.notification.create({
      data: {
        userId: id,
        title: 'Account Managed by Admin',
        message: validated.password 
          ? 'Your account profile settings and password were updated by the administrator.'
          : 'Your account profile settings were updated by the administrator.',
      },
    })

    const { passwordHash, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    const sessionRole = session?.user ? (session.user as Record<string, unknown>).role : null
    if (sessionRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Avoid self-deletion
    if (session && session.user && id === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
