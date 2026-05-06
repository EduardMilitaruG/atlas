import { streakLength } from '@/lib/scoring/streaks'
import type { Database } from '@/types/database'

type SupplementsRow = Database['public']['Tables']['supplements_log']['Row']
type LooksmaxRow = Database['public']['Tables']['looksmax_log']['Row']

type Props = {
  supplements: SupplementsRow[]
  looksmax: LooksmaxRow[]
}

type StreakDef = {
  label: string
  streak: number
}

export function LooksmaxStreaks({ supplements, looksmax }: Props) {
  const streaks: StreakDef[] = [
    {
      label: 'Minox AM',
      streak: streakLength(supplements.map((s) => ({ date: s.log_date, completed: s.minox_am }))),
    },
    {
      label: 'Finasteride',
      streak: streakLength(
        supplements.map((s) => ({ date: s.log_date, completed: s.finasteride }))
      ),
    },
    {
      label: 'Minox PM',
      streak: streakLength(supplements.map((s) => ({ date: s.log_date, completed: s.minox_pm }))),
    },
    {
      label: 'Floss',
      streak: streakLength(looksmax.map((l) => ({ date: l.log_date, completed: l.flossed }))),
    },
    {
      label: 'Skincare',
      streak: streakLength(
        looksmax.map((l) => ({
          date: l.log_date,
          completed: l.skincare_am && l.skincare_pm,
        }))
      ),
    },
    {
      label: 'Posture',
      streak: streakLength(
        looksmax.map((l) => ({ date: l.log_date, completed: l.posture_exercises }))
      ),
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {streaks.map(({ label, streak }) => (
        <div
          key={label}
          className={`rounded-lg p-3 text-center ${
            streak >= 7
              ? 'bg-emerald-900/30 border border-emerald-800/40'
              : streak > 0
                ? 'bg-zinc-800'
                : 'bg-zinc-900 border border-zinc-800'
          }`}
        >
          <p
            className={`text-xl font-bold tabular-nums ${
              streak >= 7 ? 'text-emerald-400' : streak > 0 ? 'text-zinc-100' : 'text-zinc-600'
            }`}
          >
            {streak}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
