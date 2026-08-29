import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function Progress({ value, max = 100, className, showLabel, size = 'md' }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-[var(--bg-surface)] overflow-hidden', sizeClasses[size])}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
