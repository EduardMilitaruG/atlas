export type WorkoutSet = {
  exercise: string
  reps: number
  weight_kg: number
}

// Epley formula — reliable for 1–12 reps
export function epley1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0
  if (reps === 1) return weightKg
  return weightKg * (1 + reps / 30)
}

export type ExercisePR = {
  exercise: string
  estimated1RM: number
  bestSet: { weight_kg: number; reps: number }
}

// From all logged sets, return the highest estimated 1RM per exercise
export function strengthBenchmarks(sets: WorkoutSet[]): ExercisePR[] {
  const byExercise = new Map<string, ExercisePR>()

  for (const set of sets) {
    if (set.reps < 1 || set.reps > 12 || set.weight_kg <= 0) continue
    const rm = epley1RM(set.weight_kg, set.reps)
    const current = byExercise.get(set.exercise)
    if (!current || rm > current.estimated1RM) {
      byExercise.set(set.exercise, {
        exercise: set.exercise,
        estimated1RM: Math.round(rm * 10) / 10,
        bestSet: { weight_kg: set.weight_kg, reps: set.reps },
      })
    }
  }

  return [...byExercise.values()].sort((a, b) => b.estimated1RM - a.estimated1RM)
}

export type WeightPoint = {
  date: string // YYYY-MM-DD
  weight_kg: number
}

// 7-day simple moving average — returns a parallel array of averages (null where insufficient data)
export function movingAverage(points: WeightPoint[], window = 7): (number | null)[] {
  return points.map((_, i) => {
    const slice = points.slice(Math.max(0, i - window + 1), i + 1)
    if (slice.length < Math.min(window, 3)) return null // need at least 3 to be meaningful
    const avg = slice.reduce((s, p) => s + p.weight_kg, 0) / slice.length
    return Math.round(avg * 10) / 10
  })
}

// Linear regression on weight data → projected date to reach goal weight
export function projectGoalDate(points: WeightPoint[], goalKg: number): Date | null {
  if (points.length < 3) return null

  const n = points.length
  const t0 = new Date(points[0]!.date).getTime()
  const xs = points.map((p) => (new Date(p.date).getTime() - t0) / 86_400_000) // days from first
  const ys = points.map((p) => p.weight_kg)

  const sumX = xs.reduce((a, b) => a + b, 0)
  const sumY = ys.reduce((a, b) => a + b, 0)
  const sumXY = xs.reduce((s, x, i) => s + x * ys[i]!, 0)
  const sumXX = xs.reduce((s, x) => s + x * x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  if (slope === 0) return null

  const daysToGoal = (goalKg - intercept) / slope
  if (!isFinite(daysToGoal) || daysToGoal < 0 || daysToGoal > 3650) return null

  const result = new Date(t0 + daysToGoal * 86_400_000)
  return result
}
