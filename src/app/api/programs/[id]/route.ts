import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProgramSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  clientType: z.string().min(1).optional(),
  techStack: z.string().min(1).optional(),
  weeklyHours: z.coerce.number().min(1).optional(),
  maxTeamSize: z.coerce.number().min(1).optional(),
  status: z.enum(['RECRUITING', 'IN_PROGRESS', 'COMPLETED']).optional(),
})

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

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
    const validated = updateProgramSchema.parse(body)

    const program = await prisma.program.findUnique({
      where: { id },
    })

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    const updateData: any = { ...validated }

    if (validated.title && validated.title !== program.title) {
      let slug = slugify(validated.title)
      const existing = await prisma.program.findUnique({
        where: { slug },
      })
      if (existing && existing.id !== id) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`
      }
      updateData.slug = slug
    }

    if (validated.techStack) {
      updateData.techStack = JSON.stringify(
        validated.techStack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      )
    }

    const updated = await prisma.program.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
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

    const program = await prisma.program.findUnique({
      where: { id },
    })

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    await prisma.program.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Program deleted successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
