'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Save, Shield, User, Globe, AtSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getTierInfo, parseTechStack, formatXp } from '@/lib/utils'
import { REGIONS, ROLES } from '@/lib/constants'

interface ProfileFormProps {
  user: {
    id: string
    fullName: string
    email: string
    telegramHandle: string | null
    region: string
    role: string
    tier: string
    totalXp: number
    avatarUrl: string | null
    bio: string | null
    techStack: string
    githubUrl: string | null
    linkedinUrl: string | null
    portfolioUrl: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      telegramHandle: user.telegramHandle || '',
      region: user.region,
      role: user.role,
      bio: user.bio || '',
      techStack: parseTechStack(user.techStack).join(', '),
      githubUrl: user.githubUrl || '',
      linkedinUrl: user.linkedinUrl || '',
      portfolioUrl: user.portfolioUrl || '',
    },
  })

  const isTemporaryEmail = user.email.endsWith('@apex.uz') && !['admin@apex.uz', 'founder@apex.uz'].includes(user.email)

  const {
    register: registerSecurity,
    handleSubmit: handleSubmitSecurity,
    reset: resetSecurity,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSaveProfile = async (data: Record<string, string>) => {
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const techStackArray = data.techStack
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          techStack: JSON.stringify(techStackArray),
        }),
      })

      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to save')
      } else {
        setMessage('Profile updated successfully')
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setSaving(false)
  }

  const onChangePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    setSaving(true)
    setMessage('')
    setError('')

    if (data.newPassword !== data.confirmPassword) {
      setError('New passwords do not match')
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to change password')
      } else {
        setMessage('Password changed successfully')
        resetSecurity()
      }
    } catch {
      setError('Something went wrong')
    }
    setSaving(false)
  }

  const tierInfo = getTierInfo(user.tier)
  const techStack = parseTechStack(user.techStack)

  return (
    <div className="space-y-6">
      {/* User Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--violet)]/10 to-transparent" />
        <CardContent className="relative flex items-center gap-4">
          <Avatar name={user.fullName} src={user.avatarUrl} size="xl" />
          <div>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tierInfo.className}`}>
                {tierInfo.label}
              </span>
              <Badge variant="violet" className="font-mono">{formatXp(user.totalXp)} XP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg-surface)] w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-[var(--violet)]/20 text-[var(--violet-light)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <User className="h-4 w-4 inline mr-1.5" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'security'
              ? 'bg-[var(--violet)]/20 text-[var(--violet-light)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-1.5" />
          Security
        </button>
      </div>

      {/* Temporary Email Notice */}
      {isTemporaryEmail && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex flex-col gap-2 shadow-sm animate-slide-up">
          <span className="font-bold text-amber-300">⚠️ Действие требуется: Настройка нового аккаунта</span>
          <p>
            Вы вошли под временным адресом электронной почты <strong>{user.email}</strong>. 
            Пожалуйста, укажите ваш <strong>реальный рабочий email</strong> и имя пользователя <strong>Telegram</strong> (например, @username) в полях ниже и сохраните профиль. 
            Также рекомендуем перейти во вкладку <strong>Security</strong> и установить свой личный надежный пароль.
          </p>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className="p-3 rounded-lg bg-[var(--green)]/10 border border-[var(--green)]/20 text-[var(--green)] text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-[var(--red)]/10 border border-[var(--red)]/20 text-[var(--red)] text-sm">
          {error}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input id="profile-name" label="Full Name" disabled {...register('fullName')} />
                <Input
                  id="profile-email"
                  label="Email Address (Required)"
                  required
                  type="email"
                  {...register('email')}
                />
                <Input
                  id="profile-telegram"
                  label="Telegram Handle (Required)"
                  required
                  icon={<AtSign className="h-4 w-4" />}
                  {...register('telegramHandle', { required: true })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  id="profile-region"
                  label="Region"
                  options={[...REGIONS]}
                  {...register('region')}
                />
                <Select
                  id="profile-role"
                  label="Primary Role"
                  options={[...ROLES]}
                  {...register('role')}
                />
              </div>

              <Textarea
                id="profile-bio"
                label="Bio"
                placeholder="Tell others about yourself..."
                {...register('bio')}
              />

              <Input
                id="profile-techstack"
                label="Tech Stack (comma-separated)"
                placeholder="React, TypeScript, Node.js, PostgreSQL"
                {...register('techStack')}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  id="profile-github"
                  label="GitHub URL"
                  icon={<Globe className="h-4 w-4" />}
                  {...register('githubUrl')}
                />
                <Input
                  id="profile-linkedin"
                  label="LinkedIn URL"
                  icon={<Globe className="h-4 w-4" />}
                  {...register('linkedinUrl')}
                />
                <Input
                  id="profile-portfolio"
                  label="Portfolio URL"
                  icon={<Globe className="h-4 w-4" />}
                  {...register('portfolioUrl')}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" loading={saving}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleSubmitSecurity(onChangePassword)} className="space-y-4 max-w-md">
              <Input
                id="security-current"
                type="password"
                label="Current Password"
                {...registerSecurity('currentPassword')}
              />
              <Input
                id="security-new"
                type="password"
                label="New Password"
                {...registerSecurity('newPassword')}
              />
              <Input
                id="security-confirm"
                type="password"
                label="Confirm New Password"
                {...registerSecurity('confirmPassword')}
              />
              <Button type="submit" loading={saving}>
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
