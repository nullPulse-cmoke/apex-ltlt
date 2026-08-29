'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  Users,
  FileText,
  Plus,
  Zap,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  FolderKanban,
  Pencil,
  Trash2,
  Bell,
  Settings,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { formatXp, getTierInfo, getStatusInfo, timeAgo, getRoleInfo } from '@/lib/utils'
import { REGIONS, ROLES, XP_RULES } from '@/lib/constants'

interface Volunteer {
  id: string
  fullName: string
  email: string
  telegramHandle: string | null
  region: string
  role: string
  tier: string
  totalXp: number
  bio: string | null
  lastLoginAt?: string | Date | null
  _count: {
    applications: number
  }
}

interface Application {
  id: string
  userId: string
  programId: string
  status: string
  coverLetter: string | null
  feedback: string | null
  telegramGroupLink: string | null
  appliedAt: string | Date
  user: {
    fullName: string
    email: string
    avatarUrl: string | null
  }
  program: {
    title: string
  }
}

interface Program {
  id: string
  title: string
  slug: string
  description: string
  clientType: string
  techStack: string
  weeklyHours: number
  status: string
  maxTeamSize: number
  createdAt: string | Date
  _count: {
    applications: number
  }
}

interface CustomCheckboxProps {
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function CustomCheckbox({ id, checked, onChange }: CustomCheckboxProps) {
  return (
    <div className="checkbox-wrapper-30 shrink-0 flex items-center" style={{ '--size': '0.8' } as any}>
      <span className="checkbox">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <svg>
          <use href="#checkbox-30" className="checkbox" />
        </svg>
      </span>
    </div>
  )
}

interface AdminPanelClientProps {
  initialVolunteers: Volunteer[]
  initialApplications: Application[]
  initialPrograms: Program[]
}

export function AdminPanelClient({
  initialVolunteers,
  initialApplications,
  initialPrograms,
}: AdminPanelClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'volunteers' | 'applications' | 'programs'>('volunteers')

  // Modals & triggers
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [xpModalOpen, setXpModalOpen] = useState(false)
  const [appModalOpen, setAppModalOpen] = useState(false)
  const [programModalOpen, setProgramModalOpen] = useState(false)
  const [editProgramModalOpen, setEditProgramModalOpen] = useState(false)
  const [notifyModalOpen, setNotifyModalOpen] = useState(false)
  const [manageModalOpen, setManageModalOpen] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [appActionType, setAppActionType] = useState<'ACCEPT' | 'DECLINE' | null>(null)
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([])
  const [selectedVolunteerIds, setSelectedVolunteerIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedProgramIds([])
    setSelectedVolunteerIds([])
  }, [activeTab])

