import type { DailyLogInput, ProductivityInput } from '@/types/scoring'

export function dailyLifeScore(log: DailyLogInput): number {
  const sleep = Math.min(25, (log.sleep_hours / 7.5) * 25)

  const movement =
    log.workout_logged || log.steps_count >= 8000 ? 20 : log.steps_count >= 4000 ? 10 : 0

  const mood = (log.mood / 5) * 15

  const cigs_under_target = log.cigarettes_count <= log.weekly_cig_target
  const habits =
    (log.minox_am ? 5 : 0) +
    (log.finasteride ? 5 : 0) +
    (log.journaled ? 5 : 0) +
    (cigs_under_target ? 5 : 0)

  const hard = log.hard_thing_done ? 20 : 0

  return Math.round(sleep + movement + mood + habits + hard)
}

export function healthIndex(logs: DailyLogInput[]): number {
  if (logs.length === 0) return 0
  const n = logs.length

  const sleepAvg = logs.reduce((s, l) => s + l.sleep_hours, 0) / n
  const sleepScore = Math.min(100, (sleepAvg / 7.5) * 100) * 0.4

  const workoutDays = logs.filter((l) => l.workout_logged).length
  const workoutScore = (workoutDays / n) * 100 * 0.3

  const underTargetDays = logs.filter((l) => l.cigarettes_count <= l.weekly_cig_target).length
  const smokingScore = (underTargetDays / n) * 100 * 0.15

  const moodAvg = logs.reduce((s, l) => s + l.mood, 0) / n
  const moodScore = (moodAvg / 5) * 100 * 0.15

  return Math.round(sleepScore + workoutScore + smokingScore + moodScore)
}

// 5 applications/day × 7 = 35/week; 1h skills/day; 30min reading/day; 2h deep work/day
export function productivityScore(input: ProductivityInput): number {
  const appScore = Math.min(100, (input.applicationsThisWeek / 35) * 100) * 0.5
  const skillsScore = Math.min(100, (input.skillsPracticeHours / 7) * 100) * 0.25
  const readingScore = Math.min(100, (input.readingMinutes / 210) * 100) * 0.15
  const deepWorkScore = Math.min(100, (input.deepWorkHours / 14) * 100) * 0.1

  return Math.round(appScore + skillsScore + readingScore + deepWorkScore)
}
