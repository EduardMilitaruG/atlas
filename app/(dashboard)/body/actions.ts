'use server'

import { createServerClient } from '@/lib/supabase/server'
import { upsertWeightLog, upsertEyeObservation } from '@/lib/supabase/queries/body'
import type { Database } from '@/types/database'

function localDateKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function logWeight(weightKg: number): Promise<void> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  await upsertWeightLog(supabase, user.id, localDateKey(), weightKg)
}

export async function logEyeObservation(
  payload: Omit<
    Database['public']['Tables']['eye_observations']['Insert'],
    'user_id' | 'id' | 'created_at'
  >
): Promise<void> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  await upsertEyeObservation(supabase, { ...payload, user_id: user.id })
}
