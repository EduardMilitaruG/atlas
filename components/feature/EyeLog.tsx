'use client'

import { useState } from 'react'
import { logEyeObservation } from '@/app/(dashboard)/body/actions'
import type { Database } from '@/types/database'

type EyeRow = Database['public']['Tables']['eye_observations']['Row']
type Trigger = EyeRow['triggers']

const TRIGGERS: Trigger[] = ['fatigue', 'alcohol', 'screens', 'none']

type Props = {
  observations: EyeRow[]
}

export function EyeLog({ observations }: Props) {
  const [driftNoticed, setDriftNoticed] = useState(false)
  const [trigger, setTrigger] = useState<Trigger>('none')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const today = (() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await logEyeObservation({
        observed_on: today,
        drift_noticed: driftNoticed,
        triggers: trigger,
        notes: notes || null,
      })
      setDriftNoticed(false)
      setTrigger('none')
      setNotes('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quick log form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-xl bg-zinc-900 border border-zinc-800 p-4"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Log today</h3>

        <button
          type="button"
          onClick={() => setDriftNoticed(!driftNoticed)}
          className={`w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            driftNoticed
              ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50'
              : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {driftNoticed ? '⚠ Drift noticed' : 'No drift today'}
        </button>

        {driftNoticed && (
          <>
            <div className="flex gap-2 flex-wrap">
              {TRIGGERS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTrigger(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs capitalize transition-colors ${
                    trigger === t
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-zinc-100 py-2 text-sm font-medium text-zinc-900 disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save observation'}
        </button>
      </form>

      {/* History */}
      {observations.length > 0 && (
        <div className="space-y-1.5">
          {observations.slice(0, 10).map((obs) => (
            <div
              key={obs.id}
              className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2"
            >
              <span className="text-xs text-zinc-400">{obs.observed_on}</span>
              <span
                className={`text-xs font-medium ${
                  obs.drift_noticed ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {obs.drift_noticed ? `⚠ drift · ${obs.triggers ?? ''}` : '✓ clear'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
