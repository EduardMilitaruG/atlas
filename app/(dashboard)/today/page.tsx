import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getTodaySnapshot } from '@/lib/supabase/queries/daily-logs'
import { weeklyTarget } from '@/lib/config/taper'
import { TodayCheckIn } from '@/components/feature/TodayCheckIn'

function localDateKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default async function TodayPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const dateKey = localDateKey()
  const snapshot = await getTodaySnapshot(supabase, dateKey)
  const taperTarget = weeklyTarget(new Date())

  return (
    <div className="max-w-xl mx-auto px-4 pt-6">
      <TodayCheckIn snapshot={snapshot} dateKey={dateKey} taperTarget={taperTarget} />
    </div>
  )
}
