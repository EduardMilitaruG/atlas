'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todaySchema, defaultValues, type TodayFormValues } from '@/app/(dashboard)/today/schema'
import { autoSave, submitCheckIn } from '@/app/(dashboard)/today/actions'
import type { TodaySnapshot } from '@/lib/supabase/queries/daily-logs'
import { dailyLifeScore } from '@/lib/scoring/daily'

const STORAGE_KEY = 'atlas:today-draft'

const MOOD_EMOJIS = ['😞', '😕', '😐', '🙂', '😄'] as const
const QUALITY_EMOJIS = ['😴', '😪', '😑', '😌', '😊'] as const

function snapshotToValues(snap: TodaySnapshot): Partial<TodayFormValues> {
  const d = snap.dailyLog
  const s = snap.supplementsLog
  const l = snap.looksmaxLog
  const w = snap.workout
  const so = snap.socialLog
  return {
    hard_thing_done: d?.hard_thing_done ?? false,
    hard_thing_text: d?.hard_thing_text ?? '',
    sleep_hours: d?.sleep_hours ?? 7,
    sleep_quality: d?.sleep_quality ?? 3,
    mood: d?.mood ?? 3,
    stress: d?.stress ?? 5,
    cigarettes_count: d?.cigarettes_count ?? 0,
    water_glasses: d?.water_glasses ?? 0,
    protein_hit: (d?.protein_grams ?? 0) >= 150,
    last_caffeine_time: d?.last_caffeine_time ?? '',
    steps_count: d?.steps_count ?? 0,
    minox_am: s?.minox_am ?? false,
    minox_pm: s?.minox_pm ?? false,
    finasteride: s?.finasteride ?? false,
    creatine: s?.creatine ?? false,
    magnesium: s?.magnesium ?? false,
    omega3: s?.omega3 ?? false,
    vitamin_d: s?.vitamin_d ?? false,
    workout_type: w?.type ?? '',
    workout_duration_min: w?.duration_min ?? 0,
    flossed: l?.flossed ?? false,
    whitening: l?.whitening ?? false,
    skincare_am: l?.skincare_am ?? false,
    skincare_pm: l?.skincare_pm ?? false,
    posture_exercises: l?.posture_exercises ?? false,
    in_person_interactions: so?.in_person_interactions ?? 0,
    notes: d?.notes ?? '',
  }
}

type Props = {
  snapshot: TodaySnapshot
  dateKey: string
  taperTarget: number
}

