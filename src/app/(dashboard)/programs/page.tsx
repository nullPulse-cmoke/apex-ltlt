import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { parseTechStack, getStatusInfo } from '@/lib/utils'

export const metadata = { title: 'Programs' }

export default async function ProgramsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const programs = await prisma.program.findMany({
    include: {
      _count: {
        select: {
          applications: { where: { status: 'ACCEPTED' } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Client Programs</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Browse and apply for active client project sprints
          </p>
        </div>
      </div>

      {/* Programs Grid */}
      {programs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Filter className="h-10 w-10 mx-auto text-[var(--text-muted)] mb-3" />
            <p className="text-[var(--text-muted)]">No programs available yet</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Check back soon for new opportunities!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {programs.map((program) => {
            const techStack = parseTechStack(program.techStack)
            const statusInfo = getStatusInfo(program.status)
            return (
              <Link key={program.id} href={`/programs/${program.id}`}>
                <Card className="h-full group cursor-pointer hover:border-[var(--border-hover)]">
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-base group-hover:text-[var(--violet-light)] transition-colors">
                          {program.title}
                        </h3>
                        <Badge variant="default" className="mt-1">{program.clientType}</Badge>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                      {program.description}
                    </p>

                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {techStack.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="violet" className="text-[10px]">
                            {tech}
                          </Badge>
                        ))}
                        {techStack.length > 4 && (
                          <Badge variant="default" className="text-[10px]">+{techStack.length - 4}</Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                      <span>{program.weeklyHours}h/week</span>
                      <span>{program._count.applications}/{program.maxTeamSize} members</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
