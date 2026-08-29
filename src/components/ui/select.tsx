import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            className={cn(
              'flex h-10 w-full appearance-none rounded-lg border bg-[var(--bg-surface)] px-3 py-2 pr-10 text-sm text-[var(--text-primary)] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[var(--violet)] focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-[var(--red)] focus:ring-[var(--red)]'
                : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]',
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[var(--red)]">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
