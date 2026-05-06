'use client'

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { movingAverage, projectGoalDate, type WeightPoint } from '@/lib/scoring/body'

type Props = {
  points: WeightPoint[]
  goalKg: number
}

export function WeightChart({ points, goalKg }: Props) {
  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-zinc-500">
        No weight data yet — log your first weigh-in below.
      </div>
    )
  }

  const averages = movingAverage(points)
  const latest = points[points.length - 1]!
  const weekAgo = points.find(
    (p) =>
      p.date <=
      (() => {
        const d = new Date(latest.date)
        d.setDate(d.getDate() - 7)
        return d.toISOString().slice(0, 10)
      })()
  )
  const delta = weekAgo ? Math.round((latest.weight_kg - weekAgo.weight_kg) * 10) / 10 : null
  const projected = projectGoalDate(points, goalKg)

  const chartData = points.map((p, i) => ({
    date: p.date.slice(5), // MM-DD
    weight: p.weight_kg,
    avg: averages[i],
  }))

  const weights = points.map((p) => p.weight_kg)
  const yMin = Math.floor(Math.min(...weights) - 1)
  const yMax = Math.ceil(Math.max(...weights) + 1)

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Current" value={`${latest.weight_kg} kg`} />
        <Stat
          label="Δ 7 days"
          value={delta !== null ? `${delta > 0 ? '+' : ''}${delta} kg` : '—'}
          color={delta === null ? '' : delta > 0 ? 'text-emerald-400' : 'text-rose-400'}
        />
        <Stat
          label="Goal date"
          value={
            projected
              ? projected.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
              : '—'
          }
        />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#71717a' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 10, fill: '#71717a' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
            labelStyle={{ color: '#a1a1aa', fontSize: 11 }}
            itemStyle={{ fontSize: 12 }}
          />
          <ReferenceLine y={goalKg} stroke="#34d399" strokeDasharray="4 4" strokeWidth={1} />
          {/* Raw points */}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#52525b"
            strokeWidth={1}
            dot={{ r: 2, fill: '#52525b', strokeWidth: 0 }}
            name="Weight"
          />
          {/* 7-day MA */}
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#e4e4e7"
            strokeWidth={2}
            dot={false}
            name="7-day avg"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-xs text-zinc-500 text-right">
        Green line = {goalKg} kg goal · white = 7-day avg
      </p>
    </div>
  )
}

function Stat({ label, value, color = '' }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-lg bg-zinc-800 p-3 text-center">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className={`text-base font-semibold tabular-nums mt-0.5 ${color}`}>{value}</p>
    </div>
  )
}
