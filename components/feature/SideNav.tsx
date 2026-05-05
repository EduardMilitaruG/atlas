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

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-16 border-r border-zinc-800 bg-zinc-950 fixed top-0 left-0 h-full z-50">
      <div className="flex flex-col items-center gap-1 py-4 flex-1">
        <span className="text-xs font-semibold text-zinc-400 mb-4">A</span>
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg w-full transition-colors ${
                active ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
