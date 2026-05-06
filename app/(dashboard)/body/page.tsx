import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import {
  getWeightLogs,
  getWorkouts,
  getAllWorkoutSets,
  getSupplementsLogs,
  getLooksmaxLogs,
  getCigaretteLogs,
  getEyeObservations,
} from '@/lib/supabase/queries/body'
import { WeightChart } from '@/components/feature/WeightChart'
import { WeightLogger } from '@/components/feature/WeightLogger'
import { WorkoutHistory } from '@/components/feature/WorkoutHistory'
import { StrengthBenchmarks } from '@/components/feature/StrengthBenchmarks'
import { CigaretteTaperChart } from '@/components/feature/CigaretteTaperChart'
import { LooksmaxStreaks } from '@/components/feature/LooksmaxStreaks'
import { EyeLog } from '@/components/feature/EyeLog'

const BULK_GOAL_KG = 88

export default async function BodyPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [weightLogs, workouts, allSets, supplements, looksmax, cigLogs, eyeObs] = await Promise.all(
    [
      getWeightLogs(supabase),
      getWorkouts(supabase),
      getAllWorkoutSets(supabase),
      getSupplementsLogs(supabase),
      getLooksmaxLogs(supabase),
      getCigaretteLogs(supabase),
      getEyeObservations(supabase),
    ]
  )

  const weightPoints = weightLogs.map((w) => ({
    date: w.log_date,
    weight_kg: w.weight_kg,
  }))

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 space-y-6 pb-24">
      <h1 className="text-lg font-semibold">Body</h1>

      <Section title="Weight">
        <WeightChart points={weightPoints} goalKg={BULK_GOAL_KG} />
        <div className="pt-2">
          <WeightLogger />
        </div>
      </Section>

      <Section title="Cigarette taper">
        <CigaretteTaperChart logs={cigLogs} />
      </Section>

      <Section title="Streak tracker">
        <LooksmaxStreaks supplements={supplements} looksmax={looksmax} />
      </Section>

      <Section title="Workout history">
        <WorkoutHistory workouts={workouts} />
      </Section>

      <Section title="Strength benchmarks">
        <StrengthBenchmarks sets={allSets} />
      </Section>

      <Section title="Eye observations">
        <EyeLog observations={eyeObs} />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</h2>
      {children}
    </div>
  )
}
