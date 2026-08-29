import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, FolderKanban, ExternalLink, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getStatusInfo, timeAgo } from '@/lib/utils'

export const metadata = { title: 'Applications' }

export default async function ApplicationsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: { program: true },
    orderBy: { appliedAt: 'desc' },
  })

  const grouped = {
    PENDING: applications.filter((a) => a.status === 'PENDING'),
    IN_REVIEW: applications.filter((a) => a.status === 'IN_REVIEW'),
    ACCEPTED: applications.filter((a) => a.status === 'ACCEPTED'),
    DECLINED: applications.filter((a) => a.status === 'DECLINED'),
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Applications</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Track your project sprint applications
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto text-[var(--text-muted)] mb-3" />
            <p className="text-lg font-medium text-[var(--text-muted)]">No applications yet</p>
            <p className="text-sm text-[var(--text-muted)] mt-1 mb-4">
              Start by browsing available programs and applying
            </p>
            <Link href="/programs">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--violet)]/15 text-[var(--violet-light)] text-sm font-medium hover:bg-[var(--violet)]/25 transition-colors cursor-pointer">
                <FolderKanban className="h-4 w-4" />
                Browse Programs
              </span>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 stagger-children">
          {/* Pipeline Status Indicators */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { status: 'PENDING', count: grouped.PENDING.length },
              { status: 'IN_REVIEW', count: grouped.IN_REVIEW.length },
              { status: 'ACCEPTED', count: grouped.ACCEPTED.length },
              { status: 'DECLINED', count: grouped.DECLINED.length },
            ].map((item) => {
              const info = getStatusInfo(item.status)
              return (
                <div
                  key={item.status}
                  className={`p-3 rounded-lg text-center ${info.className}`}
                >
                  <p className="text-2xl font-bold font-mono">{item.count}</p>
                  <p className="text-xs mt-1">{info.label}</p>
                </div>
              )
            })}
          </div>

          {/* Application Cards */}
          <div className="space-y-3">
            {applications.map((app) => {
              const statusInfo = getStatusInfo(app.status)
              return (
                <Card key={app.id}>
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            href={`/programs/${app.programId}`}
                            className="font-semibold hover:text-[var(--violet-light)] transition-colors"
                          >
                            {app.program.title}
                          </Link>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--text-muted)]">
                          Applied {timeAgo(app.appliedAt)}
                          {app.reviewedAt && ` • Reviewed ${timeAgo(app.reviewedAt)}`}
                        </p>

                        {app.coverLetter && (
                          <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
                            {app.coverLetter}
                          </p>
                        )}

                        {/* Accepted: Show Telegram link */}
                        {app.status === 'ACCEPTED' && app.telegramGroupLink && (
                          <div className="mt-3 p-3 rounded-lg bg-[var(--green)]/10 border border-[var(--green)]/20">
                            <p className="text-sm text-[var(--green)] font-medium flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              <a
                                href={app.telegramGroupLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                Join Telegram Group →
                              </a>
                            </p>
                          </div>
                        )}

                        {app.status === 'ACCEPTED' && !app.telegramGroupLink && (
                          <div className="mt-3 p-3 rounded-lg bg-[var(--green)]/10 border border-[var(--green)]/20">
                            <p className="text-sm text-[var(--green)]">
                              🎉 Congratulations! You&apos;ve been accepted. The team lead will reach out soon.
                            </p>
                          </div>
                        )}

                        {/* Declined: Show feedback */}
                        {app.status === 'DECLINED' && app.feedback && (
                          <div className="mt-3 p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                            <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              Feedback
                            </p>
                            <p className="text-sm text-[var(--text-secondary)]">{app.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
