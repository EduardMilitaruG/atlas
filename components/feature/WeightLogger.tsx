'use client'

import { useState } from 'react'
import { logWeight } from '@/app/(dashboard)/body/actions'

export function WeightLogger() {
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const kg = parseFloat(value)
    if (!kg || kg < 30 || kg > 250) return
    setSaving(true)
    try {
      await logWeight(kg)
      setSaved(true)
      setValue('')
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="number"
        step="0.1"
        min="30"
        max="250"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="kg"
        className="w-24 rounded-lg bg-zinc-800 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-zinc-600"
      />
      <button
        type="submit"
        disabled={saving || !value}
        className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-40"
      >
        {saving ? '…' : saved ? '✓ Saved' : 'Log weight'}
      </button>
    </form>
  )
}
