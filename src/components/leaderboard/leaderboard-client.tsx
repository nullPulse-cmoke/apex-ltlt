'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatXp, getTierInfo, getTierProgress, parseTechStack, timeAgo, getRoleInfo } from '@/lib/utils'
import { Trophy, Zap, Globe, X, MapPin, User, MessageSquare } from 'lucide-react'
import { XP_RULES } from '@/lib/constants'

interface LeaderboardUser {
  id: string
  fullName: string
  avatarUrl: string | null
  role: string
  tier: string
  totalXp: number
  bio: string | null
  techStack: string
  githubUrl: string | null
  linkedinUrl: string | null
  portfolioUrl: string | null
  region: string
  email: string
  telegramHandle: string | null
  lastLoginAt: string | Date | null
  rank: number
  deployedTasks: number
}

interface LeaderboardClientProps {
  rankedUsers: LeaderboardUser[]
  currentUserId: string
}

export function LeaderboardClient({ rankedUsers, currentUserId }: LeaderboardClientProps) {
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  // If all users have the same XP, we do not show a podium (so everyone is displayed equally in the table).
  const allEqual = rankedUsers.length > 0 && rankedUsers.every(u => u.totalXp === rankedUsers[0].totalXp)

  const top3 = allEqual ? [] : rankedUsers.slice(0, 3)
  const rest = allEqual ? rankedUsers : rankedUsers.slice(3)

  const podiumColors = [
    { bg: 'from-yellow-500/20 to-yellow-600/5', border: 'border-yellow-500/30', glow: '0 0 30px rgba(255,215,0,0.2)', label: '🥇' },
    { bg: 'from-gray-300/15 to-gray-400/5', border: 'border-gray-400/30', glow: '0 0 20px rgba(192,192,192,0.15)', label: '🥈' },
    { bg: 'from-amber-700/15 to-amber-800/5', border: 'border-amber-700/30', glow: '0 0 20px rgba(205,127,50,0.15)', label: '🥉' },
  ]

  const handleCopyTelegram = async (handle: string) => {
    try {
      await navigator.clipboard.writeText(handle)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {allEqual && (
          <div className="p-4 rounded-xl bg-[var(--violet)]/10 border border-[var(--violet)]/20 text-[var(--violet-light)] text-sm flex items-center gap-3">
            <Trophy className="h-5 w-5 text-[var(--yellow)] shrink-0 animate-bounce" />
            <div>
              <span className="font-bold">All volunteers are tied!</span> At the start of the season, all participants have an equal amount of XP and share the <strong className="text-[var(--yellow)]">1st place</strong> on the leaderboard.
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3.map((user, idx) => {
              const tierInfo = getTierInfo(user.tier)
              const config = podiumColors[idx]
              return (
                <Card
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`text-center relative overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 ${config.border}`}
                  style={{ boxShadow: config.glow }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${config.bg}`} />
                  <CardContent className="relative py-6">
                    <div className="text-3xl mb-3">{config.label}</div>
                    <Avatar
                      name={user.fullName}
                      src={user.avatarUrl}
                      size="lg"
                      className={`mx-auto mb-3 ${idx === 0 ? 'ring-yellow-500/50' : idx === 1 ? 'ring-gray-400/50' : 'ring-amber-700/50'}`}
                    />
                    <p className="font-semibold text-sm">{user.fullName}</p>
                    <div className="my-2 flex justify-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getRoleInfo(user.role).className}`}>
                        <span>{getRoleInfo(user.role).icon}</span>
                        <span>{getRoleInfo(user.role).label}</span>
                      </span>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${tierInfo.className}`}>
                      {tierInfo.label}
                    </span>
                    <p className="text-xl font-bold font-mono mt-3 text-[var(--violet-light)]">
                      {formatXp(user.totalXp)} XP
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Rankings Table */}
        {rest.length > 0 && (
          <Card>
            <CardContent>
              <div className="space-y-1">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-[var(--text-muted)] font-medium border-b border-[var(--border-subtle)]">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Contributor</div>
                  <div className="col-span-3">Role</div>
                  <div className="col-span-1 text-right">Deployed</div>
                  <div className="col-span-2 text-right">XP</div>
                </div>

                {rest.map((user) => {
                  const isCurrentUser = user.id === currentUserId
                  const tierInfo = getTierInfo(user.tier)
                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                        isCurrentUser
                          ? 'bg-[var(--violet)]/10 border border-[var(--violet)]/20 hover:bg-[var(--violet)]/15'
                          : 'hover:bg-[var(--bg-surface)]'
                      }`}
                    >
                      <div className="col-span-1 text-sm font-mono text-[var(--text-muted)]">
                        {user.rank}
                      </div>
                      <div className="col-span-5 flex items-center gap-2.5">
                        <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
                        <div>
                          <p className="text-sm font-medium">
                            {user.fullName}
                            {isCurrentUser && (
                              <span className="ml-1.5 text-[10px] text-[var(--violet-light)]">(You)</span>
                            )}
                          </p>
                          <span className={`px-1.5 py-0 rounded-full text-[9px] font-medium ${tierInfo.className}`}>
                            {tierInfo.label}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getRoleInfo(user.role).className}`}>
                          <span>{getRoleInfo(user.role).icon}</span>
                          <span>{getRoleInfo(user.role).label}</span>
                        </span>
                      </div>
                      <div className="col-span-1 text-right text-sm font-mono text-[var(--text-secondary)]">
                        {user.deployedTasks}
                      </div>
                      <div className="col-span-2 text-right text-sm font-bold font-mono text-[var(--violet-light)]">
                        {formatXp(user.totalXp)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {rankedUsers.length === 0 && (
          <Card className="text-center py-16 border border-[var(--border-subtle)] bg-[var(--bg-card)]/50">
            <CardContent className="space-y-3">
              <div className="h-16 w-16 mx-auto rounded-full bg-[var(--bg-surface)] flex items-center justify-center border border-[var(--border-subtle)]">
                <Trophy className="h-8 w-8 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="font-semibold text-lg text-[var(--text-primary)]">No contributors active yet</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
                  Nobody has earned any XP in this sprint yet. Complete client projects, contribute features, and be the first to climb the podium!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* XP Rules Sidebar */}
      <div>
        <Card className="sticky top-24">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[var(--violet-light)]" />
            XP Earning Rules
          </h3>
          <CardContent>
            <div className="space-y-3">
              {XP_RULES.map((rule) => (
                <div key={rule.category} className="flex items-center gap-3">
                  <span className="text-lg">{rule.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{rule.label}</p>
                  </div>
                  <Badge variant="violet" className="font-mono text-xs">
                    +{rule.xp}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volunteer Profile Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative z-10 w-full max-w-md mx-4 glass-strong rounded-2xl p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header info */}
            <div className="text-center pb-4 border-b border-[var(--border-subtle)]">
              <Avatar
                name={selectedUser.fullName}
                src={selectedUser.avatarUrl}
                size="lg"
                className="mx-auto mb-3"
              />
              <h3 className="text-lg font-bold flex items-center justify-center gap-1.5">
                {selectedUser.fullName}
                {selectedUser.id === currentUserId && (
                  <span className="text-[10px] bg-[var(--violet)]/20 text-[var(--violet-light)] px-1.5 py-0.5 rounded-full">You</span>
                )}
              </h3>
              <div className="flex justify-center mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getRoleInfo(selectedUser.role).className}`}>
                  <span>{getRoleInfo(selectedUser.role).icon}</span>
                  <span>{getRoleInfo(selectedUser.role).label}</span>
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                  {selectedUser.region.charAt(0) + selectedUser.region.slice(1).toLowerCase()}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)]" />
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                  Active {selectedUser.lastLoginAt ? timeAgo(selectedUser.lastLoginAt) : 'Never'}
                </span>
              </div>
            </div>

            {/* XP Progress Section */}
            <div className="py-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[var(--violet-light)] flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  {getTierInfo(selectedUser.tier).label}
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {formatXp(selectedUser.totalXp)} XP
                </span>
              </div>
              {(() => {
                const progress = getTierProgress(selectedUser.totalXp)
                const tierInfo = getTierInfo(selectedUser.tier)
                return (
                  <div className="space-y-1">
                    <Progress value={progress.percentage} className="h-2" />
                    {tierInfo.nextTier && (
                      <p className="text-[10px] text-right text-[var(--text-secondary)]">
                        {formatXp(progress.max - progress.current)} XP to {tierInfo.nextTier}
                      </p>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Bio Section */}
            <div className="py-4 border-b border-[var(--border-subtle)] space-y-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Biography</h4>
              <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
                {selectedUser.bio ? `"${selectedUser.bio}"` : 'No biography provided.'}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="py-4 border-b border-[var(--border-subtle)] space-y-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {parseTechStack(selectedUser.techStack).length > 0 ? (
                  parseTechStack(selectedUser.techStack).map((tech) => (
                    <Badge key={tech} variant="default" className="text-xs">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-[var(--text-muted)] italic">No skills configured.</span>
                )}
              </div>
            </div>

            {/* Socials & Contact */}
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Contact & Links</h4>
              
              <div className="flex items-center justify-between gap-3 text-sm">
                {selectedUser.telegramHandle ? (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[var(--violet-light)]" />
                    <button
                      onClick={() => handleCopyTelegram(selectedUser.telegramHandle || '')}
                      className="hover:underline text-[var(--text-secondary)] text-left hover:text-[var(--text-primary)] font-mono text-xs"
                    >
                      {selectedUser.telegramHandle}
                    </button>
                    {copySuccess && (
                      <span className="text-[10px] text-[var(--green)] animate-fade-in font-medium">Copied!</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-[var(--text-muted)] italic">No Telegram handle provided.</span>
                )}

                <div className="flex gap-2">
                  {selectedUser.githubUrl && (
                    <a
                      href={selectedUser.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      title="GitHub Profile"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                    </a>
                  )}
                  {selectedUser.linkedinUrl && (
                    <a
                      href={selectedUser.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      title="LinkedIn Profile"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  {selectedUser.portfolioUrl && (
                    <a
                      href={selectedUser.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      title="Portfolio Website"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