export function TodayCheckIn({ snapshot, dateKey, taperTarget }: Props) {
  const isSubmitted = snapshot.isSubmitted
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(isSubmitted)

  const storedDraft = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  const parsedDraft = storedDraft ? (JSON.parse(storedDraft) as Partial<TodayFormValues>) : null

  const initial: TodayFormValues = {
    ...defaultValues,
    ...snapshotToValues(snapshot),
    ...(parsedDraft ?? {}),
  }

  const { control, handleSubmit, watch } = useForm<TodayFormValues>({
    resolver: zodResolver(todaySchema),
    defaultValues: initial,
  })

  const values = watch()

  const debouncedSave = useCallback(
    (data: Partial<TodayFormValues>) => {
      if (submitted) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        setSaving('saving')
        try {
          await autoSave(data)
          setSaving('saved')
          setTimeout(() => setSaving('idle'), 2000)
        } catch {
          setSaving('error')
        }
      }, 2000)
    },
    [submitted]
  )

  useEffect(() => {
    const sub = watch((data) => {
      debouncedSave(data as Partial<TodayFormValues>)
    })
    return () => sub.unsubscribe()
  }, [watch, debouncedSave])

  async function onSubmit(data: TodayFormValues) {
    setSubmitting(true)
    try {
      await submitCheckIn(data)
      localStorage.removeItem(STORAGE_KEY)
      setSubmitted(true)
    } catch {
      alert('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const liveScore = dailyLifeScore({
    sleep_hours: values.sleep_hours,
    mood: values.mood,
    cigarettes_count: values.cigarettes_count,
    weekly_cig_target: taperTarget,
    hard_thing_done: values.hard_thing_done,
    minox_am: values.minox_am,
    finasteride: values.finasteride,
    workout_logged: values.workout_type !== '' && values.workout_type !== 'rest',
    steps_count: values.steps_count,
    journaled: values.notes.trim().length > 20,
  })

  const scoreColor =
    liveScore >= 80 ? 'text-emerald-400' : liveScore >= 55 ? 'text-amber-400' : 'text-rose-400'

  const hour = new Date().getHours()
  const isEvening = hour >= 18

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">{dateKey}</p>
          <h1 className="text-lg font-semibold">Evening check-in</h1>
        </div>
        <div className="text-right">
          <p
            className={`text-3xl font-bold tabular-nums ${submitted ? scoreColor : 'text-zinc-600'}`}
          >
            {submitted ? liveScore : '—'}
          </p>
          <p className="text-xs text-zinc-500">daily score</p>
        </div>
      </div>

      {submitted && (
        <div className="rounded-xl bg-emerald-950/40 border border-emerald-800/40 px-4 py-3 text-sm text-emerald-400">
          Check-in submitted ✓
        </div>
      )}

      {saving === 'saving' && <p className="text-xs text-zinc-500 text-right">Saving…</p>}
      {saving === 'saved' && <p className="text-xs text-emerald-500 text-right">Saved</p>}
      {saving === 'error' && (
        <p className="text-xs text-rose-500 text-right">Save failed — working offline</p>
      )}

      {/* One hard thing */}
      <Section title="One hard thing">
        <Controller
          control={control}
          name="hard_thing_text"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="What's the one hard thing today?"
              disabled={submitted}
              className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-50"
            />
          )}
        />
        <Controller
          control={control}
          name="hard_thing_done"
          render={({ field }) => (
            <Toggle
              label="Done"
              checked={field.value}
              onChange={field.onChange}
              disabled={submitted}
            />
          )}
        />
      </Section>

      {/* Sleep */}
      <Section title="Sleep">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Hours slept</label>
            <Controller
              control={control}
              name="sleep_hours"
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Stepper
                    value={field.value}
                    onChange={field.onChange}
                    min={0}
                    max={12}
                    step={0.5}
                    disabled={submitted}
                  />
                  <span className="text-sm tabular-nums">{field.value}h</span>
                </div>
              )}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Sleep quality</label>
            <Controller
              control={control}
              name="sleep_quality"
              render={({ field }) => (
                <EmojiPicker
                  emojis={QUALITY_EMOJIS}
                  value={field.value - 1}
                  onChange={(i) => field.onChange(i + 1)}
                  disabled={submitted}
                />
              )}
            />
          </div>
        </div>
      </Section>

      {/* Mood & Stress */}
      <Section title="Mood & stress">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Mood</label>
            <Controller
              control={control}
              name="mood"
              render={({ field }) => (
                <EmojiPicker
                  emojis={MOOD_EMOJIS}
                  value={field.value - 1}
                  onChange={(i) => field.onChange(i + 1)}
                  disabled={submitted}
                />
              )}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-2 block">
              Stress: <span className="text-white">{values.stress}</span>/10
            </label>
            <Controller
              control={control}
              name="stress"
              render={({ field }) => (
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled={submitted}
                  className="w-full accent-zinc-400 disabled:opacity-50"
                />
              )}
            />
          </div>
        </div>
      </Section>

      {/* Cigarettes */}
      <Section title={`Cigarettes (target: ${taperTarget}/day)`}>
        <Controller
          control={control}
          name="cigarettes_count"
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <Stepper
                value={field.value}
                onChange={field.onChange}
                min={0}
                max={40}
                step={1}
                disabled={submitted}
              />
              <span className="text-sm tabular-nums">{field.value}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  field.value <= taperTarget
                    ? 'bg-emerald-900/50 text-emerald-400'
                    : 'bg-rose-900/50 text-rose-400'
                }`}
              >
                {field.value <= taperTarget ? '✓ on target' : `+${field.value - taperTarget} over`}
              </span>
            </div>
          )}
        />
      </Section>

      {/* Water & Protein */}
      <Section title="Hydration & nutrition">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Water glasses</label>
            <Controller
              control={control}
              name="water_glasses"
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Stepper
                    value={field.value}
                    onChange={field.onChange}
                    min={0}
                    max={12}
                    step={1}
                    disabled={submitted}
                  />
                  <span className="text-sm tabular-nums">{field.value} / 12</span>
                </div>
              )}
            />
          </div>
          <Controller
            control={control}
            name="protein_hit"
            render={({ field }) => (
              <Toggle
                label="Protein hit (≥150g)"
                checked={field.value}
                onChange={field.onChange}
                disabled={submitted}
              />
            )}
          />
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Last caffeine</label>
            <Controller
              control={control}
              name="last_caffeine_time"
              render={({ field }) => (
                <input
                  {...field}
                  type="time"
                  disabled={submitted}
                  className="rounded-lg bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-50"
                />
              )}
            />
          </div>
        </div>
      </Section>

      {/* Steps */}
      <Section title="Steps">
        <Controller
          control={control}
          name="steps_count"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                disabled={submitted}
                min={0}
                className="w-28 rounded-lg bg-zinc-800 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-50"
              />
              <span className="text-xs text-zinc-400">
                {field.value >= 8000 ? '✓ 8k+' : field.value >= 4000 ? '~4k' : 'low'}
              </span>
            </div>
          )}
        />
      </Section>

      {/* Supplements stack */}
      <Section title="Stack">
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { key: 'minox_am', label: 'Minox AM', show: !isEvening },
              { key: 'finasteride', label: 'Finasteride', show: true },
              { key: 'minox_pm', label: 'Minox PM', show: isEvening },
              { key: 'creatine', label: 'Creatine', show: true },
              { key: 'magnesium', label: 'Magnesium', show: true },
              { key: 'omega3', label: 'Omega 3', show: true },
              { key: 'vitamin_d', label: 'Vitamin D', show: true },
            ] as const
          ).map(({ key, label, show }) => (
            <Controller
              key={key}
              control={control}
              name={key}
              render={({ field }) => (
                <Toggle
                  label={label}
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={submitted}
                  dimmed={!show}
                />
              )}
            />
          ))}
        </div>
      </Section>

      {/* Workout */}
      <Section title="Workout">
        <div className="space-y-3">
          <Controller
            control={control}
            name="workout_type"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {(['push', 'pull', 'legs', 'cardio', 'rest', ''] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    disabled={submitted}
                    onClick={() => field.onChange(t)}
                    className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors disabled:opacity-50 ${
                      field.value === t
                        ? 'bg-zinc-100 text-zinc-900'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {t === '' ? 'none' : t}
                  </button>
                ))}
              </div>
            )}
          />
          {values.workout_type !== '' && values.workout_type !== 'rest' && (
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Duration (min)</label>
              <Controller
                control={control}
                name="workout_duration_min"
                render={({ field }) => (
                  <input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={submitted}
                    min={0}
                    max={300}
                    className="w-24 rounded-lg bg-zinc-800 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-50"
                  />
                )}
              />
            </div>
          )}
        </div>
      </Section>

      {/* Looksmax */}
      <Section title="Looksmax">
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { key: 'flossed', label: 'Floss' },
              { key: 'whitening', label: 'Whitening' },
              { key: 'skincare_am', label: 'Skincare AM' },
              { key: 'skincare_pm', label: 'Skincare PM' },
              { key: 'posture_exercises', label: 'Posture' },
            ] as const
          ).map(({ key, label }) => (
            <Controller
              key={key}
              control={control}
              name={key}
              render={({ field }) => (
                <Toggle
                  label={label}
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={submitted}
                />
              )}
            />
          ))}
        </div>
      </Section>

      {/* Social */}
      <Section title="Social">
        <Controller
          control={control}
          name="in_person_interactions"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Stepper
                value={field.value}
                onChange={field.onChange}
                min={0}
                max={20}
                step={1}
                disabled={submitted}
              />
              <span className="text-sm">in-person interactions</span>
            </div>
          )}
        />
      </Section>

      {/* Notes */}
      <Section title="Notes">
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <textarea
              {...field}
              rows={4}
              placeholder="How did the day go? Reflections…"
              disabled={submitted}
              className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-500 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-50"
            />
          )}
        />
      </Section>

      {!submitted && (
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-900 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit evening check-in'}
        </button>
      )}
    </form>
  )
}

// ── Primitives ────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</h2>
      {children}
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  disabled,
  dimmed,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  dimmed?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
        checked
          ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
          : 'bg-zinc-800 text-zinc-400 border border-transparent'
      } ${dimmed ? 'opacity-40' : ''} disabled:cursor-not-allowed`}
    >
      <span
        className={`w-3 h-3 rounded-full border ${
          checked ? 'bg-emerald-400 border-emerald-400' : 'border-zinc-600'
        }`}
      />
      {label}
    </button>
  )
}

function EmojiPicker({
  emojis,
  value,
  onChange,
  disabled,
}: {
  emojis: readonly string[]
  value: number
  onChange: (i: number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex gap-2">
      {emojis.map((emoji, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onChange(i)}
          className={`text-2xl rounded-lg p-1.5 transition-transform ${
            value === i ? 'scale-125 bg-zinc-700' : 'opacity-50 hover:opacity-100'
          } disabled:cursor-not-allowed`}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}

function Stepper({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center text-lg disabled:opacity-30"
      >
        −
      </button>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center text-lg disabled:opacity-30"
      >
        +
      </button>
    </div>
  )
}
