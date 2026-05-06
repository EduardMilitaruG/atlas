import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type WeightRow = Database['public']['Tables']['weight_logs']['Row']
type WorkoutRow = Database['public']['Tables']['workouts']['Row']
type WorkoutSetRow = Database['public']['Tables']['workout_sets']['Row']
type SupplementsRow = Database['public']['Tables']['supplements_log']['Row']
type LooksmaxRow = Database['public']['Tables']['looksmax_log']['Row']
type DailyLogRow = Database['public']['Tables']['daily_logs']['Row']
type EyeRow = Database['public']['Tables']['eye_observations']['Row']

export type WorkoutWithSets = WorkoutRow & { sets: WorkoutSetRow[] }

export async function getWeightLogs(
  supabase: SupabaseClient<Database>,
  limitDays = 90
): Promise<WeightRow[]> {
  const since = new Date()
  since.setDate(since.getDate() - limitDays)
  const { data } = await supabase
    .from('weight_logs')
    .select('*')
    .gte('log_date', since.toISOString().slice(0, 10))
    .order('log_date', { ascending: true })
  return data ?? []
}

export async function upsertWeightLog(
  supabase: SupabaseClient<Database>,
  userId: string,
  dateKey: string,
  weightKg: number
): Promise<void> {
  await supabase
    .from('weight_logs')
    .upsert(
      { user_id: userId, log_date: dateKey, weight_kg: weightKg },
      { onConflict: 'user_id,log_date' }
    )
}

export async function getWorkouts(
  supabase: SupabaseClient<Database>,
  limitDays = 60
): Promise<WorkoutRow[]> {
  const since = new Date()
  since.setDate(since.getDate() - limitDays)
  const { data } = await supabase
    .from('workouts')
    .select('*')
    .gte('workout_date', since.toISOString().slice(0, 10))
    .order('workout_date', { ascending: false })
  return data ?? []
}

export async function getWorkoutWithSets(
  supabase: SupabaseClient<Database>,
  workoutId: string
): Promise<WorkoutWithSets | null> {
  const [workout, sets] = await Promise.all([
    supabase.from('workouts').select('*').eq('id', workoutId).single(),
    supabase
      .from('workout_sets')
      .select('*')
      .eq('workout_id', workoutId)
      .order('set_number', { ascending: true }),
  ])
  if (!workout.data) return null
  return { ...workout.data, sets: sets.data ?? [] }
}

export async function getAllWorkoutSets(
  supabase: SupabaseClient<Database>
): Promise<WorkoutSetRow[]> {
  const { data } = await supabase.from('workout_sets').select('*').gt('reps', 0).gt('weight_kg', 0)
  return data ?? []
}

export async function getSupplementsLogs(
  supabase: SupabaseClient<Database>,
  limitDays = 90
): Promise<SupplementsRow[]> {
  const since = new Date()
  since.setDate(since.getDate() - limitDays)
  const { data } = await supabase
    .from('supplements_log')
    .select('*')
    .gte('log_date', since.toISOString().slice(0, 10))
    .order('log_date', { ascending: true })
  return data ?? []
}

export async function getLooksmaxLogs(
  supabase: SupabaseClient<Database>,
  limitDays = 90
): Promise<LooksmaxRow[]> {
  const since = new Date()
  since.setDate(since.getDate() - limitDays)
  const { data } = await supabase
    .from('looksmax_log')
    .select('*')
    .gte('log_date', since.toISOString().slice(0, 10))
    .order('log_date', { ascending: true })
  return data ?? []
}

export async function getCigaretteLogs(
  supabase: SupabaseClient<Database>,
  limitDays = 60
): Promise<Pick<DailyLogRow, 'log_date' | 'cigarettes_count'>[]> {
  const since = new Date()
  since.setDate(since.getDate() - limitDays)
  const { data } = await supabase
    .from('daily_logs')
    .select('log_date, cigarettes_count')
    .gte('log_date', since.toISOString().slice(0, 10))
    .order('log_date', { ascending: true })
  return data ?? []
}

export async function getEyeObservations(supabase: SupabaseClient<Database>): Promise<EyeRow[]> {
  const { data } = await supabase
    .from('eye_observations')
    .select('*')
    .order('observed_on', { ascending: false })
    .limit(30)
  return data ?? []
}

export async function upsertEyeObservation(
  supabase: SupabaseClient<Database>,
  payload: Database['public']['Tables']['eye_observations']['Insert']
): Promise<void> {
  await supabase.from('eye_observations').upsert(payload, { onConflict: 'user_id,observed_on' })
}
