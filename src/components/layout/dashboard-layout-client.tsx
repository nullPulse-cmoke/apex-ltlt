'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

interface DashboardLayoutClientProps {
  children: React.ReactNode
  sidebarUser: any
  topbarUser: any
  rank: any
}

export function DashboardLayoutClient({
  children,
  sidebarUser,
  topbarUser,
  rank,
}: DashboardLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar
        user={sidebarUser}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          user={topbarUser}
          rank={rank}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
