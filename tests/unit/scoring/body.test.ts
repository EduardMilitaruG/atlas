import { describe, it, expect } from 'vitest'
import {
  epley1RM,
  strengthBenchmarks,
  movingAverage,
  projectGoalDate,
  type WorkoutSet,
  type WeightPoint,
} from '@/lib/scoring/body'

describe('epley1RM', () => {
  it('returns weight itself for 1 rep', () => {
    expect(epley1RM(100, 1)).toBe(100)
  })

  it('returns 0 for invalid input', () => {
    expect(epley1RM(0, 5)).toBe(0)
    expect(epley1RM(80, 0)).toBe(0)
  })

  it('calculates correctly for 5 reps at 80kg', () => {
    // 80 * (1 + 5/30) = 80 * 1.1667 ≈ 93.33
    expect(epley1RM(80, 5)).toBeCloseTo(93.33, 1)
  })

  it('calculates correctly for 10 reps at 60kg', () => {
    // 60 * (1 + 10/30) = 60 * 1.333 = 80
    expect(epley1RM(60, 10)).toBeCloseTo(80, 1)
  })
})

describe('strengthBenchmarks', () => {
  it('returns empty array for no sets', () => {
    expect(strengthBenchmarks([])).toEqual([])
  })

  it('ignores sets with reps > 12', () => {
    const sets: WorkoutSet[] = [{ exercise: 'bench', reps: 15, weight_kg: 60 }]
    expect(strengthBenchmarks(sets)).toEqual([])
  })

  it('ignores sets with reps < 1 or weight ≤ 0', () => {
    const sets: WorkoutSet[] = [
      { exercise: 'bench', reps: 0, weight_kg: 60 },
      { exercise: 'squat', reps: 5, weight_kg: 0 },
    ]
    expect(strengthBenchmarks(sets)).toEqual([])
  })

  it('returns best 1RM per exercise', () => {
    const sets: WorkoutSet[] = [
      { exercise: 'bench', reps: 5, weight_kg: 80 },
      { exercise: 'bench', reps: 3, weight_kg: 90 }, // higher 1RM
      { exercise: 'squat', reps: 5, weight_kg: 100 },
    ]
    const results = strengthBenchmarks(sets)
    const bench = results.find((r) => r.exercise === 'bench')
    expect(bench?.bestSet.weight_kg).toBe(90)
    expect(bench?.bestSet.reps).toBe(3)
  })

  it('sorts by estimated 1RM descending', () => {
    const sets: WorkoutSet[] = [
      { exercise: 'curl', reps: 10, weight_kg: 20 }, // low 1RM
      { exercise: 'deadlift', reps: 5, weight_kg: 140 }, // high 1RM
      { exercise: 'bench', reps: 5, weight_kg: 80 },
    ]
    const results = strengthBenchmarks(sets)
    expect(results[0]!.exercise).toBe('deadlift')
  })
})

describe('movingAverage', () => {
  const points: WeightPoint[] = [
    { date: '2026-04-01', weight_kg: 85 },
    { date: '2026-04-02', weight_kg: 85.5 },
    { date: '2026-04-03', weight_kg: 84.8 },
    { date: '2026-04-04', weight_kg: 85.2 },
    { date: '2026-04-05', weight_kg: 85.1 },
    { date: '2026-04-06', weight_kg: 84.9 },
    { date: '2026-04-07', weight_kg: 85.3 },
    { date: '2026-04-08', weight_kg: 85.0 },
  ]

  it('returns null for early points with fewer than 3 values', () => {
    const result = movingAverage(points)
    expect(result[0]).toBeNull()
    expect(result[1]).toBeNull()
  })

  it('returns a number once 3+ points are available', () => {
    const result = movingAverage(points)
    expect(result[2]).not.toBeNull()
  })

  it('computes 7-day average for the 7th point', () => {
    const result = movingAverage(points, 7)
    const slice = points.slice(0, 7)
    const expected = slice.reduce((s, p) => s + p.weight_kg, 0) / 7
    expect(result[6]).toBeCloseTo(Math.round(expected * 10) / 10, 1)
  })

  it('returns parallel array of same length as input', () => {
    const result = movingAverage(points)
    expect(result).toHaveLength(points.length)
  })
})

describe('projectGoalDate', () => {
  it('returns null for fewer than 3 points', () => {
    expect(projectGoalDate([], 88)).toBeNull()
    expect(projectGoalDate([{ date: '2026-04-01', weight_kg: 85 }], 88)).toBeNull()
  })

  it('projects a future date when weight is increasing', () => {
    // Steady gain of 0.1kg/day from 85kg → target 88kg ≈ 30 days out
    const points: WeightPoint[] = Array.from({ length: 10 }, (_, i) => ({
      date: `2026-04-${String(i + 1).padStart(2, '0')}`,
      weight_kg: 85 + i * 0.1,
    }))
    const result = projectGoalDate(points, 88)
    expect(result).not.toBeNull()
    expect(result!.getTime()).toBeGreaterThan(new Date('2026-04-10').getTime())
  })

  it('returns null when trend is flat (slope = 0)', () => {
    const points: WeightPoint[] = Array.from({ length: 7 }, (_, i) => ({
      date: `2026-04-${String(i + 1).padStart(2, '0')}`,
      weight_kg: 85,
    }))
    expect(projectGoalDate(points, 88)).toBeNull()
  })
})
