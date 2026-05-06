'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { TodayFormValues } from './schema'

function localDateKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function getAuthUser() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return { supabase, user }
}

export async function autoSave(data: Partial<TodayFormValues>): Promise<void> {
  const { supabase, user } = await getAuthUser()
  const dateKey = localDateKey()

  await Promise.all([
    supabase.from('daily_logs').upsert(
      {
        user_id: user.id,
        log_date: dateKey,
        sleep_hours: data.sleep_hours ?? null,
        sleep_quality: data.sleep_quality ?? null,
        mood: data.mood ?? null,
        stress: data.stress ?? null,
        cigarettes_count: data.cigarettes_count ?? null,
        water_glasses: data.water_glasses ?? null,
        protein_grams: data.protein_hit ? 150 : data.protein_hit === false ? 0 : null,
        last_caffeine_time: data.last_caffeine_time ?? null,
        hard_thing_done: data.hard_thing_done ?? null,
        hard_thing_text: data.hard_thing_text ?? null,
        notes: data.notes ?? null,
        steps_count: data.steps_count ?? null,
      },
      { onConflict: 'user_id,log_date' }
    ),

    supabase.from('supplements_log').upsert(
      {
        user_id: user.id,
        log_date: dateKey,
        minox_am: data.minox_am ?? false,
        minox_pm: data.minox_pm ?? false,
        finasteride: data.finasteride ?? false,
        creatine: data.creatine ?? false,
        magnesium: data.magnesium ?? false,
        omega3: data.omega3 ?? false,
        vitamin_d: data.vitamin_d ?? false,
      },
      { onConflict: 'user_id,log_date' }
    ),

    supabase.from('looksmax_log').upsert(
      {
        user_id: user.id,
        log_date: dateKey,
        flossed: data.flossed ?? false,
        whitening: data.whitening ?? false,
        skincare_am: data.skincare_am ?? false,
        skincare_pm: data.skincare_pm ?? false,
        posture_exercises: data.posture_exercises ?? false,
      },
      { onConflict: 'user_id,log_date' }
    ),

    supabase.from('social_log').upsert(
      {
        user_id: user.id,
        log_date: dateKey,
        in_person_interactions: data.in_person_interactions ?? 0,
      },
      { onConflict: 'user_id,log_date' }
    ),

    data.workout_type
      ? supabase.from('workouts').upsert(
          {
            user_id: user.id,
            workout_date: dateKey,
            type: data.workout_type,
            duration_min: data.workout_duration_min ?? null,
          },
          { onConflict: 'user_id,workout_date' }
        )
      : Promise.resolve(),
  ])
}

export async function submitCheckIn(data: TodayFormValues): Promise<void> {
  const { supabase, user } = await getAuthUser()
  const dateKey = localDateKey()

  await autoSave(data)

  await supabase
    .from('daily_logs')
    .update({ submitted_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('log_date', dateKey)
}
