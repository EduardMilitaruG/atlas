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

export interface ProductivityInput {
  applicationsThisWeek: number
  skillsPracticeHours: number // manual or derived from deep work sessions
  readingMinutes: number
  deepWorkHours: number
}

export interface HabitLogEntry {
  date: string // ISO date YYYY-MM-DD
  completed: boolean
}
