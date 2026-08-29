import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            'flex min-h-[100px] w-full rounded-lg border bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors resize-y',
            'focus:outline-none focus:ring-2 focus:ring-[var(--violet)] focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-[var(--red)] focus:ring-[var(--red)]'
              : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-[var(--red)]">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
