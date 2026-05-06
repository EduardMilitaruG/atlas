'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { weeklyTarget } from '@/lib/config/taper'

type CigDay = {
  log_date: string
  cigarettes_count: number | null
}

type Props = {
  logs: CigDay[]
}

export function CigaretteTaperChart({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-zinc-500">
        No data yet — cigarettes are logged in the check-in.
      </div>
    )
  }

  const data = logs.map((d) => {
    const date = new Date(d.log_date)
    const target = weeklyTarget(date)
    const count = d.cigarettes_count ?? 0
    return {
      date: d.log_date.slice(5), // MM-DD
      count,
      target,
      over: count > target,
    }
  })

  const daysOver = data.filter((d) => d.over).length
  const total = data.length

  return (
    <div className="space-y-3">
      <div className="flex gap-4 text-sm">
        <span className="text-zinc-400">
          On target: <span className="text-emerald-400 font-semibold">{total - daysOver}</span>/
          {total} days
        </span>
        {daysOver > 0 && (
          <span className="text-zinc-400">
            Over: <span className="text-rose-400 font-semibold">{daysOver}</span>
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#71717a' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 10, fill: '#71717a' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
            labelStyle={{ color: '#a1a1aa', fontSize: 11 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="count" name="Cigarettes" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.over ? '#f87171' : '#34d399'} fillOpacity={0.8} />
            ))}
          </Bar>
          <Line
            type="stepAfter"
            dataKey="target"
            stroke="#fbbf24"
            strokeWidth={1.5}
            dot={false}
            name="Target"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-xs text-zinc-500 text-right">
        Green = on/under target · amber line = weekly target
      </p>
    </div>
  )
}
