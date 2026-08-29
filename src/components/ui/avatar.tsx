'use client'

import * as React from 'react'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false)

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={cn(
          'rounded-full object-cover ring-2 ring-[var(--border-subtle)]',
          sizeClasses[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold bg-gradient-to-br from-[var(--violet)] to-[var(--violet-dark)] text-white ring-2 ring-[var(--border-subtle)]',
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
