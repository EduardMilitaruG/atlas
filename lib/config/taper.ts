// Cigarette taper schedule — hardcoded daily targets by week index from start date.
// Week 0–1 = 5/day, descending to 1/day by week 8+.
const TAPER_START = new Date('2026-05-05')
const WEEKLY_TARGETS = [5, 5, 4, 4, 3, 3, 2, 2, 1] as const

export function weeklyTarget(date: Date): number {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weekIndex = Math.floor((date.getTime() - TAPER_START.getTime()) / msPerWeek)
  const clamped = Math.max(0, Math.min(weekIndex, WEEKLY_TARGETS.length - 1))
  return WEEKLY_TARGETS[clamped] ?? 1
}
