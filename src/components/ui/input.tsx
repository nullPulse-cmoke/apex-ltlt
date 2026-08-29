import * as React from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === 'password'
    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={actualType}
            id={id}
            className={cn(
              'flex h-11 w-full rounded-lg border bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--violet)] focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              isPassword && 'pr-10',
              error
                ? 'border-[var(--red)] focus:ring-[var(--red)]'
                : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]',
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-[var(--text-muted)]">
              {icon}
            </div>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
              ) : (
                <Eye className="h-4.5 w-4.5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-[var(--red)]">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }

