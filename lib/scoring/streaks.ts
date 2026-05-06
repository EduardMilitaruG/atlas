import type { HabitLogEntry } from '@/types/scoring'

function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function streakLength(entries: HabitLogEntry[]): number {
  if (entries.length === 0) return 0

  const byDate = new Map(entries.map((e) => [e.date, e.completed]))

  // Earliest logged date — we never walk further back than this
  const sortedDates = [...byDate.keys()].sort()
  const earliestDate = sortedDates[0]
  if (!earliestDate) return 0

  const freezesByMonth: Record<string, number> = {}

  const today = new Date()
  const todayKey = localDateKey(today)

  // Start from today if completed; otherwise start from yesterday
  const cursor = new Date(today)
  if (!byDate.get(todayKey)) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0

  for (let i = 0; i < 365; i++) {
    const key = localDateKey(cursor)

    // Do not walk past the earliest known entry
    if (key < earliestDate) break

    const monthKey = key.slice(0, 7)
    const completed = byDate.get(key) ?? false

    if (completed) {
      streak++
    } else {
      // A freeze can only protect an existing streak, not start one
      if (streak === 0) break
      const used = freezesByMonth[monthKey] ?? 0
      if (used < 1) {
        freezesByMonth[monthKey] = used + 1
        streak++
      } else {
        break
      }
    }

    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
