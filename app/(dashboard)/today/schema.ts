import { z } from 'zod'

export const todaySchema = z.object({
  // Hard thing
  hard_thing_done: z.boolean(),
  hard_thing_text: z.string(),

  // Sleep
  sleep_hours: z.number().min(0).max(24),
  sleep_quality: z.number().int().min(1).max(5),

  // Mood / stress
  mood: z.number().int().min(0).max(5),
  stress: z.number().int().min(1).max(10),

  // Cigs / water / food
  cigarettes_count: z.number().int().min(0),
  water_glasses: z.number().int().min(0).max(12),
  protein_hit: z.boolean(),
  last_caffeine_time: z.string(), // 'HH:MM' or ''

  // Steps
  steps_count: z.number().int().min(0),

  // Supplements
  minox_am: z.boolean(),
  minox_pm: z.boolean(),
  finasteride: z.boolean(),
  creatine: z.boolean(),
  magnesium: z.boolean(),
  omega3: z.boolean(),
  vitamin_d: z.boolean(),

  // Workout
  workout_type: z.enum(['push', 'pull', 'legs', 'cardio', 'rest', '']),
  workout_duration_min: z.number().int().min(0),

  // Looksmax
  flossed: z.boolean(),
  whitening: z.boolean(),
  skincare_am: z.boolean(),
  skincare_pm: z.boolean(),
  posture_exercises: z.boolean(),

  // Social
  in_person_interactions: z.number().int().min(0),

  // Notes
  notes: z.string(),
})

export type TodayFormValues = z.infer<typeof todaySchema>

export const defaultValues: TodayFormValues = {
  hard_thing_done: false,
  hard_thing_text: '',
  sleep_hours: 7,
  sleep_quality: 3,
  mood: 3,
  stress: 5,
  cigarettes_count: 0,
  water_glasses: 0,
  protein_hit: false,
  last_caffeine_time: '',
  steps_count: 0,
  minox_am: false,
  minox_pm: false,
  finasteride: false,
  creatine: false,
  magnesium: false,
  omega3: false,
  vitamin_d: false,
  workout_type: '',
  workout_duration_min: 0,
  flossed: false,
  whitening: false,
  skincare_am: false,
  skincare_pm: false,
  posture_exercises: false,
  in_person_interactions: 0,
  notes: '',
}
