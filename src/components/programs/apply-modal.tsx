'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ApplyModalProps {
  programId: string
  programTitle: string
  isOpen: boolean
  onClose: () => void
}

export function ApplyModal({ programId, programTitle, isOpen, onClose }: ApplyModalProps) {
  const router = useRouter()
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen) return null
  if (!mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId, coverLetter }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to submit application')
        setLoading(false)
        return
      }

      onClose()
      router.refresh()
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-55 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 glass-strong rounded-2xl p-6 animate-slide-up shadow-2xl">
        <h3 className="text-xl font-bold mb-1">Apply for Program</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-5">{programTitle}</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--red)]/10 border border-[var(--red)]/20 text-[var(--red)] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            id="apply-cover-letter"
            label="Cover Letter (optional)"
            placeholder="Tell us why you'd be a great fit for this project..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="min-h-[150px]"
          />

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
