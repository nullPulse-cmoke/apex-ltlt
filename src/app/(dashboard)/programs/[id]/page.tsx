import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { parseTechStack, getStatusInfo, timeAgo } from '@/lib/utils'
import { ApplyButton } from '@/components/programs/apply-button'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const program = await prisma.program.findUnique({ where: { id } })
  return { title: program?.title || 'Program Details' }
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      applications: {
        where: { status: 'ACCEPTED' },
        include: {
          user: {
            select: { id: true, fullName: true, avatarUrl: true, role: true },
          },
        },
      },
    },
  })

  if (!program) notFound()

  const userApplication = await prisma.application.findUnique({
    where: {
      userId_programId: {
        userId: session.user.id,
        programId: program.id,
      },
    },
  })

  const techStack = parseTechStack(program.techStack)
  const statusInfo = getStatusInfo(program.status)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/programs"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Programs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{program.title}</h2>
                  <Badge variant="default" className="mt-2">{program.clientType}</Badge>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
              </div>

              <p className="text-[var(--text-secondary)] leading-relaxed">{program.description}</p>

              {techStack.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--text-muted)] mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <Badge key={tech} variant="violet">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Weekly Hours</p>
                    <p className="text-sm font-medium">{program.weeklyHours}h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Team Size</p>
                    <p className="text-sm font-medium">{program.applications.length}/{program.maxTeamSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Created</p>
                    <p className="text-sm font-medium">{timeAgo(program.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Roster */}
          {program.applications.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>
              <CardContent>
                <div className="space-y-3">
                  {program.applications.map((app) => (
                    <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-surface)]">
                      <Avatar name={app.user.fullName} src={app.user.avatarUrl} size="sm" />
                      <div>
                        <p className="text-sm font-medium">{app.user.fullName}</p>
                        <p className="text-xs text-[var(--text-muted)]">{app.user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent>
              <ApplyButton
                programId={program.id}
                programTitle={program.title}
                hasApplied={!!userApplication}
              />
              {userApplication && (
                <div className="mt-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusInfo(userApplication.status).className}`}>
                    Status: {getStatusInfo(userApplication.status).label}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
