import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both passwords required' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const newHash = await bcrypt.hash(newPassword, 12)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { 
          passwordHash: newHash,
          passwordPlain: newPassword,
        },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Security Alert',
          message: 'Your account password was updated successfully.',
        },
      }),
    ])

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
  }
}