  // Form states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Create Volunteer Form
  const { register: regUser, handleSubmit: handleUserSubmit, reset: resetUser } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      telegramHandle: '',
      region: '',
      role: '',
    },
  })

  // Create Program Form
  const { register: regProgram, handleSubmit: handleProgramSubmit, reset: resetProgram } = useForm({
    defaultValues: {
      title: '',
      description: '',
      clientType: 'RESTAURANT',
      techStack: '',
      weeklyHours: 10,
      maxTeamSize: 4,
    },
  })

  // Edit Program Form
  const { register: regEditProgram, handleSubmit: handleEditProgramSubmit, reset: resetEditProgram } = useForm({
    defaultValues: {
      title: '',
      description: '',
      clientType: 'RESTAURANT',
      techStack: '',
      weeklyHours: 10,
      maxTeamSize: 4,
      status: 'RECRUITING',
    },
  })



  // Send Custom Notification Form
  const { register: regNotify, handleSubmit: handleNotifySubmit, reset: resetNotify } = useForm({
    defaultValues: {
      title: 'Announcement',
      message: '',
    },
  })

  // Manage Volunteer Form
  const { register: regManage, handleSubmit: handleManageSubmit, reset: resetManage } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      telegramHandle: '',
      region: 'TASHKENT',
      role: 'FRONTEND',
      bio: '',
      password: '',
    },
  })

  // Grant XP Form
  const { register: regXp, handleSubmit: handleXpSubmit, reset: resetXp } = useForm({
    defaultValues: {
      amount: 50,
      category: 'WEBSITE_DEPLOY',
      reason: '',
    },
  })

  // Application Action Forms
  const [telegramGroupLink, setTelegramGroupLink] = useState('')
  const [declineFeedback, setDeclineFeedback] = useState('')

  const onCreateUser = async (data: Record<string, string>) => {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to create account')
      } else {
        setMessage('Volunteer account created successfully')
        resetUser()
        setUserModalOpen(false)
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const onCreateProgram = async (data: any) => {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          weeklyHours: parseInt(data.weeklyHours),
          maxTeamSize: parseInt(data.maxTeamSize),
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        if (body.details && body.details.issues) {
          const errMsgs = body.details.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ')
          setError(`Validation failed: ${errMsgs}`)
        } else {
          setError(body.error || 'Failed to create program')
        }
      } else {
        setMessage('Client program sprint published successfully')
        resetProgram()
        setProgramModalOpen(false)
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const openEditModal = (prog: Program) => {
    setError('')
    setSelectedProgram(prog)
    let parsedTech = ''
    try {
      parsedTech = JSON.parse(prog.techStack).join(', ')
    } catch {
      parsedTech = prog.techStack
    }
    resetEditProgram({
      title: prog.title,
      description: prog.description,
      clientType: prog.clientType,
      techStack: parsedTech,
      weeklyHours: prog.weeklyHours,
      maxTeamSize: prog.maxTeamSize,
      status: prog.status,
    })
    setEditProgramModalOpen(true)
  }

  const onEditProgram = async (data: any) => {
    if (!selectedProgram) return
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`/api/programs/${selectedProgram.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          weeklyHours: parseInt(data.weeklyHours),
          maxTeamSize: parseInt(data.maxTeamSize),
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        if (body.details && body.details.issues) {
          const errMsgs = body.details.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ')
          setError(`Validation failed: ${errMsgs}`)
        } else {
          setError(body.error || 'Failed to update program')
        }
      } else {
        setMessage('Client program updated successfully')
        setEditProgramModalOpen(false)
        setSelectedProgram(null)
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const onDeleteProgram = async (programId: string, programTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${programTitle}"? This will permanently delete the program and all of its volunteer applications.`)) {
      return
    }
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`/api/programs/${programId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to delete program')
      } else {
        setMessage('Client program deleted successfully')
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const onBulkDeletePrograms = async () => {
    if (selectedProgramIds.length === 0) return
    if (!window.confirm(`Are you sure you want to delete the ${selectedProgramIds.length} selected programs? This will permanently delete them and all of their applications.`)) {
      return
    }
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/programs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedProgramIds }),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to delete programs')
      } else {
        setMessage('Selected client programs deleted successfully')
        setSelectedProgramIds([])
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const onBulkDeleteVolunteers = async () => {
    if (selectedVolunteerIds.length === 0) return
    if (!window.confirm(`Are you sure you want to delete the ${selectedVolunteerIds.length} selected volunteer accounts? This will permanently delete all their XP ledger entries, program applications, and notifications. This cannot be undone!`)) {
      return
    }
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedVolunteerIds }),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to delete volunteers')
      } else {
        setMessage('Selected volunteer accounts permanently deleted')
        setSelectedVolunteerIds([])
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }



  const openManageModal = (vol: Volunteer) => {
    setSelectedVolunteer(vol)
    resetManage({
      fullName: vol.fullName,
      email: vol.email,
      telegramHandle: vol.telegramHandle || '',
      region: vol.region,
      role: vol.role,
      bio: vol.bio || '',
      password: '',
    })
    setManageModalOpen(true)
  }

  const onSendNotification = async (data: any) => {
    if (!selectedVolunteer) return
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedVolunteer.id,
          title: data.title,
          message: data.message,
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to send notification')
      } else {
        setMessage(`Notification sent to ${selectedVolunteer.fullName}`)
        resetNotify()
        setNotifyModalOpen(false)
        setSelectedVolunteer(null)
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const onManageVolunteer = async (data: any) => {
    if (!selectedVolunteer) return
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`/api/admin/users/${selectedVolunteer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          telegramHandle: data.telegramHandle || null,
          bio: data.bio || null,
          password: data.password || undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to update volunteer')
      } else {
        setMessage('Volunteer account updated successfully')
        setManageModalOpen(false)
        setSelectedVolunteer(null)
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const onDeleteVolunteer = async () => {
    if (!selectedVolunteer) return
    if (!window.confirm(`ARE YOU ABSOLUTELY SURE you want to permanently delete "${selectedVolunteer.fullName}"? This will delete all their XP ledger entries, program applications, and reward claims. This cannot be undone!`)) {
      return
    }
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`/api/admin/users/${selectedVolunteer.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to delete volunteer account')
      } else {
        setMessage('Volunteer account permanently deleted')
        setManageModalOpen(false)
        setSelectedVolunteer(null)
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const onGrantXp = async (data: { amount: number; category: string; reason: string }) => {
    if (!selectedVolunteer) return
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/admin/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedVolunteer.id,
          amount: data.amount,
          category: data.category,
          reason: data.reason,
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to allocate XP')
      } else {
        setMessage(`Successfully assigned XP to ${selectedVolunteer.fullName}`)
        resetXp()
        setXpModalOpen(false)
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const onProcessApplication = async () => {
    if (!selectedApp || !appActionType) return
    setLoading(true)
    setError('')
    try {
      const status = appActionType === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED'
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedApp.id,
          status,
          telegramGroupLink: appActionType === 'ACCEPT' ? telegramGroupLink : undefined,
          feedback: appActionType === 'DECLINE' ? declineFeedback : undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Failed to update application')
      } else {
        setAppModalOpen(false)
        setSelectedApp(null)
        setAppActionType(null)
        setTelegramGroupLink('')
        setDeclineFeedback('')
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }



  return (
    <div className="space-y-6">
      {/* Custom Checkbox SVG Definition */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="checkbox-30" viewBox="0 0 22 22">
          <path
            fill="none"
            stroke="currentColor"
            d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
          />
        </symbol>
      </svg>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[var(--violet)]/10 flex items-center justify-center text-[var(--violet-light)] shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Active Volunteers</p>
              <p className="text-2xl font-bold font-mono">{initialVolunteers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[var(--cyan)]/10 flex items-center justify-center text-[var(--cyan)] shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Pending Applications</p>
              <p className="text-2xl font-bold font-mono">
                {initialApplications.filter((a) => a.status === 'PENDING').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg-surface)] w-fit shrink-0">
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'volunteers'
                ? 'bg-[var(--violet)]/20 text-[var(--violet-light)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Volunteers
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'applications'
                ? 'bg-[var(--violet)]/20 text-[var(--violet-light)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'programs'
                ? 'bg-[var(--violet)]/20 text-[var(--violet-light)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Client Programs
          </button>
        </div>

        {activeTab === 'volunteers' && (
          <div className="flex gap-2">
            {selectedVolunteerIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={onBulkDeleteVolunteers}
                loading={loading}
                className="w-fit"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedVolunteerIds.length})
              </Button>
            )}
            <Button onClick={() => setUserModalOpen(true)} className="w-fit">
              <Plus className="h-4 w-4" />
              Add Volunteer Account
            </Button>
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="flex gap-2">
            {selectedProgramIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={onBulkDeletePrograms}
                loading={loading}
                className="w-fit"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedProgramIds.length})
              </Button>
            )}
            <Button onClick={() => { setError(''); setProgramModalOpen(true); }} className="w-fit">
              <Plus className="h-4 w-4" />
              Add Client Program
            </Button>
          </div>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className="p-3 rounded-lg bg-[var(--green)]/10 border border-[var(--green)]/20 text-[var(--green)] text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-[var(--red)]/10 border border-[var(--red)]/20 text-[var(--red)] text-sm">
          {error === 'Forbidden'
            ? 'Access Forbidden: You do not have administrator permissions or your session has expired. Please try logging out and logging back in as an administrator.'
            : error}
        </div>
      )}

      {/* Tab: Volunteers */}
      {activeTab === 'volunteers' && (
        <Card>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-xs text-[var(--text-muted)] uppercase">
                  <th className="py-3 px-4 w-10">
                    <CustomCheckbox
                      checked={selectedVolunteerIds.length === initialVolunteers.length && initialVolunteers.length > 0}
                      onChange={(checked) => {
                        if (checked) {
                          setSelectedVolunteerIds(initialVolunteers.map((v) => v.id))
                        } else {
                          setSelectedVolunteerIds([])
                        }
                      }}
                    />
                  </th>
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4 text-right">XP</th>
                  <th className="py-3 px-4 text-right">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                {initialVolunteers.map((vol) => {
                  const tierInfo = getTierInfo(vol.tier)
                  const isSelected = selectedVolunteerIds.includes(vol.id)
                  return (
                    <tr key={vol.id} className={`hover:bg-[var(--bg-surface)]/50 ${isSelected ? 'bg-[var(--violet)]/5' : ''}`}>
                      <td className="py-3.5 px-4">
                        <CustomCheckbox
                          checked={isSelected}
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedVolunteerIds((prev) => [...prev, vol.id])
                            } else {
                              setSelectedVolunteerIds((prev) => prev.filter((id) => id !== vol.id))
                            }
                          }}
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold">{vol.fullName}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{vol.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getRoleInfo(vol.role).className}`}>
                          <span>{getRoleInfo(vol.role).icon}</span>
                          <span>{getRoleInfo(vol.role).label}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">{vol.region}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tierInfo.className}`}>
                          {tierInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-[var(--violet-light)]">
                        {formatXp(vol.totalXp)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-[var(--text-secondary)] font-mono">
                        {vol.lastLoginAt ? timeAgo(vol.lastLoginAt) : 'Never'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedVolunteer(vol)
                              setXpModalOpen(true)
                            }}
                          >
                            <Zap className="h-3 w-3" />
                            Allocate XP
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedVolunteer(vol)
                              setNotifyModalOpen(true)
                            }}
                          >
                            <Bell className="h-3 w-3" />
                            Notify
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openManageModal(vol)}
                          >
                            <Settings className="h-3 w-3" />
                            Manage
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Tab: Applications */}
      {activeTab === 'applications' && (
        <Card>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-xs text-[var(--text-muted)] uppercase">
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Project Sprint</th>
                  <th className="py-3 px-4">Applied</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                {initialApplications.map((app) => {
                  const statusInfo = getStatusInfo(app.status)
                  return (
                    <tr key={app.id} className="hover:bg-[var(--bg-surface)]/50">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold">{app.user.fullName}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{app.user.email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{app.program.title}</td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {app.status === 'PENDING' || app.status === 'IN_REVIEW' ? (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              className="bg-green-500/15 text-[var(--green)] border border-green-500/25 hover:bg-green-500/25"
                              onClick={() => {
                                setSelectedApp(app)
                                setAppActionType('ACCEPT')
                                setAppModalOpen(true)
                              }}
                            >
                              <Check className="h-3 w-3" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedApp(app)
                                setAppActionType('DECLINE')
                                setAppModalOpen(true)
                              }}
                            >
                              <X className="h-3 w-3" />
                              Decline
                            </Button>
                          </div>
                        ) : app.status === 'ACCEPTED' ? (
                          <span className="text-xs text-[var(--green)] font-medium">Accepted</span>
                        ) : (
                          <span className="text-xs text-[var(--red)] font-medium">Declined</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}



      {/* Tab: Programs */}
      {activeTab === 'programs' && (
        <Card>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-xs text-[var(--text-muted)] uppercase">
                  <th className="py-3 px-4 w-10">
                    <CustomCheckbox
                      checked={selectedProgramIds.length === initialPrograms.length && initialPrograms.length > 0}
                      onChange={(checked) => {
                        if (checked) {
                          setSelectedProgramIds(initialPrograms.map((p) => p.id))
                        } else {
                          setSelectedProgramIds([])
                        }
                      }}
                    />
                  </th>
                  <th className="py-3 px-4">Client Program</th>
                  <th className="py-3 px-4">Client Type</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4">Team Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                {initialPrograms.map((prog) => {
                  const statusInfo = getStatusInfo(prog.status)
                  const isSelected = selectedProgramIds.includes(prog.id)
                  return (
                    <tr key={prog.id} className={`hover:bg-[var(--bg-surface)]/50 ${isSelected ? 'bg-[var(--violet)]/5' : ''}`}>
                      <td className="py-3.5 px-4">
                        <CustomCheckbox
                          checked={isSelected}
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedProgramIds((prev) => [...prev, prog.id])
                            } else {
                              setSelectedProgramIds((prev) => prev.filter((id) => id !== prog.id))
                            }
                          }}
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold">{prog.title}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{prog.slug}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">{prog.clientType}</td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">{prog.weeklyHours}h/week</td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                        {prog._count.applications} / {prog.maxTeamSize}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openEditModal(prog)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDeleteProgram(prog.id, prog.title)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}



      {/* Modal: Create Volunteer Account */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUserModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4 glass-strong rounded-2xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[var(--violet-light)]" />
              Create Volunteer Account
            </h3>
            <form onSubmit={handleUserSubmit(onCreateUser)} className="space-y-4">
              <Input id="admin-name" label="Full Name" placeholder="John Doe" {...regUser('fullName')} />
              <Input id="admin-email" type="email" label="Email" placeholder="volunteer@apex.uz" {...regUser('email')} />
              <Input id="admin-pass" type="password" label="Temporary Password" placeholder="••••••••" {...regUser('password')} />
              <Input id="admin-tg" label="Telegram Handle (optional)" placeholder="@telegram_handle" {...regUser('telegramHandle')} />
              <div className="grid grid-cols-2 gap-3">
                <Select id="admin-region" label="Region" options={[...REGIONS]} placeholder="Select Region" {...regUser('region')} />
                <Select id="admin-role" label="Role" options={[...ROLES]} placeholder="Select Role" {...regUser('role')} />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => setUserModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Client Program */}
      {programModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProgramModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4 glass-strong rounded-2xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-[var(--violet-light)]" />
              Add Client Program Sprint
            </h3>
            <form onSubmit={handleProgramSubmit(onCreateProgram)} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-[var(--red)]/10 border border-[var(--red)]/20 text-[var(--red)] text-xs">
                  {error}
                </div>
              )}
              <Input id="prog-title" label="Program Title" placeholder="Cafe Digital Menu Sprint" {...regProgram('title')} />
              <Textarea id="prog-desc" label="Description" placeholder="Detail the client requirements, context, and goals..." className="min-h-[100px]" {...regProgram('description')} />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  id="prog-client"
                  label="Client Type"
                  options={[
                    { value: 'RESTAURANT', label: 'Restaurant / Cafe' },
                    { value: 'CLINIC', label: 'Clinic / Healthcare' },
                    { value: 'RETAIL', label: 'Retail / Shop' },
                    { value: 'EDUCATION', label: 'Education' },
                    { value: 'SERVICES', label: 'Services' },
                    { value: 'OTHER', label: 'Other' },
                  ]}
                  {...regProgram('clientType')}
                />
                <Input id="prog-tech" label="Tech Stack (comma-separated)" placeholder="React, Next.js, Node.js" {...regProgram('techStack')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input id="prog-hours" type="number" label="Weekly Hours Commitment" {...regProgram('weeklyHours')} />
                <Input id="prog-size" type="number" label="Max Team Size" {...regProgram('maxTeamSize')} />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => setProgramModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Publish Program
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Client Program */}
      {editProgramModalOpen && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setEditProgramModalOpen(false)
            setSelectedProgram(null)
          }} />
          <div className="relative z-10 w-full max-w-lg mx-4 glass-strong rounded-2xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-[var(--violet-light)]" />
              Edit Client Program Sprint
            </h3>
            <form onSubmit={handleEditProgramSubmit(onEditProgram)} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-[var(--red)]/10 border border-[var(--red)]/20 text-[var(--red)] text-xs">
                  {error}
                </div>
              )}
              <Input id="edit-prog-title" label="Program Title" placeholder="Cafe Digital Menu Sprint" {...regEditProgram('title')} />
              <Textarea id="edit-prog-desc" label="Description" placeholder="Detail the client requirements..." className="min-h-[100px]" {...regEditProgram('description')} />
              
              <div className="grid grid-cols-2 gap-3">
                <Select
                  id="edit-prog-client"
                  label="Client Type"
                  options={[
                    { value: 'RESTAURANT', label: 'Restaurant / Cafe' },
                    { value: 'CLINIC', label: 'Clinic / Healthcare' },
                    { value: 'RETAIL', label: 'Retail / Shop' },
                    { value: 'EDUCATION', label: 'Education' },
                    { value: 'SERVICES', label: 'Services' },
                    { value: 'OTHER', label: 'Other' },
                  ]}
                  {...regEditProgram('clientType')}
                />
                <Input id="edit-prog-tech" label="Tech Stack (comma-separated)" placeholder="React, Next.js, Node.js" {...regEditProgram('techStack')} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Input id="edit-prog-hours" type="number" label="Hours" {...regEditProgram('weeklyHours')} />
                <Input id="edit-prog-size" type="number" label="Max Size" {...regEditProgram('maxTeamSize')} />
                <Select
                  id="edit-prog-status"
                  label="Status"
                  options={[
                    { value: 'RECRUITING', label: 'Recruiting' },
                    { value: 'IN_PROGRESS', label: 'In Progress' },
                    { value: 'COMPLETED', label: 'Completed' },
                  ]}
                  {...regEditProgram('status')}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => {
                  setEditProgramModalOpen(false)
                  setSelectedProgram(null)
                }}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grant XP */}
      {xpModalOpen && selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setXpModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md mx-4 glass-strong rounded-2xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[var(--violet-light)]" />
              Allocate XP
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">To: {selectedVolunteer.fullName}</p>
            <form onSubmit={handleXpSubmit(onGrantXp)} className="space-y-4">
              <Input id="xp-amount" type="number" label="XP Amount" {...regXp('amount')} />
              <Select
                id="xp-category"
                label="Activity Category"
                options={XP_RULES.map((rule) => ({ value: rule.category, label: `${rule.icon} ${rule.label} (+${rule.xp})` }))}
                {...regXp('category')}
              />
              <Textarea id="xp-reason" label="Reason / Contribution Details" placeholder="Describe the shipped task or reason..." {...regXp('reason')} />
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => setXpModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Allocate XP
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Process Application */}
      {appModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setAppModalOpen(false)
            setSelectedApp(null)
            setAppActionType(null)
          }} />
          <div className="relative z-10 w-full max-w-md mx-4 glass-strong rounded-2xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold mb-1">
              {appActionType === 'ACCEPT' ? 'Accept Application' : 'Decline Application'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              For {selectedApp.user.fullName} &bull; {selectedApp.program.title}
            </p>

            <div className="space-y-4">
              {appActionType === 'ACCEPT' ? (
                <div className="space-y-1.5">
                  <label htmlFor="modal-tg-link" className="block text-sm font-medium text-[var(--text-secondary)]">
                    Telegram Group Link (optional)
                  </label>
                  <Input
                    id="modal-tg-link"
                    type="url"
                    placeholder="https://t.me/+xyz..."
                    value={telegramGroupLink}
                    onChange={(e) => setTelegramGroupLink(e.target.value)}
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Will be displayed to the volunteer once accepted.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="modal-feedback" className="block text-sm font-medium text-[var(--text-secondary)]">
                    Constructive Feedback (optional)
                  </label>
                  <Textarea
                    id="modal-feedback"
                    placeholder="Provide feedback on why the application is declined..."
                    value={declineFeedback}
                    onChange={(e) => setDeclineFeedback(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setAppModalOpen(false)
                    setSelectedApp(null)
                    setAppActionType(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={onProcessApplication} loading={loading}>
                  Confirm Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Send Custom Notification */}
      {notifyModalOpen && selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setNotifyModalOpen(false)
            setSelectedVolunteer(null)
          }} />
          <div className="relative z-10 w-full max-w-lg mx-4 glass-strong rounded-2xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[var(--violet-light)]" />
              Send Notification to {selectedVolunteer.fullName}
            </h3>
            <form onSubmit={handleNotifySubmit(onSendNotification)} className="space-y-4">
              <Input id="notif-title" label="Notification Title" {...regNotify('title')} />
              <Textarea id="notif-msg" label="Notification Message" placeholder="Enter message here..." className="min-h-[100px]" {...regNotify('message')} />
              
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => {
                  setNotifyModalOpen(false)
                  setSelectedVolunteer(null)
                }}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Send Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Volunteer Account */}
      {manageModalOpen && selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setManageModalOpen(false)
            setSelectedVolunteer(null)
          }} />
          <div className="relative z-10 w-full max-w-lg mx-4 glass-strong rounded-2xl p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border-subtle)] pb-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Settings className="h-5 w-5 text-[var(--violet-light)]" />
                Manage Volunteer Account
              </h3>
              <span className="text-xs text-[var(--text-secondary)] font-mono">ID: {selectedVolunteer.id}</span>
            </div>
            <form onSubmit={handleManageSubmit(onManageVolunteer)} className="space-y-4">
              <Input id="mng-name" label="Full Name" {...regManage('fullName')} />
              <Input id="mng-email" type="email" label="Email Address" {...regManage('email')} />
              <Input id="mng-tg" label="Telegram Handle" placeholder="@username" {...regManage('telegramHandle')} />
              
              <div className="grid grid-cols-2 gap-3">
                <Select id="mng-region" label="Region" options={[...REGIONS]} {...regManage('region')} />
                <Select id="mng-role" label="Role" options={[...ROLES]} {...regManage('role')} />
              </div>

              <Textarea id="mng-bio" label="Bio" placeholder="Biography details..." className="min-h-[80px]" {...regManage('bio')} />
              
              <div className="border-t border-[var(--border-subtle)] pt-4 mt-2">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Reset Password</h4>
                <Input id="mng-pass" type="password" label="Temporary Password (optional)" placeholder="Set new password to reset" {...regManage('password')} />
              </div>

              <div className="border-t border-[var(--border-subtle)] pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Button type="button" variant="destructive" onClick={onDeleteVolunteer} loading={loading}>
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={() => {
                    setManageModalOpen(false)
                    setSelectedVolunteer(null)
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  )
}
