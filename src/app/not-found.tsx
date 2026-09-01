'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Compass, Trophy, User, Sparkles, AlertCircle } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[var(--violet-dark)] selection:text-[var(--text-primary)]">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center space-y-8 animate-fade-in">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-[var(--border-default)] text-xs font-mono tracking-wider text-[var(--text-secondary)] shadow-lg animate-float">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>HTTP 404 • PAGE_NOT_FOUND</span>
        </div>

        {/* Hero 404 Number & Title */}
        <div className="relative">
          <h1 className="text-[9rem] sm:text-[12rem] font-black leading-none tracking-tighter gradient-text select-none drop-shadow-[0_10px_35px_rgba(255,255,255,0.12)]">
            404
          </h1>
          <div className="absolute -bottom-2 inset-x-0 h-12 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
        </div>

        <div className="space-y-3 -mt-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Страница не найдена
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
            Похоже, запрашиваемый ресурс был перемещен, удален или никогда не существовал в экосистеме APEX.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass hover:bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>Вернуться назад</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl btn-gradient text-sm font-semibold shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>На главную страницу</span>
          </Link>
        </div>

        {/* Quick Navigation Cards */}
        <div className="w-full pt-6 border-t border-[var(--border-subtle)]">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-4">
            Полезные разделы APEX
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Link
              href="/programs"
              className="p-4 rounded-xl glass hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all group card-glow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <Compass className="w-5 h-5 text-[var(--violet-light)] group-hover:scale-110 transition-transform" />
                <Sparkles className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--violet-light)] transition-colors" />
              </div>
              <div>
                <h3 className="text-sm font-semibold group-hover:text-white transition-colors">Программы</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Доступные волонтерские проекты</p>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className="p-4 rounded-xl glass hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all group card-glow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <Sparkles className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-sm font-semibold group-hover:text-white transition-colors">Лидерборд</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Топ участников и рейтинг</p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="p-4 rounded-xl glass hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all group card-glow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <User className="w-5 h-5 text-[var(--cyan-light)] group-hover:scale-110 transition-transform" />
                <Sparkles className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--cyan-light)] transition-colors" />
              </div>
              <div>
                <h3 className="text-sm font-semibold group-hover:text-white transition-colors">Мой профиль</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">XP, награды и статистика</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Brand Watermark */}
        <div className="pt-4 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>APEX GROUP • VOLUNTEER ECOSYSTEM</span>
        </div>

      </div>
    </main>
  )
}
