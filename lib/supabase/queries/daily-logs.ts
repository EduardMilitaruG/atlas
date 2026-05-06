import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type DailyLogRow = Database['public']['Tables']['daily_logs']['Row']
type SupplementsRow = Database['public']['Tables']['supplements_log']['Row']
type LooksmaxRow = Database['public']['Tables']['looksmax_log']['Row']
type WorkoutRow = Database['public']['Tables']['workouts']['Row']
type SocialRow = Database['public']['Tables']['social_log']['Row']

export type TodaySnapshot = {
  dailyLog: DailyLogRow | null
  supplementsLog: SupplementsRow | null
  looksmaxLog: LooksmaxRow | null
  workout: WorkoutRow | null
  socialLog: SocialRow | null
  isSubmitted: boolean
}

export async function getTodaySnapshot(
  supabase: SupabaseClient<Database>,
  dateKey: string
): Promise<TodaySnapshot> {
  const [daily, supps, looks, workout, social] = await Promise.all([
    supabase.from('daily_logs').select('*').eq('log_date', dateKey).maybeSingle(),
    supabase.from('supplements_log').select('*').eq('log_date', dateKey).maybeSingle(),
    supabase.from('looksmax_log').select('*').eq('log_date', dateKey).maybeSingle(),
    supabase
      .from('workouts')
      .select('*')
      .eq('workout_date', dateKey)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('social_log').select('*').eq('log_date', dateKey).maybeSingle(),
  ])

  return {
    dailyLog: daily.data,
    supplementsLog: supps.data,
    looksmaxLog: looks.data,
    workout: workout.data,
    socialLog: social.data,
    isSubmitted: daily.data?.submitted_at != null,
  }
}
