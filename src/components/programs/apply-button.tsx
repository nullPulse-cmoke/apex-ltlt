'use client'

import { useState } from 'react'
import { ApplyModal } from '@/components/programs/apply-modal'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface ApplyButtonProps {
  programId: string
  programTitle: string
  hasApplied: boolean
}

export function ApplyButton({ programId, programTitle, hasApplied }: ApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (hasApplied) {
    return (
      <Button variant="secondary" disabled className="w-full">
        Already Applied
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Send className="h-4 w-4" />
        Apply for Program
      </Button>
      <ApplyModal
        programId={programId}
        programTitle={programTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
