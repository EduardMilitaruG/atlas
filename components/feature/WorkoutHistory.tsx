'use client'

import { useState } from 'react'
import type { Database } from '@/types/database'

type WorkoutRow = Database['public']['Tables']['workouts']['Row']
type WorkoutType = WorkoutRow['type']

const ALL_TYPES: WorkoutType[] = ['push', 'pull', 'legs', 'cardio', 'rest']

const TYPE_COLOR: Record<WorkoutType, string> = {
  push: 'bg-blue-900/40 text-blue-300',
  pull: 'bg-violet-900/40 text-violet-300',
  legs: 'bg-emerald-900/40 text-emerald-300',
  cardio: 'bg-amber-900/40 text-amber-300',
  rest: 'bg-zinc-800 text-zinc-400',
}

type Props = {
  workouts: WorkoutRow[]
}

export function WorkoutHistory({ workouts }: Props) {
  const [filter, setFilter] = useState<WorkoutType | 'all'>('all')

  const filtered = filter === 'all' ? workouts : workouts.filter((w) => w.type === filter)

  if (workouts.length === 0) {
    return <p className="text-sm text-zinc-500">No workouts logged yet.</p>
  }

  return (
    <div className="space-y-3">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
        {ALL_TYPES.map((t) => (
          <FilterChip key={t} label={t} active={filter === t} onClick={() => setFilter(t)} />
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${TYPE_COLOR[w.type]}`}
              >
                {w.type}
              </span>
              <span className="text-sm text-zinc-300">
                {new Date(w.workout_date).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
            {w.duration_min && (
              <span className="text-xs text-zinc-500 tabular-nums">{w.duration_min} min</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1 text-xs capitalize transition-colors ${
        active
          ? 'bg-zinc-100 text-zinc-900 font-medium'
          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
      }`}
    >
      {label}
    </button>
  )
}
