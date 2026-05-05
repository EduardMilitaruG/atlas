export interface DailyLogInput {
  sleep_hours: number
  mood: number // 1–5
  cigarettes_count: number
  weekly_cig_target: number // from taper schedule, injected by server action
  hard_thing_done: boolean
  minox_am: boolean
  finasteride: boolean
  workout_logged: boolean // derived: workouts row exists for this date
  steps_count: number // from daily_logs.steps_count; defaults to 0 if null
  journaled: boolean // derived: journal_entries row exists for this date
}

export interface Last7DaysInput {
  logs: DailyLogInput[]
  workoutDates: string[] // ISO date strings when a workout was logged
  readingMinutes: number
  applicationsThisWeek: number
  deepWorkHours: number
}
