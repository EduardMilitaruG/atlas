import { strengthBenchmarks } from '@/lib/scoring/body'
import type { Database } from '@/types/database'

type WorkoutSetRow = Database['public']['Tables']['workout_sets']['Row']

type Props = {
  sets: WorkoutSetRow[]
}

const KEY_LIFTS = ['bench', 'squat', 'deadlift', 'ohp', 'overhead press', 'pull-up', 'pull-ups']

export function StrengthBenchmarks({ sets }: Props) {
  const validSets = sets
    .filter((s) => s.reps != null && s.weight_kg != null && s.reps > 0 && s.weight_kg > 0)
    .map((s) => ({ exercise: s.exercise, reps: s.reps!, weight_kg: s.weight_kg! }))

  const benchmarks = strengthBenchmarks(validSets)

  if (benchmarks.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No sets logged yet — sets will appear after your first detailed workout log.
      </p>
    )
  }

  const key = benchmarks.filter((b) => KEY_LIFTS.some((k) => b.exercise.toLowerCase().includes(k)))
  const other = benchmarks.filter(
    (b) => !KEY_LIFTS.some((k) => b.exercise.toLowerCase().includes(k))
  )

  return (
    <div className="space-y-2">
      {[...key, ...other].map((b) => (
        <div
          key={b.exercise}
          className="flex items-center justify-between py-1.5 border-b border-zinc-800 last:border-0"
        >
          <span className="text-sm capitalize">{b.exercise}</span>
          <div className="text-right">
            <span className="text-sm font-semibold tabular-nums">{b.estimated1RM} kg</span>
            <span className="ml-2 text-xs text-zinc-500">
              ({b.bestSet.weight_kg} kg × {b.bestSet.reps})
            </span>
          </div>
        </div>
      ))}
      <p className="text-xs text-zinc-500 pt-1">Estimated 1RM via Epley formula</p>
    </div>
  )
}
