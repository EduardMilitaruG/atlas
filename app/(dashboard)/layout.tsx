import type { ReactNode } from 'react'
import { BottomNav } from '@/components/feature/BottomNav'
import { SideNav } from '@/components/feature/SideNav'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop only */}
      <SideNav />

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0 md:pl-16">
        <div className="mx-auto max-w-xl px-4 py-6">{children}</div>
      </main>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  )
}
