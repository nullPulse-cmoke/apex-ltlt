import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const createProgramSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  clientType: z.string().min(1, 'Client type is required'),
  techStack: z.string().min(1, 'Tech stack is required'),
  weeklyHours: z.coerce.number().min(1, 'Weekly hours must be at least 1'),
  maxTeamSize: z.coerce.number().min(1, 'Max team size must be at least 1'),
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const status = searchParams.get('status') || ''

    const programs = await prisma.program.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { title: { contains: query } },
                  { description: { contains: query } },
                ],
              }
            : {},
          status ? { status } : {},
        ],
      },
      include: {
        _count: {
          select: {
            applications: { where: { status: 'ACCEPTED' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(programs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
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
    const validated = createProgramSchema.parse(body)

    let slug = slugify(validated.title)
    const existing = await prisma.program.findUnique({
      where: { slug },
    })

    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`
    }

    const techStackArray = validated.techStack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const program = await prisma.program.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        clientType: validated.clientType,
        techStack: JSON.stringify(techStackArray),
        weeklyHours: validated.weeklyHours,
        maxTeamSize: validated.maxTeamSize,
        status: 'RECRUITING',
      },
    })

    return NextResponse.json(program, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      console.error('[API Programs POST ZodError]', error)
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

    await prisma.program.deleteMany({
      where: {
        id: { in: ids },
      },
    })

    return NextResponse.json({ message: 'Programs deleted successfully' })
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
