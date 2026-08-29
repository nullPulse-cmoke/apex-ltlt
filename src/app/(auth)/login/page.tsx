'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, ArrowRight, Check } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput & { rememberMe?: boolean }>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('apex_remembered_email')
      if (savedEmail) {
        setValue('email', savedEmail)
        setValue('rememberMe', true)
      }
    }
  }, [setValue])

  const onSubmit = async (data: LoginInput & { rememberMe?: boolean }) => {
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid login or password')
      setLoading(false)
    } else {
      if (typeof window !== 'undefined') {
        if (data.rememberMe) {
          localStorage.setItem('apex_remembered_email', data.email)
        } else {
          localStorage.removeItem('apex_remembered_email')
        }
      }
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
      <p className="text-[var(--text-secondary)] text-sm mb-6">
        Sign in to your volunteer account
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--red)]/10 border border-[var(--red)]/20 text-[var(--red)] text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="login-email"
          type="text"
          label="Login / Email"
          placeholder="your login or email"
          error={errors.email?.message}
          icon={<Mail className="h-4 w-4" />}
          {...register('email')}
        />

        <Input
          id="login-password"
          type="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          icon={<Lock className="h-4 w-4" />}
          {...register('password')}
        />

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="checkbox-wrapper-30 shrink-0 flex items-center">
              <span className="checkbox">
                <input
                  id="login-remember-me"
                  type="checkbox"
                  {...register('rememberMe')}
                />
                <svg>
                  <use href="#checkbox-30" className="checkbox" />
                </svg>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                <symbol id="checkbox-30" viewBox="0 0 22 22">
                  <path
                    fill="none"
                    stroke="currentColor"
                    d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                  />
                </symbol>
              </svg>
            </div>
            <label
              htmlFor="login-remember-me"
              className="cursor-pointer select-none text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Remember me
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full h-11 text-sm font-semibold" loading={loading}>
          Sign In
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
