'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Activity, Brain, Briefcase, DollarSign } from 'lucide-react'

const tabs = [
  { href: '/today', label: 'Today', icon: Sun },
  { href: '/body', label: 'Body', icon: Activity },
  { href: '/mind', label: 'Mind', icon: Brain },
  { href: '/work', label: 'Work', icon: Briefcase },
  { href: '/money', label: 'Money', icon: DollarSign },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950 md:hidden">
      <div className="flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
                active ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
