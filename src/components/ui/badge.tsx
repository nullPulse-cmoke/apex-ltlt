import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]',
        violet: 'bg-violet-500/15 text-[var(--violet-light)] border border-violet-500/25',
        cyan: 'bg-cyan-500/15 text-[var(--cyan)] border border-cyan-500/25',
        orange: 'bg-orange-500/15 text-[var(--orange)] border border-orange-500/25',
        green: 'bg-green-500/15 text-[var(--green)] border border-green-500/25',
        red: 'bg-red-500/15 text-[var(--red)] border border-red-500/25',
        yellow: 'bg-yellow-500/15 text-[var(--yellow)] border border-yellow-500/25',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
